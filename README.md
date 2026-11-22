# GRD Pharmaceuticals · Enterprise Suite & PharmaPredict AI

An enterprise-grade, data-driven pharmaceutical distribution, demand forecasting, and inventory optimization platform built for **GRD Pharmaceuticals (A Unit of Dhanuka Group)** in response to the **NESFIC-I-09 Challenge**:

> **"Improving Medicine Demand Forecasting and Inventory Availability Across Northeast India"**  
> *Assam Startup Initiative · Industry / MSME Stream 1 · NESFIC-I-09*

---

## 🏗️ Repository Architecture

The project is structured into two completely independent, production-ready frontend applications within a unified workspace:

```text
GRD-Pharmaceuticals/
├── website/                         # Public Corporate Website
│   ├── public/                      # Static assets, logos, and product imagery
│   ├── src/                         # React components, pages, navigation & styles
│   ├── package.json                 # Independent dependencies (Tailwind, Lucide, Framer)
│   └── vite.config.js               # Dev server on port 5173
│
├── portal/                          # GRD Supply Planner (demand & inventory planning)
│   ├── public/                      # Logo, service worker (offline), web manifest
│   ├── src/
│   │   ├── engine/                  # Forecasting, inventory policy, back-test (Web Worker)
│   │   ├── components/              # App shell, 3D network scene, shared UI
│   │   ├── hooks/                   # useEngine, useRole, useToast, usePersistentState
│   │   ├── pages/                   # Overview, Alerts, Replenishment, Inventory, Expiry,
│   │   │                            # Demand, Medicine forecast, Depots, Medicines,
│   │   │                            # Outcome KPIs, Data sources, Planning settings
│   │   ├── App.jsx                  # Routes
│   │   └── main.jsx                 # Entry + service worker registration
│   └── vite.config.js               # Dev server on port 5175, vendor chunking
│
├── package.json                 # React 18, Vite, Recharts, Lucide, Framer Motion
│   └── vite.config.js               # Dev server on port 5175
│
├── package.json                     # Root orchestrator scripts
└── README.md                        # Documentation & setup guide
```

---

## 🚀 Quick Start Guide

### 1. Run the Public Website
```bash
# Start development server on http://localhost:5173
npm run dev:website

# Build production bundle
npm run build:website
```

### 2. Run the GRD Supply Planner portal
```bash
# Start development server on http://localhost:5175
npm run dev:portal

# Build production bundle
npm run build:portal
```

### 3. Build Both Applications
```bash
npm run build
```

---

## 🧭 Portal: GRD Supply Planner (`portal/`)

Demand forecasting and inventory planning for GRD's Northeast distribution network, built around the problem statement:

| Problem statement need | Where it is handled |
|---|---|
| End-to-end demand and inventory visibility across the NE network | **Network overview** (3D map of depots, routes and risk) and **Inventory** (medicine × depot cover grid) |
| Spot demand shifts early, by product, geography, season and customer segment | **Demand forecast** (12-week forecast, drivers, segments: retail, hospitals, institutions, sub-stockists) and **Medicine forecast** detail |
| Earlier, more reliable replenishment where lead times vary | **Replenishment** (orders sized from forecast + lead-time variability, approve and export) |
| Reduce stock-outs, excess stock, expiry and working capital | **Alerts**, **Expiry & surplus** (FEFO risk + depot-to-depot transfers) |
| Measurable outcomes (+20% accuracy, −20% stock-outs, −15% excess, −15% expiry, +10 pts fulfilment) | **Outcome KPIs**: current ordering vs recommendations on the same demand |
| Work with existing processes and data | **Data sources**: CSV import of Tally/Marg/SAP/Excel sales and batch stock exports, with a data-quality report |
| Outputs for supply chain, sales and management teams | Role views: Supply chain planner, Management, Sales, Depot / distributor (scoped to one depot) |
| Variable connectivity | Offline app shell (service worker); forecasting runs on the device |
| Data privacy | Uploaded files are processed in the browser and stored only on the device |

### Engine (`portal/src/engine`, runs in a Web Worker in ~0.3 s)

- `generate.js`: built-in sample data (3 years, 20 medicines × 13 depots, four customer segments). It reflects monsoon, floods, malaria and dengue, winter respiratory illness, deworming days and festivals. Uploaded CSVs replace it line by line.
- `models.js`: a 4-week-average rule (today's baseline), same week last year, exponential smoothing, Croston–SBA, and a signal-aware regression. These are blended into a weighted ensemble with 80% ranges and driver explanations.
- `policy.js`: safety stock from forecast error and lead-time variability, VED service levels, order-up-to levels, a shelf-life cap, FEFO expiry risk, and transfers.
- `simulate.js`: outcome back-test of current ordering vs recommendations over the last 26 weeks.

### CSV formats

- Sales: `week_start, sku_code, depot_code, units[, segment]`. Common header variants such as `Qty`, `Item Code` and `Branch` are recognised.
- Stock: `sku_code, depot_code, batch_no, expiry_date, qty`

### Design and performance

- "Brahmaputra" palette (river ink, monsoon teal, muga gold), Familjen Grotesk and IBM Plex Sans.
- Responsive from phone to wide desktop: drawer and bottom tabs on phones, card lists instead of tables on small screens.
- Lazy-loaded routes, with three.js and the charts in separate chunks.
- Animations respect reduced motion.

## 📄 Compliance & Confidentiality
All data and architecture align with cGMP and Schedule M pharmaceutical distribution standards, preserving institutional confidentiality and data privacy across the Northeast supply chain network.
