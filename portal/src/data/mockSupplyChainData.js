// mockSupplyChainData.js - Data for Dr. Abhijit Sarma (Supply Chain Manager, Guwahati Central Depot)

export const SUPPLY_CHAIN_PROFILE = {
  name: 'Dr. Abhijit Sarma',
  role: 'Supply Chain Manager',
  roleId: 'supply-chain-manager',
  depot: 'Guwahati Central Depot (Hub 01)',
  location: 'Guwahati, Assam',
  email: 'abhijit.sarma@grdpharma.in',
  phone: '+91 97060 11002',
  operationalMetrics: {
    depotFillRate: '94.2%',
    activeDepotsCovered: 12,
    pendingRestockOrders: 6,
    transfersInTransit: 3,
    avgReplenishmentLeadTime: '2.4 Days',
    coldChainCompliance: '99.1%'
  }
};

export const PENDING_REPLENISHMENT_APPROVALS = [
  {
    id: 'REP-AS-101',
    destinationHub: 'Silchar Regional Depot',
    state: 'Assam (Barak Valley)',
    skuCode: 'GRD-TAB-001',
    medicineName: 'Paracetamol 650mg Tablets',
    formulation: 'Tablets (Strip of 10)',
    currentStockUnits: 1200,
    dailyRunRate: 850,
    daysOfCoverRemaining: 1.4,
    recommendedQty: 10000,
    sourceHub: 'Guwahati Central Depot',
    urgency: 'Critical',
    urgencyReason: 'Hospital orders surge due to viral fever outbreak in Cachar district',
    estimatedTransitHours: 14,
    transporter: 'Brahmaputra Fast Freight',
    truckAssigned: 'AS-01-GC-4482',
    status: 'Pending Approval'
  },
  {
    id: 'REP-AS-102',
    destinationHub: 'Agartala Central Medical Store',
    state: 'Tripura',
    skuCode: 'GRD-TAB-002',
    medicineName: 'Azithromycin 500mg Tablets',
    formulation: 'Tablets (Strip of 3)',
    currentStockUnits: 450,
    dailyRunRate: 320,
    daysOfCoverRemaining: 1.4,
    recommendedQty: 4500,
    sourceHub: 'Guwahati Central Depot',
    urgency: 'Critical',
    urgencyReason: 'Monsoon stock buffer depleted; corridor transit delay risk at NH-8',
    estimatedTransitHours: 22,
    transporter: 'Barak Express Logistics',
    truckAssigned: 'TR-01-A-8921',
    status: 'Pending Approval'
  },
  {
    id: 'REP-AS-103',
    destinationHub: 'Shillong Civil Depot',
    state: 'Meghalaya',
    skuCode: 'GRD-SYR-001',
    medicineName: 'Cough Syrup 100ml',
    formulation: 'Syrup (100ml Bottle)',
    currentStockUnits: 980,
    dailyRunRate: 420,
    daysOfCoverRemaining: 2.3,
    recommendedQty: 5000,
    sourceHub: 'Guwahati Central Depot',
    urgency: 'High',
    urgencyReason: 'Seasonal drop in temperature increasing bronchitis prescriptions',
    estimatedTransitHours: 4,
    transporter: 'Khasi Hills Cargo Direct',
    truckAssigned: 'ML-05-B-1120',
    status: 'Pending Approval'
  },
  {
    id: 'REP-AS-104',
    destinationHub: 'Dibrugarh Medical Depot',
    state: 'Upper Assam',
    skuCode: 'GRD-TAB-003',
    medicineName: 'Amoxicillin & Potassium Clavulanate Tablets',
    formulation: 'Tablets (Strip of 6)',
    currentStockUnits: 820,
    dailyRunRate: 290,
    daysOfCoverRemaining: 2.8,
    recommendedQty: 3600,
    sourceHub: 'Guwahati Central Depot',
    urgency: 'High',
    urgencyReason: 'ICU and post-op inventory request from Assam Medical College',
    estimatedTransitHours: 12,
    transporter: 'Brahmaputra Fast Freight',
    truckAssigned: 'AS-06-C-9901',
    status: 'Pending Approval'
  },
  {
    id: 'REP-AS-105',
    destinationHub: 'Kohima District Depot',
    state: 'Nagaland',
    skuCode: 'GRD-HYG-001',
    medicineName: 'Handuser-C® Hospital Surgical Handrub',
    formulation: 'Antiseptic Solution (500ml Bottle)',
    currentStockUnits: 340,
    dailyRunRate: 90,
    daysOfCoverRemaining: 3.7,
    recommendedQty: 1800,
    sourceHub: 'Guwahati Central Depot',
    urgency: 'Medium',
    urgencyReason: 'Routine bi-weekly buffer replenishment',
    estimatedTransitHours: 16,
    transporter: 'Naga Hills Express',
    truckAssigned: 'NL-01-T-5534',
    status: 'Pending Approval'
  },
  {
    id: 'REP-AS-106',
    destinationHub: 'Aizawl Regional Depot',
    state: 'Mizoram',
    skuCode: 'GRD-CAP-001',
    medicineName: 'Omeprazole 20mg Capsules',
    formulation: 'Capsules (Strip of 15)',
    currentStockUnits: 1100,
    dailyRunRate: 260,
    daysOfCoverRemaining: 4.2,
    recommendedQty: 4000,
    sourceHub: 'Guwahati Central Depot',
    urgency: 'Medium',
    urgencyReason: 'Scheduled restocking for district civil hospital',
    estimatedTransitHours: 26,
    transporter: 'Lushai Logistics Lines',
    truckAssigned: 'MZ-01-H-3312',
    status: 'Pending Approval'
  }
];

export const DEPOT_CAPACITY_SUMMARY = [
  {
    hubName: 'Guwahati Central Depot',
    state: 'Assam',
    type: 'Primary Mother Depot',
    totalPallets: 850,
    usedPallets: 720,
    utilizationPct: 84.7,
    coldStorageUnits: 120,
    coldStorageUsed: 88,
    status: 'Operational',
    leadTimeHours: 0
  },
  {
    hubName: 'Silchar Regional Depot',
    state: 'Assam (Barak)',
    type: 'Secondary Hub',
    totalPallets: 280,
    usedPallets: 255,
    utilizationPct: 91.0,
    coldStorageUnits: 40,
    coldStorageUsed: 36,
    status: 'High Load',
    leadTimeHours: 14
  },
  {
    hubName: 'Dibrugarh Upper Assam Depot',
    state: 'Assam (Upper)',
    type: 'Secondary Hub',
    totalPallets: 320,
    usedPallets: 230,
    utilizationPct: 71.8,
    coldStorageUnits: 50,
    coldStorageUsed: 32,
    status: 'Operational',
    leadTimeHours: 12
  },
  {
    hubName: 'Agartala Central Medical Store',
    state: 'Tripura',
    type: 'Regional Warehouse',
    totalPallets: 240,
    usedPallets: 215,
    utilizationPct: 89.5,
    coldStorageUnits: 35,
    coldStorageUsed: 31,
    status: 'Near Full',
    leadTimeHours: 22
  },
  {
    hubName: 'Shillong Civil Depot',
    state: 'Meghalaya',
    type: 'Regional Warehouse',
    totalPallets: 180,
    usedPallets: 125,
    utilizationPct: 69.4,
    coldStorageUnits: 30,
    coldStorageUsed: 18,
    status: 'Operational',
    leadTimeHours: 4
  },
  {
    hubName: 'Dimapur Transshipment Depot',
    state: 'Nagaland',
    type: 'Transit Hub',
    totalPallets: 190,
    usedPallets: 140,
    utilizationPct: 73.6,
    coldStorageUnits: 25,
    coldStorageUsed: 19,
    status: 'Operational',
    leadTimeHours: 10
  }
];

export const RANI_PLANT_INWARD_BATCHES = [
  {
    batchNo: 'RANI-2026-B089',
    medicine: 'Paracetamol 650mg Tablets',
    skuCode: 'GRD-TAB-001',
    quantityPacks: 25000,
    mfgDate: '12 Nov 2026',
    expiryDate: '31 Oct 2028',
    qcStatus: 'Passed cGMP Inspection',
    inwardStatus: 'Received at Dock 2',
    inspector: 'PB (Pranabesh Bora)',
    dockId: 'Dock-02'
  },
  {
    batchNo: 'RANI-2026-B090',
    medicine: 'Amoxicillin & Potassium Clavulanate Tablets',
    skuCode: 'GRD-TAB-003',
    quantityPacks: 12000,
    mfgDate: '14 Nov 2026',
    expiryDate: '30 Apr 2028',
    qcStatus: 'Passed cGMP Inspection',
    inwardStatus: 'In Transit from Rani (35 km)',
    inspector: 'PB (Pranabesh Bora)',
    dockId: 'Dock-01 (Expected 5:30 PM)'
  },
  {
    batchNo: 'RANI-2026-B091',
    medicine: 'Cough Syrup 100ml (CofGRD)',
    skuCode: 'GRD-SYR-001',
    quantityPacks: 18000,
    mfgDate: '16 Nov 2026',
    expiryDate: '31 Oct 2028',
    qcStatus: 'Passed cGMP Inspection',
    inwardStatus: 'Staging at Rani cGMP Warehouse',
    inspector: 'PB (Pranabesh Bora)',
    dockId: 'Dispatched Tomorrow 9:00 AM'
  },
  {
    batchNo: 'RANI-2026-B092',
    medicine: 'Handuser-C® Hospital Surgical Handrub 500ml',
    skuCode: 'GRD-HYG-001',
    quantityPacks: 8000,
    mfgDate: '17 Nov 2026',
    expiryDate: '30 Nov 2028',
    qcStatus: 'Microbiology Assay in Final Stage',
    inwardStatus: 'QC Quarantine Lab',
    inspector: 'QC Lab Guwahati',
    dockId: 'Estimated Release 20 Nov'
  }
];

export const COLD_CHAIN_MONITORS = [
  {
    vehicleNo: 'AS-01-GC-4482',
    route: 'Guwahati to Silchar',
    skuLoaded: 'Handuser-C® & Injections',
    currentTemp: '4.8°C',
    targetRange: '2.0°C - 8.0°C',
    status: 'Normal',
    gpsLocation: 'Near Lumding Junction',
    lastPing: '2 mins ago',
    driverPhone: '+91 94350 88211'
  },
  {
    vehicleNo: 'TR-01-A-8921',
    route: 'Guwahati to Agartala',
    skuLoaded: 'Pediatric Syrups & Drops',
    currentTemp: '18.2°C',
    targetRange: '15.0°C - 25.0°C (Controlled Room Temp)',
    status: 'Normal',
    gpsLocation: 'Badarpur Border Checkpoint',
    lastPing: '5 mins ago',
    driverPhone: '+91 97740 12044'
  },
  {
    vehicleNo: 'ML-05-B-1120',
    route: 'Guwahati to Shillong',
    skuLoaded: 'Cough Syrup & Omeprazole',
    currentTemp: '16.5°C',
    targetRange: '15.0°C - 25.0°C',
    status: 'Normal',
    gpsLocation: 'Umiam Bypass (Barapani)',
    lastPing: 'Just Now',
    driverPhone: '+91 98630 45520'
  }
];

export const INTER_DEPOT_TRANSFERS = [
  {
    transferId: 'TRF-2026-041',
    sourceDepot: 'Guwahati Central Depot',
    destinationDepot: 'Silchar Regional Depot',
    skuCode: 'GRD-TAB-001',
    medicine: 'Paracetamol 650mg Tablets',
    quantityUnits: 10000,
    reason: 'Surge in hospital fever cases in Barak Valley; stockout risk averted',
    transporter: 'Brahmaputra Fast Freight',
    vehicleNo: 'AS-01-GC-4482',
    status: 'In Transit',
    departureTime: 'Today 2:30 PM',
    estimatedArrival: 'Tomorrow 5:00 AM'
  },
  {
    transferId: 'TRF-2026-042',
    sourceDepot: 'Tezpur Regional Hub',
    destinationDepot: 'Agartala Central Medical Store',
    skuCode: 'GRD-TAB-002',
    medicine: 'Azithromycin 500mg Tablets',
    quantityUnits: 4500,
    reason: 'Pre-monsoon buffer rebalancing along NH-8 corridor',
    transporter: 'Barak Express Logistics',
    vehicleNo: 'TR-01-A-8921',
    status: 'In Transit',
    departureTime: 'Today 11:00 AM',
    estimatedArrival: 'Tomorrow 9:00 AM'
  },
  {
    transferId: 'TRF-2026-043',
    sourceDepot: 'Guwahati Central Depot',
    destinationDepot: 'Shillong Civil Depot',
    skuCode: 'GRD-SYR-001',
    medicine: 'Cough Syrup 100ml (CofGRD)',
    quantityUnits: 5000,
    reason: 'Winter cold respiratory surge in East Khasi Hills',
    transporter: 'Khasi Hills Cargo Direct',
    vehicleNo: 'ML-05-B-1120',
    status: 'Scheduled',
    departureTime: 'Tomorrow 7:00 AM',
    estimatedArrival: 'Tomorrow 11:30 AM'
  }
];
