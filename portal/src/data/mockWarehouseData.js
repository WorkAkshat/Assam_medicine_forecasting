// mockWarehouseData.js - Operational Data for Pranabesh Bora (Warehouse Controller, Rani cGMP Formulation Plant)

export const WAREHOUSE_PROFILE = {
  name: 'Pranabesh Bora',
  role: 'Warehouse Controller',
  roleId: 'warehouse-staff',
  facility: 'Rani cGMP Formulation Plant (Central Plant WH)',
  location: 'Rani Industrial Area, Kamrup Rural, Assam',
  email: 'pranabesh.bora@grdpharma.in',
  phone: '+91 94357 32217',
  metrics: {
    totalPacksInPlant: 248500,
    batchesStagedForDispatch: 4,
    batchesInQuarantine: 1,
    activeLoadingDocks: '3 of 4 Operational',
    todayDispatchedUnits: 42000,
    cycleCountAccuracy: '99.85%'
  }
};

export const PLANT_PRODUCTION_BATCHES = [
  {
    batchNo: 'RANI-2026-B089',
    skuCode: 'GRD-TAB-001',
    medicine: 'Paracetamol 650mg Tablets',
    formulation: 'Tablets (Blister Pack of 10)',
    quantityPacks: 45000,
    availableUnits: 20000,
    dispatchedUnits: 25000,
    mfgDate: '12 Nov 2026',
    expiryDate: '31 Oct 2028',
    aisleLocation: 'Aisle A-02 / Pallet 14',
    storageZone: 'Ambient Finished Goods (15-25°C)',
    qcStatus: 'Passed cGMP QA',
    qaOfficer: 'PB (Pranabesh Bora)',
    barcode: '8901234500891',
    dispatchStatus: 'Partially Dispatched to Guwahati Depot'
  },
  {
    batchNo: 'RANI-2026-B090',
    skuCode: 'GRD-TAB-003',
    medicine: 'Amoxicillin & Potassium Clavulanate Tablets',
    formulation: 'Tablets (Strip of 6)',
    quantityPacks: 30000,
    availableUnits: 18000,
    dispatchedUnits: 12000,
    mfgDate: '14 Nov 2026',
    expiryDate: '30 Apr 2028',
    aisleLocation: 'Aisle A-05 / Pallet 08',
    storageZone: 'Controlled Humidity Bay (<60% RH)',
    qcStatus: 'Passed cGMP QA',
    qaOfficer: 'Dr. Nilakshi Das (QA Lead)',
    barcode: '8901234500907',
    dispatchStatus: 'Loading at Dock 1'
  },
  {
    batchNo: 'RANI-2026-B091',
    skuCode: 'GRD-SYR-001',
    medicine: 'Cough Syrup 100ml (CofGRD)',
    formulation: 'Oral Liquid (Amber PET Bottle)',
    quantityPacks: 36000,
    availableUnits: 36000,
    dispatchedUnits: 0,
    mfgDate: '16 Nov 2026',
    expiryDate: '31 Oct 2028',
    aisleLocation: 'Aisle B-01 / Pallet 22',
    storageZone: 'Liquid Formulation Hall B',
    qcStatus: 'Passed cGMP QA',
    qaOfficer: 'PB (Pranabesh Bora)',
    barcode: '8901234500914',
    dispatchStatus: 'Staged for Morning Dispatch'
  },
  {
    batchNo: 'RANI-2026-B092',
    skuCode: 'GRD-HYG-001',
    medicine: 'Handuser-C® Hospital Surgical Handrub 500ml',
    formulation: 'Antiseptic Solution (Dispenser Bottle)',
    quantityPacks: 18000,
    availableUnits: 18000,
    dispatchedUnits: 0,
    mfgDate: '17 Nov 2026',
    expiryDate: '30 Nov 2028',
    aisleLocation: 'Aisle C-04 / Pallet 03',
    storageZone: 'Flammable/Alcohol Storage Bay',
    qcStatus: 'Microbiology Assay in Final Stage',
    qaOfficer: 'Central QC Microbiology Lab',
    barcode: '8901234500921',
    dispatchStatus: 'Under QC Quarantine (Est. Release 20 Nov)'
  },
  {
    batchNo: 'RANI-2026-B093',
    skuCode: 'GRD-TAB-002',
    medicine: 'Azithromycin 500mg Tablets',
    formulation: 'Tablets (Strip of 3)',
    quantityPacks: 22000,
    availableUnits: 22000,
    dispatchedUnits: 0,
    mfgDate: '18 Nov 2026',
    expiryDate: '31 Oct 2028',
    aisleLocation: 'Aisle A-08 / Pallet 11',
    storageZone: 'Ambient Finished Goods (15-25°C)',
    qcStatus: 'Passed cGMP QA',
    qaOfficer: 'PB (Pranabesh Bora)',
    barcode: '8901234500938',
    dispatchStatus: 'Ready for Staging'
  },
  {
    batchNo: 'RANI-2026-B094',
    skuCode: 'GRD-CAP-001',
    medicine: 'Omeprazole 20mg Capsules',
    formulation: 'Enteric Coated Capsules (Strip of 15)',
    quantityPacks: 28000,
    availableUnits: 28000,
    dispatchedUnits: 0,
    mfgDate: '18 Nov 2026',
    expiryDate: '30 Nov 2028',
    aisleLocation: 'Aisle A-03 / Pallet 19',
    storageZone: 'Ambient Finished Goods (15-25°C)',
    qcStatus: 'Passed cGMP QA',
    qaOfficer: 'Dr. Nilakshi Das (QA Lead)',
    barcode: '8901234500945',
    dispatchStatus: 'Ready for Staging'
  }
];

export const PLANT_DOCK_DISPATCHES = [
  {
    gatePassId: 'GP-RANI-2026-081',
    dockId: 'Loading Bay 01',
    destination: 'Guwahati Central Depot (Hub 01)',
    distanceKm: 35,
    transporter: 'Brahmaputra Fast Freight',
    vehicleNo: 'AS-01-GC-4482',
    driverName: 'Biren Kalita',
    driverPhone: '+91 94350 88211',
    consignment: 'Amoxicillin 625mg & Paracetamol 650mg',
    totalCartons: 420,
    totalPacks: 25000,
    loadingStatus: 'Loading Completed (100%)',
    gateStatus: 'Gate Pass Signed & Cleared',
    departureTime: 'Today 4:45 PM',
    temperatureCheck: 'Verified Ambient 21.4°C'
  },
  {
    gatePassId: 'GP-RANI-2026-082',
    dockId: 'Loading Bay 02',
    destination: 'Silchar Regional Depot (Direct Express)',
    distanceKm: 310,
    transporter: 'Barak Valley Medico Carrier',
    vehicleNo: 'AS-11-BC-6720',
    driverName: 'Surajit Roy',
    driverPhone: '+91 98642 33410',
    consignment: 'CofGRD Syrup & Handuser-C®',
    totalCartons: 280,
    totalPacks: 14000,
    loadingStatus: 'Forklift Loading (65%)',
    gateStatus: 'Pre-Dispatch Inspection in Progress',
    departureTime: 'Estimated 6:30 PM',
    temperatureCheck: 'Insulated Container Checked'
  },
  {
    gatePassId: 'GP-RANI-2026-083',
    dockId: 'Loading Bay 03',
    destination: 'Guwahati Mother Hub (Evening Shuttle)',
    distanceKm: 35,
    transporter: 'GRD Plant Fleet Dedicated',
    vehicleNo: 'AS-01-M-1904',
    driverName: 'Dhanjit Medhi',
    driverPhone: '+91 97061 55902',
    consignment: 'Azithromycin 500mg Tablets',
    totalCartons: 190,
    totalPacks: 11000,
    loadingStatus: 'Staged on Pallets at Bay',
    gateStatus: 'Waiting for Dock Bay 01 Clear',
    departureTime: 'Estimated 7:45 PM',
    temperatureCheck: 'Pending Pre-Loading Check'
  }
];

export const STORAGE_AISLE_MAP = [
  {
    aisleCode: 'Aisle A',
    name: 'Solid Oral Dosage (Tablets & Capsules)',
    totalPalletSlots: 160,
    occupiedSlots: 138,
    tempCondition: 'Ambient (15°C - 25°C)',
    relativeHumidity: '<60% RH',
    fireSafetyStatus: 'Passed Monthly Audit',
    topSkus: ['Paracetamol 650mg', 'Amoxicillin + Clav', 'Azithromycin 500mg', 'Omeprazole 20mg']
  },
  {
    aisleCode: 'Aisle B',
    name: 'Oral Liquids & Suspensions (Syrups)',
    totalPalletSlots: 120,
    occupiedSlots: 92,
    tempCondition: 'Controlled Room Temp (18°C - 24°C)',
    relativeHumidity: 'Standard RH',
    fireSafetyStatus: 'Passed Monthly Audit',
    topSkus: ['CofGRD Cough Syrup 100ml', 'Pediatric Antipyretic Drops']
  },
  {
    aisleCode: 'Aisle C',
    name: 'Hospital Surgical Solutions & Antiseptics',
    totalPalletSlots: 80,
    occupiedSlots: 46,
    tempCondition: 'Flame-Proof Ventilated Vault',
    relativeHumidity: 'Exhaust Fans Active',
    fireSafetyStatus: 'CO2 Automated Sprinklers Active',
    topSkus: ['Handuser-C® Surgical Handrub 500ml', 'Disinfectant Wipes']
  },
  {
    aisleCode: 'Cold Bay 01',
    name: 'Cold Storage Room (Schedule C/C1)',
    totalPalletSlots: 40,
    occupiedSlots: 24,
    tempCondition: '2.0°C - 8.0°C (Dual Chiller Units)',
    relativeHumidity: 'Dehumidified',
    fireSafetyStatus: 'Backup Diesel Generator Live',
    topSkus: ['Hospital Biologics Buffer', 'Temperature-Sensitive Suspensions']
  }
];

export const CYCLE_AUDIT_LOG = [
  {
    auditId: 'AUD-2026-W46',
    date: '17 Nov 2026',
    skuName: 'Paracetamol 650mg Tablets',
    skuCode: 'GRD-TAB-001',
    erpRecordedUnits: 45000,
    physicalCountUnits: 45000,
    variance: 0,
    accuracyPct: 100.0,
    status: 'Verified Match',
    auditor: 'PB (Pranabesh Bora)'
  },
  {
    auditId: 'AUD-2026-W45',
    date: '15 Nov 2026',
    skuName: 'Amoxicillin & Potassium Clavulanate',
    skuCode: 'GRD-TAB-003',
    erpRecordedUnits: 30000,
    physicalCountUnits: 30000,
    variance: 0,
    accuracyPct: 100.0,
    status: 'Verified Match',
    auditor: 'PB (Pranabesh Bora)'
  },
  {
    auditId: 'AUD-2026-W44',
    date: '14 Nov 2026',
    skuName: 'Cough Syrup 100ml (CofGRD)',
    skuCode: 'GRD-SYR-001',
    erpRecordedUnits: 36000,
    physicalCountUnits: 35980,
    variance: -20,
    accuracyPct: 99.94,
    status: 'Minor Breakage Reconciled',
    auditor: 'Plant QA Inspection Team'
  }
];
