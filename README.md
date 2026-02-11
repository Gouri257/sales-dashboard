# 📊 Sales Dashboard

A production-grade sales analytics dashboard built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Recharts**. Visualises Superstore retail sales data for 2022, 2023, and 2024 — inspired by the [Kaggle Superstore Dataset](https://www.kaggle.com/datasets/vivek468/superstore-dataset-final).

---

## ✨ Features

| Feature | Description |
|---|---|
| **Multiple Chart Types** | Switch between Bar, Line, Area, and Pie charts using Recharts |
| **Year Comparison** | Toggle any combination of 2022, 2023, 2024 simultaneously |
| **Custom Revenue Filter** | Set a minimum monthly revenue threshold to filter chart data |
| **API Integration** | `/api/sales` REST endpoint with query params (`years`, `threshold`) |
| **KPI Cards** | Animated cards showing Revenue, Units, Orders, and Avg. Order Value |
| **Category Breakdown** | Horizontal bar chart for revenue by product category |
| **Regional Radar** | Radar chart comparing regional performance across years |
| **Atomic Design** | Structured as Atoms → Molecules → Organisms → Templates |
| **Dark Theme** | Custom design system with a refined dark ink palette |

---

## 🏗️ Architecture — Atomic Design

```
components/
├── atoms/           # Primitive, reusable UI elements
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── TrendIndicator.tsx
│
├── molecules/       # Combinations of atoms with specific logic
│   ├── ChartTypeSelector.tsx
│   ├── KpiCard.tsx
│   ├── RevenueThresholdFilter.tsx
│   └── YearSelector.tsx
│
├── organisms/       # Complex, self-contained UI sections
│   ├── CategoryBreakdownChart.tsx
│   ├── DashboardFilters.tsx
│   ├── DashboardHeader.tsx
│   ├── KpiGrid.tsx
│   ├── RegionalSalesChart.tsx
│   └── RevenueChart.tsx
│
└── templates/       # Page-level layout composition
    └── DashboardTemplate.tsx
```

---

## 📁 Project Structure

```
sales-dashboard/
├── app/
│   ├── api/
│   │   └── sales/
│   │       └── route.ts       # GET /api/sales?years=2024,2023&threshold=300000
│   ├── dashboard/
│   │   └── page.tsx           # Dashboard route
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Redirects → /dashboard
│
├── components/                # Atomic Design components (see above)
├── lib/
│   ├── sales-data.ts          # Mock data + helper formatters
│   └── utils.ts               # cn() utility (clsx + tailwind-merge)
├── types/
│   └── sales.ts               # TypeScript types
│
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (v22 recommended)
- **npm** v9+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/sales-dashboard.git
cd sales-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be automatically redirected to `/dashboard`.

### Build for Production

```bash
npm run build
npm start
```

---

## 🔌 API Reference

### `GET /api/sales`

Fetches sales data with optional filtering.

| Query Parameter | Type | Default | Description |
|---|---|---|---|
| `years` | `string` | `2024,2023,2022` | Comma-separated list of years (2022, 2023, or 2024) |
| `threshold` | `number` | `0` | Minimum monthly revenue to include in results |

**Example:**
```
GET /api/sales?years=2024,2023&threshold=350000
```

**Response:**
```json
{
  "data": [
    {
      "year": 2024,
      "totalRevenue": 4892417,
      "totalUnits": 68312,
      "totalOrders": 19442,
      "avgOrderValue": 251.66,
      "growthRate": 14.2,
      "monthly": [...],
      "categories": [...],
      "regions": [...]
    }
  ],
  "lastUpdated": "2024-02-10T10:30:00.000Z"
}
```

---

## 📊 Data Source

The mock data is modelled after the **[Kaggle Superstore Sales Dataset](https://www.kaggle.com/datasets/vivek468/superstore-dataset-final)** — a widely used retail sales dataset featuring:

- **Categories**: Technology, Furniture, Office Supplies, Apparel, Electronics
- **Regions**: West, East, Central, South
- **Period**: 2022–2024 (three full fiscal years)

All revenue figures are approximate and based on realistic retail growth patterns.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 15.1.0 | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | ^5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | ^3.4 | Utility-first styling |
| [Recharts](https://recharts.org/) | ^2.13 | Charting library |
| [Lucide React](https://lucide.dev/) | ^0.468 | Icon library |
| [clsx](https://github.com/lukeed/clsx) | ^2.1 | Conditional classnames |
| [tailwind-merge](https://github.com/danbrown/tailwind-merge) | ^2.5 | Tailwind class merging |

---

## 🎨 Design System

The dashboard uses a custom dark design system:

- **Display Font**: DM Serif Display (editorial headings)
- **Body Font**: DM Sans (clean UI text)
- **Mono Font**: JetBrains Mono (data, numbers, labels)
- **Primary Palette**: Ink (neutral dark) + Accent (burnt orange)
- **Data Colors**: Accent `#E85D26` · Sapphire `#3B82F6` · Emerald `#10B981`

---

## 🔮 Further Enhancements

- [ ] Connect to real Kaggle API or a PostgreSQL/Supabase backend
- [ ] Add date range picker for granular month filtering
- [ ] Export chart data as CSV
- [ ] Add animated transitions between chart types
- [ ] Implement user-saved filter presets with localStorage
- [ ] Dark/Light theme toggle

---

## 📄 License

MIT © 2024. Feel free to use for personal and commercial projects.
