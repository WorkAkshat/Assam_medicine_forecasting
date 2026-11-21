// mockManagementData.js - Executive Corporate Leadership Data for Gautam R. Dhanuka (Management / Executive)

export const MANAGEMENT_PROFILE = {
  name: 'Gautam R. Dhanuka',
  role: 'Management / Executive',
  roleId: 'management',
  facility: 'Guwahati Corporate HQ (Dhanuka Complex)',
  location: 'Guwahati, Assam',
  email: 'gautam.dhanuka@grdpharma.in',
  phone: '+91 98640 01000',
  executiveKpis: {
    overallAvailabilityIndex: '98.2%',
    availabilityGain: '+26.8% vs Baseline',
    workingCapitalLocked: '₹1.42 Cr',
    workingCapitalOptimized: '₹48.5 Lakhs saved',
    revenueFulfillmentRate: '96.8%',
    activeHospitalsServed: 148,
    essentialMedicinesCompliance: '100% NLEM'
  }
};

export const NORTHEAST_STATE_AVAILABILITY = [
  {
    state: 'Assam',
    regionalHub: 'Guwahati Mother Hub & Dibrugarh Depot',
    hospitalsCovered: 64,
    availabilityScore: 98.8,
    stockDaysCover: 18.5,
    criticalStockouts: 0,
    status: 'Optimal Supply',
    monthlyDemandUnits: 84000,
    capitalInvested: '₹68.4 Lakhs'
  },
  {
    state: 'Meghalaya',
    regionalHub: 'Shillong Civil Medical Depot',
    hospitalsCovered: 18,
    availabilityScore: 97.4,
    stockDaysCover: 16.2,
    criticalStockouts: 0,
    status: 'Optimal Supply',
    monthlyDemandUnits: 22000,
    capitalInvested: '₹18.2 Lakhs'
  },
  {
    state: 'Tripura',
    regionalHub: 'Agartala Central Medical Store',
    hospitalsCovered: 22,
    availabilityScore: 96.9,
    stockDaysCover: 15.8,
    criticalStockouts: 0,
    status: 'Buffer Maintained',
    monthlyDemandUnits: 28000,
    capitalInvested: '₹22.5 Lakhs'
  },
  {
    state: 'Nagaland',
    regionalHub: 'Dimapur Transshipment Depot',
    hospitalsCovered: 14,
    availabilityScore: 95.8,
    stockDaysCover: 14.5,
    criticalStockouts: 0,
    status: 'Buffer Maintained',
    monthlyDemandUnits: 16000,
    capitalInvested: '₹12.8 Lakhs'
  },
  {
    state: 'Manipur',
    regionalHub: 'Imphal Regional Medical Hub',
    hospitalsCovered: 12,
    availabilityScore: 95.2,
    stockDaysCover: 14.0,
    criticalStockouts: 0,
    status: 'Stable Corridor',
    monthlyDemandUnits: 14000,
    capitalInvested: '₹11.2 Lakhs'
  },
  {
    state: 'Mizoram',
    regionalHub: 'Aizawl District Medical Warehouse',
    hospitalsCovered: 10,
    availabilityScore: 94.8,
    stockDaysCover: 13.5,
    criticalStockouts: 0,
    status: 'Stable Corridor',
    monthlyDemandUnits: 12000,
    capitalInvested: '₹9.6 Lakhs'
  },
  {
    state: 'Arunachal Pradesh',
    regionalHub: 'Naharlagun Transshipment Point',
    hospitalsCovered: 6,
    availabilityScore: 94.1,
    stockDaysCover: 12.8,
    criticalStockouts: 0,
    status: 'High Transit Buffer',
    monthlyDemandUnits: 8500,
    capitalInvested: '₹6.8 Lakhs'
  },
  {
    state: 'Sikkim',
    regionalHub: 'Gangtok Regional Medical Depot',
    hospitalsCovered: 8,
    availabilityScore: 96.5,
    stockDaysCover: 15.2,
    criticalStockouts: 0,
    status: 'Optimal Supply',
    monthlyDemandUnits: 9800,
    capitalInvested: '₹7.9 Lakhs'
  }
];

export const WORKING_CAPITAL_OPTIMIZATION = [
  {
    category: 'Excess Stock Reduction',
    prePilotAmount: '₹84.0 Lakhs',
    currentAmount: '₹35.5 Lakhs',
    savingsAchieved: '₹48.5 Lakhs',
    improvementPct: '-57.7%',
    impact: 'Capital liberated from slow-moving formulations into active production'
  },
  {
    category: 'Depot Stockout Losses Prevented',
    prePilotAmount: '₹38.2 Lakhs/mo',
    currentAmount: '₹1.8 Lakhs/mo',
    savingsAchieved: '₹36.4 Lakhs/mo',
    improvementPct: '-95.3%',
    impact: 'Zero emergency air-freight and eliminated lost hospital tenders'
  },
  {
    category: 'Inventory Holding Costs',
    prePilotAmount: '₹18.6 Lakhs/mo',
    currentAmount: '₹11.2 Lakhs/mo',
    savingsAchieved: '₹7.4 Lakhs/mo',
    improvementPct: '-39.8%',
    impact: 'Reduced warehouse dead space and optimized pallet utilization'
  },
  {
    category: 'Near-Expiry Discard Losses',
    prePilotAmount: '₹14.5 Lakhs/yr',
    currentAmount: '₹0.9 Lakhs/yr',
    savingsAchieved: '₹13.6 Lakhs/yr',
    improvementPct: '-93.8%',
    impact: 'FEFO batch dispatch from Rani cGMP Plant eliminated spoilage'
  }
];

export const PILOT_GOVERNANCE_MILESTONES = [
  {
    id: 'MILE-01',
    milestone: 'Phase 1: Northeast Baseline & Demand Telemetry',
    leadPartner: 'GRD Pharmaceuticals & Healthcare Directorate',
    targetDate: 'Aug 2026',
    completionDate: 'Completed 15 Aug 2026',
    status: 'Completed (100%)',
    deliverables: 'Historical audit of stockouts across 148 hospitals; SKU catalog standardized.'
  },
  {
    id: 'MILE-02',
    milestone: 'Phase 2: Rani cGMP Plant Live Inward Integration',
    leadPartner: 'Rani Formulation QA & Central IT',
    targetDate: 'Oct 2026',
    completionDate: 'Completed 28 Oct 2026',
    status: 'Completed (100%)',
    deliverables: 'Schedule M automated 2D barcode tracking from manufacturing line to dispatch docks.'
  },
  {
    id: 'MILE-03',
    milestone: 'Phase 3: Automated Restocking across 12 Depots',
    leadPartner: 'Guwahati Central Depot Operations Desk',
    targetDate: 'Nov 2026',
    completionDate: 'Live Active (98.2% Availability)',
    status: 'In Progress (Active Pilot)',
    deliverables: 'Automated 1-click replenishment approvals with GPS cold-chain tracking.'
  },
  {
    id: 'MILE-04',
    milestone: 'Phase 4: Upper Assam & Remote Tribal Outreach',
    leadPartner: 'Dhanuka Group Corporate CSR & Trade Desk',
    targetDate: 'Jan 2027',
    completionDate: 'Scheduled Q1 2027',
    status: 'Planned',
    deliverables: 'Expansion to 80+ tea garden hospitals and remote primary healthcare centers.'
  }
];

export const EXECUTIVE_STRATEGY_KPI = {
  quarterlyTenderPipeline: '₹4.20 Cr',
  tendersWon: '₹3.65 Cr (86.9% Win Rate)',
  activePrescriptionsAssam: '2,84,000 / month',
  doctorAdvocacyShare: '42.8% (#1 in Antipyretics in Assam)'
};
