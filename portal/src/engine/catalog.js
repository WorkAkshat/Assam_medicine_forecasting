// Network + product master. Figures are synthetic defaults; GRD's own master data replaces them.

export const HUB = {
  id: 'RNI',
  name: 'Rani plant & Guwahati mother depot',
  short: 'Rani hub',
  state: 'Assam',
  lat: 26.03,
  lon: 91.6,
};

// leadDays: mean replenishment lead time from the hub; leadSd: day-to-day variability.
// flood: Brahmaputra/Barak flood exposure; malaria: endemicity; urban: dengue-prone urban density.
export const LOCATIONS = [
  { id: 'GHY', name: 'Guwahati C&F', state: 'Assam', lat: 26.14, lon: 91.74, scale: 1.0, leadDays: 1.2, leadSd: 0.4, flood: 0.45, malaria: 0.25, urban: 1.0, route: 'City' },
  { id: 'BNG', name: 'Bongaigaon', state: 'Assam', lat: 26.48, lon: 90.56, scale: 0.45, leadDays: 2.2, leadSd: 0.7, flood: 0.7, malaria: 0.35, urban: 0.3, route: 'NH-27 west' },
  { id: 'NGN', name: 'Nagaon', state: 'Assam', lat: 26.35, lon: 92.68, scale: 0.5, leadDays: 2.0, leadSd: 0.6, flood: 0.8, malaria: 0.3, urban: 0.35, route: 'NH-27 east' },
  { id: 'TZP', name: 'Tezpur', state: 'Assam', lat: 26.63, lon: 92.8, scale: 0.45, leadDays: 2.6, leadSd: 0.8, flood: 0.6, malaria: 0.35, urban: 0.3, route: 'NH-15' },
  { id: 'JRH', name: 'Jorhat', state: 'Assam', lat: 26.75, lon: 94.2, scale: 0.5, leadDays: 3.5, leadSd: 1.1, flood: 0.75, malaria: 0.35, urban: 0.35, route: 'NH-715' },
  { id: 'DIB', name: 'Dibrugarh', state: 'Assam', lat: 27.47, lon: 94.91, scale: 0.6, leadDays: 4.5, leadSd: 1.6, flood: 0.9, malaria: 0.5, urban: 0.45, route: 'NH-15 upper' },
  { id: 'SLC', name: 'Silchar', state: 'Assam', lat: 24.83, lon: 92.78, scale: 0.55, leadDays: 4.2, leadSd: 1.9, flood: 0.75, malaria: 0.6, urban: 0.6, route: 'NH-6 via Meghalaya' },
  { id: 'SHL', name: 'Shillong', state: 'Meghalaya', lat: 25.57, lon: 91.88, scale: 0.4, leadDays: 2.0, leadSd: 0.8, flood: 0.1, malaria: 0.5, urban: 0.5, route: 'NH-6' },
  { id: 'DMP', name: 'Dimapur', state: 'Nagaland', lat: 25.91, lon: 93.73, scale: 0.35, leadDays: 3.4, leadSd: 1.0, flood: 0.25, malaria: 0.5, urban: 0.4, route: 'NH-29' },
  { id: 'IMP', name: 'Imphal', state: 'Manipur', lat: 24.82, lon: 93.94, scale: 0.35, leadDays: 6.0, leadSd: 2.6, flood: 0.2, malaria: 0.45, urban: 0.5, route: 'NH-2' },
  { id: 'AIZ', name: 'Aizawl', state: 'Mizoram', lat: 23.73, lon: 92.72, scale: 0.25, leadDays: 7.0, leadSd: 2.5, flood: 0.1, malaria: 1.0, urban: 0.5, route: 'NH-306' },
  { id: 'AGT', name: 'Agartala', state: 'Tripura', lat: 23.83, lon: 91.28, scale: 0.4, leadDays: 6.0, leadSd: 2.2, flood: 0.25, malaria: 0.8, urban: 0.6, route: 'NH-8' },
  { id: 'ITA', name: 'Itanagar', state: 'Arunachal Pradesh', lat: 27.08, lon: 93.61, scale: 0.2, leadDays: 3.6, leadSd: 1.3, flood: 0.2, malaria: 0.7, urban: 0.3, route: 'NH-415' },
];

// Signal drivers each SKU responds to (log-scale coefficients used by the generator only —
// the forecasting model never sees these; it has to learn them from history).
export const SIGNALS = ['rain', 'flood', 'malaria', 'dengue', 'diarrhoea', 'resp', 'allergy', 'deworm', 'festPre', 'festDuring'];

export const SIGNAL_LABELS = {
  rain: 'Monsoon rainfall',
  flood: 'Flood conditions',
  malaria: 'Malaria season',
  dengue: 'Dengue season',
  diarrhoea: 'Water-borne illness',
  resp: 'Winter respiratory',
  allergy: 'Spring allergy',
  deworm: 'Deworming drive',
  festPre: 'Pre-festival stocking',
  festDuring: 'Festival closures',
  trend: 'Underlying trend',
  season: 'Base seasonality',
  level: 'Recent level shift',
};

export const SKUS = [
  { id: 'PCM650', name: 'Paracetamol 650 mg', form: 'Tablet', unit: 'strip', base: 2400, price: 25, shelf: 104, ved: 'V', trend: 0.04, drivers: { dengue: 0.55, malaria: 0.35, resp: 0.35, festPre: 0.15, festDuring: -0.3 } },
  { id: 'ACT80', name: 'Artemether–Lumefantrine', form: 'Tablet', unit: 'pack', base: 170, price: 95, shelf: 104, ved: 'V', trend: 0.0, drivers: { malaria: 1.5, rain: 0.2 } },
  { id: 'ZNC20', name: 'Zinc 20 mg dispersible', form: 'Tablet', unit: 'strip', base: 300, price: 18, shelf: 104, ved: 'E', trend: 0.03, drivers: { diarrhoea: 0.9, festDuring: -0.25 } },
  { id: 'OND2', name: 'Ondansetron syrup', form: 'Syrup', unit: 'bottle', base: 220, price: 42, shelf: 78, ved: 'E', trend: 0.05, drivers: { diarrhoea: 0.7, dengue: 0.2 } },
  { id: 'MTZ200', name: 'Metronidazole suspension', form: 'Suspension', unit: 'bottle', base: 260, price: 38, shelf: 52, ved: 'E', trend: 0.0, drivers: { diarrhoea: 1.0, flood: 0.3 } },
  { id: 'AMX500', name: 'Amoxicillin 500 mg', form: 'Capsule', unit: 'strip', base: 900, price: 68, shelf: 104, ved: 'V', trend: 0.02, drivers: { resp: 0.45, diarrhoea: 0.15, festDuring: -0.3 } },
  { id: 'AZI500', name: 'Azithromycin 500 mg', form: 'Tablet', unit: 'pack', base: 520, price: 92, shelf: 104, ved: 'E', trend: 0.06, drivers: { resp: 0.6, dengue: 0.15 } },
  { id: 'CTZ5', name: 'Cetirizine syrup', form: 'Syrup', unit: 'bottle', base: 240, price: 35, shelf: 78, ved: 'D', trend: 0.02, drivers: { allergy: 0.9, resp: 0.2 } },
  { id: 'DXM100', name: 'Dextromethorphan cough syrup', form: 'Syrup', unit: 'bottle', base: 450, price: 88, shelf: 78, ved: 'D', trend: 0.01, drivers: { resp: 1.0, festPre: 0.1 } },
  { id: 'SAL2', name: 'Salbutamol syrup', form: 'Syrup', unit: 'bottle', base: 120, price: 32, shelf: 78, ved: 'E', trend: 0.0, drivers: { resp: 0.7, allergy: 0.3 } },
  { id: 'DOX100', name: 'Doxycycline 100 mg', form: 'Capsule', unit: 'strip', base: 160, price: 55, shelf: 104, ved: 'E', trend: 0.02, drivers: { flood: 0.9, rain: 0.3 } },
  { id: 'PAN40', name: 'Pantoprazole 40 mg', form: 'Tablet', unit: 'strip', base: 1100, price: 70, shelf: 104, ved: 'D', trend: 0.07, drivers: { festPre: 0.2, festDuring: -0.35 } },
  { id: 'MET500', name: 'Metformin 500 mg', form: 'Tablet', unit: 'strip', base: 1300, price: 22, shelf: 104, ved: 'V', trend: 0.09, drivers: { festDuring: -0.2 } },
  { id: 'AML5', name: 'Amlodipine 5 mg', form: 'Tablet', unit: 'strip', base: 950, price: 28, shelf: 104, ved: 'V', trend: 0.08, drivers: { festDuring: -0.2 } },
  { id: 'IFA', name: 'Iron + folic acid syrup', form: 'Syrup', unit: 'bottle', base: 280, price: 75, shelf: 78, ved: 'E', trend: 0.03, drivers: {} },
  { id: 'CAD3', name: 'Calcium + D3 suspension', form: 'Suspension', unit: 'bottle', base: 200, price: 120, shelf: 52, ved: 'D', trend: 0.04, drivers: { festPre: 0.15 } },
  { id: 'ALB400', name: 'Albendazole suspension', form: 'Suspension', unit: 'bottle', base: 55, price: 22, shelf: 52, ved: 'E', trend: 0.0, drivers: { deworm: 2.4 } },
  { id: 'PCMS', name: 'Paediatric paracetamol suspension', form: 'Suspension', unit: 'bottle', base: 600, price: 30, shelf: 52, ved: 'V', trend: 0.03, drivers: { dengue: 0.5, resp: 0.45, malaria: 0.25 } },
  { id: 'PRB', name: 'Probiotic suspension (2–8 °C)', form: 'Suspension', unit: 'bottle', base: 22, price: 160, shelf: 26, ved: 'D', trend: 0.05, coldChain: true, drivers: { diarrhoea: 0.6 } },
  { id: 'HSN500', name: 'Hand sanitiser 500 ml', form: 'Hygiene', unit: 'bottle', base: 150, price: 120, shelf: 104, ved: 'D', trend: -0.05, drivers: { flood: 0.3, resp: 0.2 } },
];

// Customer segments named in the brief. Each behaves differently:
// hospitals react harder to outbreaks, institutions buy in lumpy monthly tenders,
// sub-stockists buy a week ahead of retail demand.
export const SEGMENTS = [
  { id: 'retail', name: 'Retail chemists' },
  { id: 'hospital', name: 'Hospitals' },
  { id: 'institution', name: 'Institutions & government' },
  { id: 'stockist', name: 'Sub-stockists' },
];

export const STATES = ['Assam', 'Meghalaya', 'Nagaland', 'Manipur', 'Mizoram', 'Tripura', 'Arunachal Pradesh'];

export const VED_Z = { V: 2.05, E: 1.65, D: 1.28 }; // 98% / 95% / 90% cycle service
export const VED_LABEL = { V: 'Vital', E: 'Essential', D: 'Desirable' };

export const START_DATE = Date.UTC(2023, 10, 27); // Monday 27 Nov 2023
export const HISTORY_WEEKS = 156; // three years of weekly history ending this week
export const HORIZON = 12;

export function weekDate(w) {
  return new Date(START_DATE + w * 7 * 86400000);
}

/** Fraction of the year (0..1) for week index w. */
export function yearPhase(w) {
  const d = weekDate(w);
  const startOfYear = Date.UTC(d.getUTCFullYear(), 0, 1);
  return ((d.getTime() - startOfYear) / 86400000 + 3) / 365.25;
}

export function weekYear(w) {
  return weekDate(w).getUTCFullYear();
}

/** Simple equirectangular projection for the 3D terrain (units ≈ 1 per 55 km). */
export function project(lat, lon) {
  return { x: (lon - 93.0) * 2.0, z: -(lat - 25.6) * 2.2 };
}
