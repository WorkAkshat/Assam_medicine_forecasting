// mockPilotData.js - NESFIC-I-09 Assam Pilot KPI Monitoring Data
export const PILOT_METADATA = {
  challengeId: 'NESFIC-I-09',
  challengeTitle: 'Improving Medicine Demand Forecasting and Inventory Availability Across Northeast India',
  challengeOwner: 'GR Dhanuka Group / GRD Pharmaceuticals',
  pilotState: 'Assam (Primary Pilot Phase)',
  pilotGeography: 'Guwahati Mother Warehouse, Rani cGMP Plant, Dibrugarh Hub & Silchar C&F Depot',
  pilotDurationWeeks: 16,
  currentWeek: 11,
  progressPercentage: 68.75, // Week 11 of 16
  pilotStartDate: '2026-09-01',
  targetCompletionDate: '2026-12-22',
  involvedFacilities: [
    'Rani cGMP Formulation Plant (Manufacturing Base)',
    'Guwahati Central Depot (Mother Warehouse)',
    'Dibrugarh Regional Depot (Upper Assam Pilot)',
    'Silchar C&F Depot (Barak Valley Pilot)',
    '6 Selected Certified Stockists in Kamrup, Dibrugarh & Cachar',
    'GMCH, AMCH & SMCH State Medical Colleges'
  ],
  pilotSkusCount: 12,
  activeFieldTestingStaffCount: 18
};

// 5 Mandated NESFIC-I-09 Targets vs Actual Progress (Fair, rigorous, and transparent)
export const PILOT_KPIS = [
  {
    id: 'KPI-01',
    metric: 'Demand Forecast Accuracy Improvement',
    challengeTarget: 'At least +20% over agreed baseline',
    unit: '% Accuracy',
    baselineValue: 64.2, // Historical manual spreadsheet baseline
    targetGoalValue: 77.0, // 64.2 * 1.20 = 77.04%
    currentActualValue: 79.4, // Pilot Week 11 measurement
    variancePctPoints: +15.2,
    relativeImprovementPct: +23.7, // (79.4 - 64.2) / 64.2 = +23.7%
    targetStatus: 'Target Exceeded (Pilot Stage)',
    notes: 'Calculated via weighted Mean Absolute Percentage Error (wMAPE) across 12 pilot SKUs in Assam network.'
  },
  {
    id: 'KPI-02',
    metric: 'Stock-Out Incidence Reduction',
    challengeTarget: 'At least 20% reduction from baseline',
    unit: '% Stockout Rate',
    baselineValue: 18.5, // Stockout incidence baseline
    targetGoalValue: 14.8, // 18.5 * 0.80 = 14.8%
    currentActualValue: 12.1, // Pilot Week 11 measurement
    variancePctPoints: -6.4,
    relativeImprovementPct: -34.6, // Relative drop in stockouts
    targetStatus: 'Target Achieved (On Track)',
    notes: 'Measured weekly across 24 monitored stockist and depot stockpoints. Silchar transit buffering significantly reduced stockout days.'
  },
  {
    id: 'KPI-03',
    metric: 'Excess / Slow-Moving Inventory Reduction',
    challengeTarget: 'At least 15% reduction in working capital lock-up',
    unit: '₹ Lakhs',
    baselineValue: 42.8, // ₹42.8 Lakhs tied up in slow-moving stock
    targetGoalValue: 36.4, // ₹36.38 Lakhs (15% reduction)
    currentActualValue: 34.2, // Current value: ₹34.2 Lakhs
    variancePctPoints: -8.6,
    relativeImprovementPct: -20.1, // 20.1% reduction in excess stock
    targetStatus: 'Target Achieved (On Track)',
    notes: 'Achieved by active redistribution of slow-moving batches between Guwahati, Tezpur, and Agartala.'
  },
  {
    id: 'KPI-04',
    metric: 'Expiry-Related Losses Reduction',
    challengeTarget: 'At least 15% reduction from baseline losses',
    unit: '₹ Lakhs / Quarter',
    baselineValue: 8.6, // ₹8.6 Lakhs loss per quarter historically
    targetGoalValue: 7.3, // ₹7.31 Lakhs (15% reduction)
    currentActualValue: 6.1, // Current quarterly projection: ₹6.1 Lakhs
    variancePctPoints: -2.5,
    relativeImprovementPct: -29.1, // 29.1% cut in expiry write-offs
    targetStatus: 'Target Achieved (On Track)',
    notes: 'FEFO-based automated dispatch queues and near-expiry hospital redistribution alerts reduced near-expiry write-offs.'
  },
  {
    id: 'KPI-05',
    metric: 'Order Fulfilment / Service Level Improvement',
    challengeTarget: 'At least +10 percentage points improvement',
    unit: '% On-Time In-Full (OTIF)',
    baselineValue: 81.3, // Baseline service level
    targetGoalValue: 91.3, // +10 percentage points = 91.3%
    currentActualValue: 92.8, // Current OTIF measurement
    variancePctPoints: +11.5,
    relativeImprovementPct: +14.1,
    targetStatus: 'Target Achieved (On Track)',
    notes: 'On-Time-In-Full (OTIF) fulfillment rate measured across hospital medical colleges and certified distributor orders.'
  }
];

// Week-by-Week Pilot Timeline Progress
export const PILOT_TIMELINE_WEEKS = [
  { week: 'W1', label: 'Week 1', forecastAccuracy: 64.2, stockoutRate: 18.5, serviceLevel: 81.3, phase: 'Baseline Audit' },
  { week: 'W3', label: 'Week 3', forecastAccuracy: 66.0, stockoutRate: 17.8, serviceLevel: 82.5, phase: 'Data Ingestion' },
  { week: 'W5', label: 'Week 5', forecastAccuracy: 69.5, stockoutRate: 16.2, serviceLevel: 84.8, phase: 'Initial Models' },
  { week: 'W7', label: 'Week 7', forecastAccuracy: 73.1, stockoutRate: 15.0, serviceLevel: 87.2, phase: 'Field Integration' },
  { week: 'W9', label: 'Week 9', forecastAccuracy: 76.8, stockoutRate: 13.5, serviceLevel: 90.1, phase: 'Stockist Pilot' },
  { week: 'W11 (Current)', label: 'Week 11', forecastAccuracy: 79.4, stockoutRate: 12.1, serviceLevel: 92.8, phase: 'Live Testing' },
  { week: 'W13 (Target)', label: 'Week 13', forecastAccuracy: 81.0, stockoutRate: 11.5, serviceLevel: 93.5, phase: 'Scale Prep' },
  { week: 'W16 (Target)', label: 'Week 16', forecastAccuracy: 83.5, stockoutRate: 10.0, serviceLevel: 95.0, phase: 'Final Review' }
];

// Pilot Milestones Checklist
export const PILOT_MILESTONES = [
  { id: 'M1', name: 'Phase 1: Baseline Assessment & Operational Data Extraction', duration: 'Weeks 1–4', status: 'Completed', completionDate: '2026-09-28', deliverables: 'Historical sales, SKU master, stockist order registers extracted and standardized.' },
  { id: 'M2', name: 'Phase 2: Solution Architecture & Deployment in Rani/Guwahati', duration: 'Weeks 5–8', status: 'Completed', completionDate: '2026-10-26', deliverables: 'PharmaPredict forecasting engine deployed with centralized stock visibility.' },
  { id: 'M3', name: 'Phase 3: Field Validation with Selected Stockists & Hospitals', duration: 'Weeks 9–12', status: 'In Progress (Active)', completionDate: 'Target: 2026-11-25', deliverables: 'Weekly replenishment recommendations testing with GMCH, AMCH and 6 key stockists.' },
  { id: 'M4', name: 'Phase 4: Impact Measurement, Security Audit & Scaling Roadmap', duration: 'Weeks 13–16', status: 'Scheduled', completionDate: 'Target: 2026-12-22', deliverables: 'Final KPI audit against NESFIC-I-09 baseline; commercial multi-state scale-up proposal.' }
];

export const mockPilotTargets = PILOT_KPIS;

