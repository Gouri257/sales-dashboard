# 📊 Sales Analytics Dashboard — ML Edition

A production-grade sales analytics dashboard built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Recharts** — now upgraded with a **Python ML forecasting pipeline** using **scikit-learn**, **pandas**, and **Matplotlib** to predict 2025 revenue.

🔗 **Live Demo:** [sales-dashboard-kappa-one.vercel.app/dashboard](https://sales-dashboard-kappa-one.vercel.app/dashboard)

---

## ✨ What's New — ML Pipeline Upgrade

| Feature | Description |
|---|---|
| **2025 Revenue Forecast** | Linear Regression model trained on 2022–2024 data predicts monthly revenue for all 12 months of 2025 |
| **Feature Engineering** | Cyclical month encoding (sin/cos), lag features, rolling averages — 7 engineered features total |
| **Model Metrics** | R² Score and MAE displayed live on the dashboard |
| **Forecast Chart** | Interactive chart comparing 2024 actual vs 2025 forecast with confidence band |
| **Monthly Growth Table** | Month-by-month breakdown showing predicted growth % |
| **Matplotlib Chart** | Static forecast chart saved as PNG for reports and documentation |
| **REST API** | `/api/forecast` endpoint serving ML output to the frontend |
| **Architecture Docs** | IBM-style Architecture Decision Records (ADRs) documenting every design decision |

---

## 🤖 ML Pipeline — How It Works

```
lib/sales-data.ts (2022–2024 data)
           │
           ▼
    ml/pipeline.py
    ┌─────────────────────────────────────┐
    │ 1. Build DataFrame (36 months)      │
    │ 2. Engineer 7 Features              │
    │    • month_num (trend)              │
    │    • sin_month / cos_month          │
    │      (cyclical seasonality)         │
    │    • quarter                        │
    │    • lag_1, lag_3 (autoregressive)  │
    │    • rolling_3 (smoothed baseline)  │
    │ 3. Train LinearRegression (80/20)   │
    │ 4. Evaluate: MAE + R²               │
    │ 5. Forecast Jan–Dec 2025            │
    │ 6. Save forecast_2025.json          │
    │ 7. Save forecast_chart.png          │
    └─────────────────────────────────────┘
           │
           ▼
    ml/output/forecast_2025.json
           │
           ▼
    app/api/forecast/route.ts
           │
           ▼
    components/organisms/ForecastChart.tsx
```

### Model Results
| Metric | Value |
|---|---|
| Algorithm | Linear Regression (scikit-learn) |
| Training Data | 30 months (Jan 2022 – Jun 2024) |
| Test Data | 6 months (Jul – Dec 2024) |
| R² Score | 0.736 |
| MAE | $27,670 / month |
| Predicted 2025 Total | $5,401,029 |
| Predicted Growth | +10.4% vs 2024 |

---

## ✨ Dashboard Features

| Feature | Description |
|---|---|
| **2025 ML Forecast** | Python-powered revenue predictions with confidence band |
| **Multiple Chart Types** | Switch between Bar, Line, Area, and Pie charts |
| **Year Comparison** | Toggle any combination of 2022, 2023, 2024 simultaneously |
| **Custom Revenue Filter** | Set a minimum monthly revenue threshold |
| **KPI Cards** | Animated cards showing Revenue, Units, Orders, Avg. Order Value |
| **Category Breakdown** | Horizontal bar chart for revenue by product category |
| **Regional Radar** | Radar chart comparing regional performance across years |
| **Atomic Design** | Structured as Atoms → Molecules → Organisms → Templates |
| **Dark Theme** | Custom design system with a refined dark ink palette |

---

## 🏗️ Architecture — Atomic Design + ML Layer

```
sales-dashboard/
├── ml/                          # 🆕 Python ML Pipeline
│   ├── pipeline.py              # Main ML script (pandas + scikit-learn + matplotlib)
│   ├── requirements.txt         # Python dependencies
│   └── output/
│       ├── forecast_2025.json   # ML output → consumed by Next.js API
│       └── forecast_chart.png   # Matplotlib visualization
│
├── app/
│   ├── api/
│   │   ├── sales/
│   │   │   └── route.ts         # GET /api/sales (existing)
│   │   └── forecast/
│   │       └── route.ts         # 🆕 GET /api/forecast (ML output)
│   ├── dashboard/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   │   ├── ForecastChart.tsx    # 🆕 2025 forecast chart component
│   │   └── ... (existing)
│   └── templates/
│
├── docs/
│   └── architecture-decision-record.md  # 🆕 IBM-style ADR documentation
│
├── lib/
│   ├── sales-data.ts
│   └── utils.ts
└── types/
    └── sales.ts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **Python** 3.10+ (for ML pipeline)
- **pip** (Python package manager)

### 1. Clone and install
```bash
git clone https://github.com/Gouri257/sales-dashboard.git
cd sales-dashboard
npm install
```

### 2. Run the ML pipeline (generates 2025 forecast)
```bash
cd ml
pip install -r requirements.txt
python pipeline.py
cd ..
```

You should see:
```
✅ Model trained — MAE: $27,670 | R²: 0.7357
✅ 2025 forecast complete: $5,401,029 total predicted revenue
✅ Chart saved → ml/output/forecast_chart.png
✅ JSON saved → ml/output/forecast_2025.json
```

### 3. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

## 🔌 API Reference

### `GET /api/sales`
Fetches historical sales data with optional filtering.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `years` | string | `2024,2023,2022` | Comma-separated years |
| `threshold` | number | `0` | Minimum monthly revenue |

### `GET /api/forecast` 🆕
Returns the ML-generated 2025 forecast.

**Response:**
```json
{
  "year": 2025,
  "isForecast": true,
  "generatedAt": "2026-04-08T...",
  "modelMetrics": { "mae": 27670, "r2": 0.7357 },
  "totalRevenue": 5401029,
  "growthRate": 10.4,
  "monthly": [
    {
      "month": "January",
      "monthShort": "Jan",
      "revenue": 343312,
      "units": 4891,
      "orders": 1394,
      "isForecast": true
    }
  ]
}
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15.1.0 | React framework with App Router |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^3.4 | Utility-first styling |
| Recharts | ^2.13 | Interactive charts |
| Lucide React | ^0.468 | Icons |

### ML Pipeline 🆕
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.10+ | Pipeline runtime |
| pandas | 2.2.2 | Data manipulation |
| scikit-learn | 1.5.0 | Linear Regression model |
| NumPy | 1.26.4 | Numerical computations |
| Matplotlib | 3.9.0 | Static forecast chart |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| GitHub Actions (optional) | Scheduled pipeline reruns |

---

## 📐 Architecture Decisions

See [`docs/architecture-decision-record.md`](docs/architecture-decision-record.md) for full documentation covering:

- **ADR-001:** Why Linear Regression over ARIMA / Prophet / LSTM
- **ADR-002:** Feature engineering strategy (cyclical encoding explained)
- **ADR-003:** Pipeline output architecture (JSON file vs direct API)
- **ADR-004:** Train/test split strategy for time-series data

---

## 🎨 Design System

- **Display Font**: DM Serif Display
- **Body Font**: DM Sans
- **Mono Font**: JetBrains Mono
- **Accent**: `#E85D26` (burnt orange)
- **Forecast**: `#8B5CF6` (purple — distinguishes ML predictions from actuals)
- **Data Colors**: Sapphire `#3B82F6` · Emerald `#10B981`

---

## 📄 License

MIT © 2026 Sirimalla Gouri
