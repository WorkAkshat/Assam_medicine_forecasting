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
├── portal/                          # PharmaPredict AI Enterprise Portal
│   ├── public/                      # Portal icons and brand assets
│   ├── src/
│   │   ├── assets/                  # High-res logos and vectors
│   │   ├── components/              # Common UI, charts, and layout components
│   │   │   ├── common/              # StatCard, Table, Modal, Drawer, Badge, Button
│   │   │   ├── layout/              # Sidebar, Topbar, RoleSwitcher, Notifications
│   │   │   └── charts/              # Recharts implementations for demand & MAPE
│   │   ├── data/                    # High-fidelity Northeast pharma operational mock data
│   │   ├── hooks/                   # useAuth (Multi-role RBAC), useSyncStatus (Offline mode)
│   │   ├── pages/                   # All 20 functional challenge modules
│   │   ├── routes/                  # React Router DOM v6 mapping all 20 modules
│   │   ├── styles/                  # Tailwind CSS + custom enterprise tokens
│   │   ├── utils/                   # Currency (Lakhs/Cr), number, and date formatters
│   │   ├── App.jsx                  # Root App with Auth & Sync providers
│   │   └── main.jsx                 # Vite React DOM entry point
│   ├── package.json                 # React 18, Vite, Recharts, Lucide, Framer Motion
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

### 2. Run the PharmaPredict AI Portal
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

## 🧠 Forecasting & replenishment engine (`portal/src/engine`)

The portal now runs a real engine in a **Web Worker** (no UI blocking; a full run takes ~0.25 s):

| Step | File | What it does |
|---|---|---|
| Synthetic Northeast data | `generate.js`, `catalog.js` | 3 years of weekly demand for 20 medicines × 13 depots, driven by monsoon rainfall, Brahmaputra/Barak floods, malaria & dengue seasons, winter respiratory illness, national deworming days, Bihu & Durga Puja, level shifts and intermittent demand. Lead times vary by route, with floods, landslides and blockades. **Clearly labelled synthetic** for the application stage. |
| Forecast models | `models.js` | Manual rule (4-week average, the baseline), same-week-last-year, exponential smoothing, Croston–SBA for intermittent demand, and a signal-aware ridge regression. They are blended by a per-series weighted ensemble and include 80% prediction ranges plus driver explanations. |
| Back-test | `engine.js` | Rolling-origin back-test (7 origins × 4-week horizon) with **no look-ahead**. |
| Inventory policy | `policy.js` | Safety stock from forecast error **and lead-time variability**, VED-based service levels (Vital 98%, Essential 95%, Desirable 90%), order-up-to levels, a shelf-life cap, FEFO expiry risk, and greedy depot-to-depot redistribution. |
| Pilot simulation | `simulate.js` | Replays the last 26 weeks twice from identical stock, demand and transport shocks: once with today's manual habits, once with the AI plan. This produces the five NESFIC KPIs. |

Default scenario results (they change with the **Pilot impact** controls):

| KPI | Manual | AI plan | Target |
|---|---|---|---|
| Forecast accuracy (4-week planning bucket) | ~85% | ~88% (≈20% less error) | +20% |
| Stock-out incidence | ~7% of weeks | <1% | −20% |
| Excess / slow-moving share | ~17% | ~13% | −15% |
| Expiry loss | ~1.1% | ~0% | −15% |
| Fill rate | ~95% | ~99.9% | +10 pts (capped by the high synthetic baseline) |

## 🗺️ New screens

- **Control tower (`/control-tower`)**: a 3D relief of the Northeast (Brahmaputra and Barak rivers). Depot pillars show stock value, colour shows service risk, and animated shipments flow from the Rani hub. Click any depot to drill down.
- **Forecast studio (`/demand-forecasting`)**: history, the AI forecast with its likely range, back-tested points, the model scoreboard, demand drivers and the replenishment maths for any medicine × depot.
- **Replenishment plan (`/smart-replenishment`)**: prioritised suggested orders with editable quantities, approval and CSV export.
- **Expiry and surplus (`/expiry-management`)**: FEFO expiry risk, surplus stock, and transfer suggestions you can book.
- **Pilot impact (`/pilot-kpis`)**: the five KPIs measured against their targets. Stress-test them with monsoon severity, transport disruption, safety margin and transfer controls.

## 🎨 Design system: “Brahmaputra”

- **River ink** `#0E2530`: structure, the sidebar and the 3D night map
- **Monsoon teal** `#0E7570`: actions and healthy states
- **Muga-silk gold** `#C08427`: AI forecasts and insights (after Assam's golden silk)
- **Mist** `#EEF3F2`: page background
- Type: **Familjen Grotesk** (display) and **IBM Plex Sans** (body, with tabular figures)

## ⚡ Performance

- Every route is lazy-loaded. The portal's first-load JS dropped from one 1.5 MB bundle to about 195 KB of app code plus a shared React chunk.
- three.js and the charts load only on pages that use them.
- The engine runs in a Web Worker, and results are cached per session, so reloads paint instantly.
- Animations respect `prefers-reduced-motion`.

## 📦 Complete 20-Module Implementation

1. **Executive Dashboard (`/dashboard`)**: High-level KPI cockpit, operational alerts, demand trends, state-wise stock valuation, and quick actions.
2. **Assam Pilot Monitoring (`/pilot-kpis`)**: Dedicated NESFIC-I-09 audit tracking with baseline vs target comparisons and milestone progress.
3. **Demand Forecasting (`/demand-forecasting`)**: AI baseline vs predicted horizon with explainable drivers (Winter cough surge, Brahmaputra flood transit risk, hospital rate contracts).
4. **Central Multi-State Inventory (`/inventory`)**: Stock visibility across 12 facilities in all 8 Northeast states, batch details, on-hand/in-transit/reserved counts, and reconciliation drawer.
5. **Smart Replenishment (`/smart-replenishment`)**: Decision-support replenishment engine with human-in-the-loop approval workflow and corridor routing.
6. **Stock-out Risk AI (`/stockout-risk`)**: Proactive risk intelligence ranking SKUs by days of cover and auto-recommending emergency transfers.
7. **Excess & Slow-Moving Inventory (`/excess-inventory`)**: Dead-stock mitigation, holding cost analysis, and cross-depot transfer suggestions.
8. **Expiry Management & FEFO Queue (`/expiry-management`)**: Batch expiry countdown (30/60/90/180 days), FEFO priority allocation, and quarantine logs.
9. **Logistics & Lead-Time Monitoring (`/logistics-monitoring`)**: Live monitoring across NH-27, NH-6, NH-8 corridors, GPS transit check-ins, and monsoon landslide delays.
10. **Medicine / SKU Master (`/skus`)**: Complete formulary catalog covering Tablets, Capsules, Syrups, Suspensions, and Sanitizers (Handuser-C® & EnvoUser-5™) with VED classification.
11. **Order Management & Fulfilment (`/orders`)**: Purchase indent creation, status progression (`Pending` ➔ `Approved` ➔ `Dispatched` ➔ `Delivered`), and hospital SLA metrics.
12. **Sales Management & Analytics (`/sales`)**: Revenue breakdown by customer segment (Govt Hospitals 42%, Retail 36%, Defense 14%, Stockists 8%) and category trends.
13. **Distributor Network (`/distributors`)**: Certified C&F partners, territory coverage, credit utilization bars, and stockist linkage counts.
14. **Regional Stockist Network (`/stockists`)**: Secondary distribution nodes, retail chemist linkages, and inventory synchronization health.
15. **Institutional Customers (`/customers`)**: Government medical colleges (GMCH, AMCH, SMCH), Defense (151 Army Base Hospital), Railways (NFR), and retail chains.
16. **Reports & Analytics Hub (`/reports`)**: Standard regulatory templates, CSV/Excel exports, and audit-ready data tables.
17. **Alerts & Risk Control (`/alerts`)**: Multi-severity stream (Critical, Warning, Info) and configurable trigger thresholds.
18. **Data Import & ERP Integration (`/data-import`)**: Drag-and-drop CSV/Excel ingestion for Tally Prime, Marg ERP, and SAP Business One with column validation.
19. **User & Access Governance (`/users`)**: Role-Based Access Control (RBAC) across 8 user personas with a complete permissions matrix.
20. **System Settings & Audit Trail (`/settings`)**: Monsoon safety stock multipliers, low-bandwidth offline caching, and immutable activity ledger.

---

## 📄 Compliance & Confidentiality
All data and architecture align with cGMP and Schedule M pharmaceutical distribution standards, preserving institutional confidentiality and data privacy across the Northeast supply chain network.
