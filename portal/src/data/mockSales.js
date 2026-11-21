// mockSales.js - Historical & Segmented Sales Data
export const MOCK_SALES_SUMMARY = {
  totalRevenueYTD_INR: 184500000, // ₹18.45 Cr
  currentMonthRevenueINR: 34100000, // ₹3.41 Cr
  totalUnitsSoldYTD: 1420000,
  growthVsLastYearPct: 18.4,
  hospitalSharePct: 42,
  retailSharePct: 36,
  defenseRailSharePct: 14,
  stockistTradeSharePct: 8
};

export const MOCK_MONTHLY_SALES_BY_CATEGORY = [
  { month: 'Jun 2026', tablets: 10400000, capsules: 5200000, syrups: 4800000, hygiene: 4400000, total: 24800000 },
  { month: 'Jul 2026', tablets: 11100000, capsules: 5400000, syrups: 4900000, hygiene: 4700000, total: 26100000 },
  { month: 'Aug 2026', tablets: 12200000, capsules: 5800000, syrups: 5600000, hygiene: 5300000, total: 28900000 },
  { month: 'Sep 2026', tablets: 13100000, capsules: 6100000, syrups: 6200000, hygiene: 5800000, total: 31200000 },
  { month: 'Oct 2026', tablets: 14200000, capsules: 6500000, syrups: 6800000, hygiene: 6000000, total: 33500000 },
  { month: 'Nov 2026', tablets: 14600000, capsules: 6600000, syrups: 6700000, hygiene: 6200000, total: 34100000 },
];

export const MOCK_TOP_PERFORMING_SKUS = [
  { skuCode: 'GRD-HYG-001', name: 'Handuser-C® 500ml', unitsSold: 42500, revenueINR: 7437500, marginPct: 37.1, demandTrend: 'Rapid Growth (+28%)' },
  { skuCode: 'GRD-TAB-001', name: 'Paracetamol 650mg Tablets', unitsSold: 88200, revenueINR: 2187360, marginPct: 34.6, demandTrend: 'Surging (+24%)' },
  { skuCode: 'GRD-TAB-003', name: 'ClavoGRD-625 Tablets', unitsSold: 21400, revenueINR: 2824800, marginPct: 32.9, demandTrend: 'Steady Growth (+18%)' },
  { skuCode: 'GRD-SYR-002', name: 'CofGRD Expectorant 100ml', unitsSold: 36800, revenueINR: 2502400, marginPct: 38.2, demandTrend: 'Seasonal Surge (+35%)' },
  { skuCode: 'GRD-HYG-002', name: 'Handuser-C® 5L Can', unitsSold: 2850, revenueINR: 3847500, marginPct: 34.0, demandTrend: 'Institutional Steady (+12%)' },
  { skuCode: 'GRD-TAB-002', name: 'AzithroGRD-500 Tablets', unitsSold: 18900, revenueINR: 1691550, marginPct: 35.1, demandTrend: 'High Demand (+29%)' }
];

export const MOCK_REGION_SALES_BREAKDOWN = [
  { region: 'Kamrup Metro & Central Assam', sharePct: 38, revenueINR: 12958000, growthPct: 15.2 },
  { region: 'Upper Assam (Dibrugarh, Tinsukia)', sharePct: 22, revenueINR: 7502000, growthPct: 14.8 },
  { region: 'Barak Valley (Silchar, Karimganj)', sharePct: 11, revenueINR: 3751000, growthPct: 8.4 },
  { region: 'Meghalaya (Khasi & Garo Hills)', sharePct: 10, revenueINR: 3410000, growthPct: 12.1 },
  { region: 'Tripura (Agartala)', sharePct: 8, revenueINR: 2728000, growthPct: 9.3 },
  { region: 'Nagaland & Manipur', sharePct: 8, revenueINR: 2728000, growthPct: 16.4 },
  { region: 'Arunachal Pradesh, Mizoram & Sikkim', sharePct: 3, revenueINR: 1023000, growthPct: 6.8 }
];
