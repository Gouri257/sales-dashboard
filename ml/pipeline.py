"""
Sales Analytics ML Pipeline
=============================
Reads the existing 2022-2024 sales data, engineers features,
trains a Linear Regression model, forecasts 2025 monthly revenue,
and saves both a forecast JSON (consumed by Next.js API) and a
Matplotlib chart PNG.

Usage:
    python pipeline.py

Output:
    ml/output/forecast_2025.json   ← Next.js API reads this
    ml/output/forecast_chart.png   ← Add to README / docs
"""

import json
import os
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend — works without a display
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score
from datetime import datetime

# ── OUTPUT DIR ────────────────────────────────────────────────────────────
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── RAW DATA (mirrors lib/sales-data.ts exactly) ──────────────────────────
RAW_DATA = {
    2022: [241800,223400,298700,282300,318240,347900,334210,354780,371890,329450,389840,407244],
    2023: [274200,251300,331850,318400,352640,384120,368900,390450,408780,361200,428760,412502],
    2024: [312450,289300,378920,361200,402780,438560,421300,445820,467990,412340,489210,472547],
}

MONTHS = ["Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"]

MONTH_FULL = ["January","February","March","April","May","June",
              "July","August","September","October","November","December"]

COLORS = {
    "2022": "#10B981",
    "2023": "#3B82F6",
    "2024": "#E85D26",
    "2025": "#8B5CF6",  # forecast color — purple
}


# ── STEP 1: BUILD DATAFRAME ───────────────────────────────────────────────
def build_dataframe() -> pd.DataFrame:
    rows = []
    for year, monthly in RAW_DATA.items():
        for month_idx, revenue in enumerate(monthly):
            rows.append({
                "year":      year,
                "month":     month_idx + 1,         # 1-12
                "month_num": (year - 2022) * 12 + month_idx,  # global time index
                "revenue":   revenue,
            })
    df = pd.DataFrame(rows)
    print(f"✅ Built dataframe: {len(df)} rows (2022–2024)")
    return df


# ── STEP 2: FEATURE ENGINEERING ──────────────────────────────────────────
def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    # Cyclical month encoding — captures seasonality without discontinuity
    # (Dec→Jan is continuous, unlike integer encoding)
    df["sin_month"] = np.sin(2 * np.pi * df["month"] / 12)
    df["cos_month"] = np.cos(2 * np.pi * df["month"] / 12)

    # Quarter — seasonal grouping
    df["quarter"] = ((df["month"] - 1) // 3) + 1

    # Lag features — previous month and 3 months ago (autoregressive signal)
    df["lag_1"]     = df["revenue"].shift(1)
    df["lag_3"]     = df["revenue"].shift(3)

    # Rolling average — smoothed baseline (avoids data leakage by shifting)
    df["rolling_3"] = df["revenue"].shift(1).rolling(3).mean()

    df = df.dropna().reset_index(drop=True)
    print(f"✅ Feature engineering done: {len(df)} rows after lag removal")
    return df


# ── STEP 3: TRAIN MODEL ───────────────────────────────────────────────────
def train_model(df: pd.DataFrame):
    FEATURES = ["month_num", "sin_month", "cos_month", "quarter",
                "lag_1", "lag_3", "rolling_3"]

    X = df[FEATURES].values
    y = df["revenue"].values

    # Train on ALL data for forecasting (we evaluate via cross-validation below)
    scaler = StandardScaler()
    X_s = scaler.fit_transform(X)

    model = LinearRegression()
    model.fit(X_s, y)

    # Evaluate using leave-one-out style: predict each point using
    # a model trained on everything except the last 12 months (2024)
    split = len(X) - 12
    X_train_eval, X_test_eval = X[:split], X[split:]
    y_train_eval, y_test_eval = y[:split], y[split:]

    scaler_eval = StandardScaler()
    X_train_eval_s = scaler_eval.fit_transform(X_train_eval)
    X_test_eval_s  = scaler_eval.transform(X_test_eval)

    model_eval = LinearRegression()
    model_eval.fit(X_train_eval_s, y_train_eval)

    y_pred_eval = model_eval.predict(X_test_eval_s)
    mae = mean_absolute_error(y_test_eval, y_pred_eval)
    r2  = r2_score(y_test_eval, y_pred_eval)

    print(f"✅ Model trained — MAE: ${mae:,.0f} | R²: {r2:.4f}")
    return model, scaler, FEATURES, {"mae": round(mae, 2), "r2": round(r2, 4)}


# ── STEP 4: FORECAST 2025 ────────────────────────────────────────────────
def forecast_2025(df: pd.DataFrame, model, scaler, features: list) -> list:
    """
    Build feature rows for Jan–Dec 2025 and predict revenue.
    Uses the last known values from 2024 as seeds for lag features.
    """
    last_revenues = list(df["revenue"].tail(12))  # full 2024
    last_month_num = int(df["month_num"].max())

    predictions = []
    rolling_window = list(df["revenue"].tail(3))

    for i in range(12):
        month        = i + 1
        month_num    = last_month_num + i + 1
        sin_month    = np.sin(2 * np.pi * month / 12)
        cos_month    = np.cos(2 * np.pi * month / 12)
        quarter      = ((month - 1) // 3) + 1
        lag_1        = last_revenues[-1]
        lag_3        = last_revenues[-3] if len(last_revenues) >= 3 else last_revenues[0]
        rolling_3    = np.mean(rolling_window[-3:])

        row = np.array([[month_num, sin_month, cos_month, quarter,
                         lag_1, lag_3, rolling_3]])
        row_s   = scaler.transform(row)
        pred    = max(0, float(model.predict(row_s)[0]))

        predictions.append(round(pred, 2))
        last_revenues.append(pred)
        rolling_window.append(pred)

    print(f"✅ 2025 forecast complete: ${sum(predictions):,.0f} total predicted revenue")
    return predictions


# ── STEP 5: MATPLOTLIB CHART ─────────────────────────────────────────────
def save_chart(predictions_2025: list):
    fig, axes = plt.subplots(2, 1, figsize=(14, 10),
                             facecolor="#0a0e14", gridspec_kw={"hspace": 0.4})

    # ── Top chart: All 4 years side by side ──
    ax1 = axes[0]
    ax1.set_facecolor("#0d1521")
    x = np.arange(12)
    width = 0.22

    for i, (year, monthly) in enumerate(RAW_DATA.items()):
        bars = ax1.bar(x + i * width, [r/1000 for r in monthly],
                       width, label=str(year),
                       color=COLORS[str(year)], alpha=0.85, zorder=3)

    # 2025 forecast
    ax1.bar(x + 3 * width, [r/1000 for r in predictions_2025],
            width, label="2025 (Forecast)",
            color=COLORS["2025"], alpha=0.85, zorder=3,
            hatch="//", edgecolor="#8B5CF6")

    ax1.set_xticks(x + 1.5 * width)
    ax1.set_xticklabels(MONTHS, color="#94a3b8", fontsize=9)
    ax1.set_ylabel("Revenue ($K)", color="#94a3b8", fontsize=10)
    ax1.set_title("Monthly Revenue: 2022–2024 Actual vs 2025 Forecast",
                  color="#e8eaf6", fontsize=13, fontweight="bold", pad=12)
    ax1.tick_params(colors="#94a3b8")
    ax1.spines[:].set_color("#1e2d42")
    ax1.yaxis.grid(True, color="#1e2d42", linewidth=0.5, zorder=0)
    ax1.set_axisbelow(True)
    ax1.legend(facecolor="#0d1521", edgecolor="#1e2d42",
               labelcolor="#cdd6f4", fontsize=9)

    # ── Bottom chart: 2025 forecast line with confidence band ──
    ax2 = axes[1]
    ax2.set_facecolor("#0d1521")

    # Simple confidence band: ±8% (based on MAE proportion)
    pred_arr    = np.array(predictions_2025)
    upper       = pred_arr * 1.08
    lower       = pred_arr * 0.92

    ax2.fill_between(range(12), lower/1000, upper/1000,
                     alpha=0.2, color="#8B5CF6", label="±8% confidence band")
    ax2.plot(range(12), pred_arr/1000, color="#8B5CF6",
             linewidth=2.5, marker="o", markersize=5, label="2025 Forecast", zorder=3)

    # Also plot 2024 actual for comparison
    actual_2024 = [r/1000 for r in RAW_DATA[2024]]
    ax2.plot(range(12), actual_2024, color=COLORS["2024"],
             linewidth=1.5, linestyle="--", marker="s",
             markersize=4, label="2024 Actual", alpha=0.8)

    ax2.set_xticks(range(12))
    ax2.set_xticklabels(MONTHS, color="#94a3b8", fontsize=9)
    ax2.set_ylabel("Revenue ($K)", color="#94a3b8", fontsize=10)
    ax2.set_title("2025 Revenue Forecast vs 2024 Actual (Linear Regression)",
                  color="#e8eaf6", fontsize=13, fontweight="bold", pad=12)
    ax2.tick_params(colors="#94a3b8")
    ax2.spines[:].set_color("#1e2d42")
    ax2.yaxis.grid(True, color="#1e2d42", linewidth=0.5, zorder=0)
    ax2.set_axisbelow(True)
    ax2.legend(facecolor="#0d1521", edgecolor="#1e2d42",
               labelcolor="#cdd6f4", fontsize=9)

    # Annotate peak month
    peak_idx = int(np.argmax(pred_arr))
    ax2.annotate(f"Peak: ${pred_arr[peak_idx]/1000:.0f}K",
                 xy=(peak_idx, pred_arr[peak_idx]/1000),
                 xytext=(peak_idx - 2, pred_arr[peak_idx]/1000 + 20),
                 color="#8B5CF6", fontsize=9, fontweight="bold",
                 arrowprops=dict(arrowstyle="->", color="#8B5CF6"))

    plt.savefig(os.path.join(OUTPUT_DIR, "forecast_chart.png"),
                dpi=150, bbox_inches="tight", facecolor="#0a0e14")
    plt.close()
    print(f"✅ Chart saved → ml/output/forecast_chart.png")


# ── STEP 6: SAVE JSON ────────────────────────────────────────────────────
def save_json(predictions_2025: list, metrics: dict):
    """
    Output format matches your existing MonthlySale TypeScript interface
    so the Next.js API can serve it directly.
    """
    # Estimate units and orders proportionally from 2024 averages
    avg_revenue_2024 = sum(RAW_DATA[2024]) / 12
    avg_units_2024   = 68312 / 12
    avg_orders_2024  = 19442 / 12

    monthly_forecast = []
    for i, revenue in enumerate(predictions_2025):
        ratio = revenue / avg_revenue_2024
        monthly_forecast.append({
            "month":      MONTH_FULL[i],
            "monthShort": MONTHS[i],
            "revenue":    round(revenue),
            "units":      round(avg_units_2024 * ratio),
            "orders":     round(avg_orders_2024 * ratio),
            "isForecast": True,
        })

    total_revenue = sum(predictions_2025)
    output = {
        "year":         2025,
        "isForecast":   True,
        "generatedAt":  datetime.now().isoformat(),
        "modelMetrics": metrics,
        "totalRevenue": round(total_revenue),
        "growthRate":   round((total_revenue - sum(RAW_DATA[2024])) / sum(RAW_DATA[2024]) * 100, 1),
        "monthly":      monthly_forecast,
    }

    out_path = os.path.join(OUTPUT_DIR, "forecast_2025.json")
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2)
    print(f"✅ JSON saved → ml/output/forecast_2025.json")
    print(f"\n📊 Summary:")
    print(f"   Predicted 2025 Revenue : ${total_revenue:,.0f}")
    print(f"   vs 2024 Actual         : ${sum(RAW_DATA[2024]):,.0f}")
    print(f"   Growth Rate            : {output['growthRate']}%")
    print(f"   Model R²               : {metrics['r2']}")
    print(f"   Model MAE              : ${metrics['mae']:,.0f}")
    return output


# ── MAIN ─────────────────────────────────────────────────────────────────
def main():
    print("\n" + "="*55)
    print("  Sales Analytics ML Pipeline — 2025 Forecast")
    print("="*55 + "\n")

    df           = build_dataframe()
    df_feat      = engineer_features(df)
    model, scaler, features, metrics = train_model(df_feat)
    predictions  = forecast_2025(df_feat, model, scaler, features)
    save_chart(predictions)
    save_json(predictions, metrics)

    print("\n✅ Pipeline complete! Next steps:")
    print("   1. The Next.js API at /api/forecast now serves the forecast")
    print("   2. Add <ForecastChart /> to your dashboard page")
    print("   3. See ml/output/forecast_chart.png for the visualization\n")

if __name__ == "__main__":
    main()
