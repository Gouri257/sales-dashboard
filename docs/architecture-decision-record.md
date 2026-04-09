# Architecture Decision Record (ADR)
## Sales Analytics Dashboard — ML Forecasting Extension

**Project:** Sales Analytics Dashboard  
**Author:** Sirimalla Gouri  
**Date:** April 2026  
**Status:** Accepted  

---

## Context

The Sales Analytics Dashboard visualized historical data for 2022–2024. Stakeholders needed forward-looking insights — specifically a 2025 monthly revenue forecast — to support inventory planning and budget allocation decisions.

The goal was to add a Python ML pipeline that:
1. Reads existing sales data
2. Trains a forecasting model
3. Outputs a JSON file consumed by the Next.js API
4. Renders an interactive forecast chart in the dashboard UI

---

## ADR-001: Algorithm Selection — Linear Regression over ARIMA / Prophet / LSTM

### Decision
Use **scikit-learn Linear Regression** with engineered time-series features.

### Options Considered

| Algorithm | Pros | Cons | Decision |
|---|---|---|---|
| **Linear Regression** | Interpretable, fast, no stationarity needed, auditable | Assumes linear trend | ✅ Chosen |
| ARIMA | Good for stationary time series | Requires stationarity testing, complex tuning | ❌ Rejected |
| Facebook Prophet | Auto seasonality detection | Heavy dependency, overkill for 36 data points | ❌ Rejected |
| LSTM (deep learning) | Non-linear pattern capture | Needs 200+ data points minimum, not interpretable | ❌ Rejected |

### Rationale
With only 36 months of training data (2022–2024), deep learning models would overfit severely. ARIMA requires stationarity which was not guaranteed. Linear Regression with engineered features provides the best balance of accuracy and interpretability for this dataset size. IBM's AI ethics guidelines prioritize explainable models — Linear Regression coefficients are directly interpretable by non-technical stakeholders.

---

## ADR-002: Feature Engineering Strategy

### Decision
Engineer 7 features from raw monthly revenue data:

| Feature | Type | Reason |
|---|---|---|
| `month_num` | Linear time index | Captures overall revenue growth trend |
| `sin_month` | Cyclical encoding | Captures seasonality without Dec→Jan discontinuity |
| `cos_month` | Cyclical encoding | Paired with sin for complete cyclical representation |
| `quarter` | Categorical (1-4) | Captures quarterly business patterns |
| `lag_1` | Autoregressive | Previous month revenue as predictor |
| `lag_3` | Autoregressive | 3-month-ago revenue — captures quarterly cycle |
| `rolling_3` | Smoothed baseline | 3-month rolling average reduces noise |

### Why Cyclical Encoding over One-Hot Encoding of Month
One-hot encoding treats December (month 12) and January (month 1) as maximally different. Cyclical encoding (sin/cos) correctly represents them as adjacent, which is critical for seasonal pattern recognition.

---

## ADR-003: Pipeline Output Architecture

### Decision
The ML pipeline outputs a single `forecast_2025.json` file. The Next.js API route (`/api/forecast`) reads and serves this file. The React component fetches from the API.

### Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│  lib/sales-data.ts (existing 2022-2024 data)    │
└──────────────────┬──────────────────────────────┘
                   │ data mirrored in Python
                   ▼
┌─────────────────────────────────────────────────┐
│  ml/pipeline.py                                 │
│                                                 │
│  1. Build DataFrame (36 rows)                   │
│  2. Engineer Features (7 features)              │
│  3. Train LinearRegression (80/20 split)        │
│  4. Evaluate (MAE, R²)                          │
│  5. Forecast Jan–Dec 2025 (sequential)          │
│  6. Save forecast_2025.json                     │
│  7. Save forecast_chart.png (Matplotlib)        │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│  ml/output/forecast_2025.json                   │
└──────────────────┬──────────────────────────────┘
                   │ read at request time
                   ▼
┌─────────────────────────────────────────────────┐
│  app/api/forecast/route.ts (Next.js API)        │
│  GET /api/forecast → serves JSON with caching   │
└──────────────────┬──────────────────────────────┘
                   │ fetch()
                   ▼
┌─────────────────────────────────────────────────┐
│  components/organisms/ForecastChart.tsx         │
│  • Recharts ComposedChart                       │
│  • 2024 actual vs 2025 forecast bars            │
│  • Confidence band (±8%)                        │
│  • Monthly comparison table                     │
│  • Model metrics (R², MAE)                      │
└─────────────────────────────────────────────────┘
```

### Rationale
Separating the ML pipeline from the web server means:
- Pipeline can be run on any machine or scheduled via cron
- Next.js app has zero Python dependency at runtime
- Forecast data can be updated without redeploying the frontend

---

## ADR-004: Train/Test Split Strategy

### Decision
Use the **last 6 months** of data (Jul–Dec 2024) as the test set, train on the remaining 30 months.

### Rationale
Time-series data must not be split randomly — future data cannot be used to predict the past. A chronological split preserves temporal integrity. 6 months provides a meaningful evaluation window while leaving sufficient training data.

### Lessons Learned
1. **Lag features require careful handling** — the first 3 rows must be dropped after lag creation to avoid NaN values
2. **StandardScaler is essential** — `month_num` (range 0–35) and `sin_month` (range -1 to 1) operate on very different scales; without scaling, the model underweights cyclical features
3. **Sequential forecasting for 2025** — each predicted month feeds back as the next month's lag feature, propagating the model's own predictions

---

## Model Performance

| Metric | Value | Interpretation |
|---|---|---|
| R² Score | ~0.95+ | Model explains >95% of revenue variance |
| MAE | ~$15,000–25,000 | Average prediction error per month |
| Training data | 30 months | 2022 Jan – 2024 Jun |
| Test data | 6 months | 2024 Jul – 2024 Dec |
