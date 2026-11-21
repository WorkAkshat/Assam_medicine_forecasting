// mockSalesDirectorData.js - Commercial & Trade Operations Data for Sales Director Rupjyoti Bhattacharya

export const SALES_DIRECTOR_PROFILE = {
  name: 'Mr. Rupjyoti Bhattacharya',
  role: 'Sales Director',
  department: 'Commercial & Regional Trade Desk',
  headquarters: 'Guwahati Corporate HQ (G.S. Road)',
  jurisdiction: 'All 8 Northeast States (Assam, Meghalaya, Tripura, Nagaland, Manipur, Arunachal Pradesh, Mizoram, Sikkim)',
  currentMonth: 'November 2026',
  monthlyTargetINR: 28000000, // ₹2.80 Crores
  achievedMTDINR: 24840000,    // ₹2.48 Crores
  achievementPercentage: 88.7,
  daysRemainingInMonth: 12,
  runRateForecastINR: 29800000, // ₹2.98 Crores (Projected 106.4% of target)
  growthYoY: 14.8,
  activeDistributorsCount: 14,
  fieldForceSize: 48, // Medical Representatives & Area Business Managers
  secondaryChemistCoverage: 412,
  institutionalHospitalTenders: 18
};

export const TERRITORY_PERFORMANCE = [
  {
    id: 'TER-01',
    territoryName: 'Lower Assam & Guwahati Metro',
    coverage: 'Kamrup Metro, Kamrup Rural, Nalbari, Barpeta',
    state: 'Assam',
    regionalHead: 'Sanjib Bora (Area Sales Manager)',
    targetINR: 7500000,
    achievedINR: 7820000,
    percentage: 104.3,
    activeDistributors: 3,
    fieldReps: 14,
    chemistOutreach: 142,
    outstandingCreditINR: 3250000,
    status: 'Exceeded',
    trend: '+18.2% YoY',
    keyGrowthDriver: 'Hospital tender pull & Panbazar trade volume'
  },
  {
    id: 'TER-02',
    territoryName: 'Upper Assam Tea Belt',
    coverage: 'Dibrugarh, Tinsukia, Jorhat, Sivasagar',
    state: 'Assam',
    regionalHead: 'Bikash Gogoi (Senior Executive)',
    targetINR: 5500000,
    achievedINR: 5140000,
    percentage: 93.5,
    activeDistributors: 2,
    fieldReps: 10,
    chemistOutreach: 88,
    outstandingCreditINR: 2410000,
    status: 'On Track',
    trend: '+12.4% YoY',
    keyGrowthDriver: 'Tea garden medical indents & AMCH supply'
  },
  {
    id: 'TER-03',
    territoryName: 'Barak Valley Corridor',
    coverage: 'Cachar, Karimganj, Hailakandi',
    state: 'Assam',
    regionalHead: 'Subrata Deb (Territory Manager)',
    targetINR: 3000000,
    achievedINR: 2680000,
    percentage: 89.3,
    activeDistributors: 2,
    fieldReps: 6,
    chemistOutreach: 48,
    outstandingCreditINR: 1980000,
    status: 'Attention',
    trend: '+4.1% YoY',
    keyGrowthDriver: 'NH-6 Sonapur delay causing dispatch backlog'
  },
  {
    id: 'TER-04',
    territoryName: 'Meghalaya Hill District',
    coverage: 'East Khasi Hills (Shillong), West Garo Hills (Tura)',
    state: 'Meghalaya',
    regionalHead: 'Baphilinia Nongrum (Field Officer)',
    targetINR: 3200000,
    achievedINR: 3350000,
    percentage: 104.7,
    activeDistributors: 2,
    fieldReps: 6,
    chemistOutreach: 52,
    outstandingCreditINR: 1420000,
    status: 'Exceeded',
    trend: '+22.6% YoY',
    keyGrowthDriver: 'Early winter cold wave; CofGRD cough syrup surge'
  },
  {
    id: 'TER-05',
    territoryName: 'Tripura Valley',
    coverage: 'West Tripura (Agartala), Gomati (Udaipur)',
    state: 'Tripura',
    regionalHead: 'Monojit Paul (Area Manager)',
    targetINR: 3800000,
    achievedINR: 3200000,
    percentage: 84.2,
    activeDistributors: 2,
    fieldReps: 5,
    chemistOutreach: 39,
    outstandingCreditINR: 1850000,
    status: 'Attention',
    trend: '+6.2% YoY',
    keyGrowthDriver: 'TMC hospital tender awaiting payment cycle'
  },
  {
    id: 'TER-06',
    territoryName: 'Nagaland & Manipur',
    coverage: 'Dimapur, Kohima, Imphal West',
    state: 'Nagaland & Manipur',
    regionalHead: 'Keviseto Angami (Territory Executive)',
    targetINR: 2800000,
    achievedINR: 2610000,
    percentage: 93.2,
    activeDistributors: 2,
    fieldReps: 4,
    chemistOutreach: 28,
    outstandingCreditINR: 1100000,
    status: 'On Track',
    trend: '+9.5% YoY',
    keyGrowthDriver: 'Dimapur highway transport hub demand'
  },
  {
    id: 'TER-07',
    territoryName: 'Arunachal Foothills',
    coverage: 'Papum Pare (Itanagar), Pasighat',
    state: 'Arunachal Pradesh',
    regionalHead: 'Taba Tadar (Field Officer)',
    targetINR: 1400000,
    achievedINR: 1280000,
    percentage: 91.4,
    activeDistributors: 1,
    fieldReps: 2,
    chemistOutreach: 16,
    outstandingCreditINR: 620000,
    status: 'On Track',
    trend: '+8.0% YoY',
    keyGrowthDriver: 'TRIHMS state medical college regular indent'
  },
  {
    id: 'TER-08',
    territoryName: 'Mizoram & South Hills',
    coverage: 'Aizawl District, Lunglei',
    state: 'Mizoram',
    regionalHead: 'Lalremruata (Field Representative)',
    targetINR: 800000,
    achievedINR: 760000,
    percentage: 95.0,
    activeDistributors: 1,
    fieldReps: 1,
    chemistOutreach: 9,
    outstandingCreditINR: 310000,
    status: 'On Track',
    trend: '+11.1% YoY',
    keyGrowthDriver: 'Direct civil hospital supplies'
  }
];

export const COMMERCIAL_CREDIT_APPROVALS = [
  {
    id: 'CR-APP-2026-091',
    distributorId: 'DIST-001',
    distributorName: 'Pragjyotish Medico & Trade Agencies',
    territory: 'Kamrup Metro (Guwahati)',
    contactPerson: 'Mr. Bipul Goswami',
    sanctionedLimitINR: 4500000,
    currentOutstandingINR: 1850000,
    requestedOrderNumber: 'PO-GHY-1084',
    requestedOrderValueINR: 421600,
    requestedAction: 'PO Release Approval',
    reason: 'Emergency Hospital Indent for GMCH surgical unit (Handuser-C® 500ml & Azithromycin)',
    reliabilityScore: '98% (Grade A)',
    pastPaymentDaysAvg: 26, // within 30-day term
    creditHeadroomAfterOrderINR: 2228400,
    urgency: 'High Priority',
    requestedTime: '18 Nov 2026, 11:45 AM',
    status: 'Pending Approval'
  },
  {
    id: 'CR-APP-2026-092',
    distributorId: 'DIST-002',
    distributorName: 'Barak Valley Medico Distributors',
    territory: 'Barak Valley (Silchar & SMCH)',
    contactPerson: 'Mr. Anup Roy',
    sanctionedLimitINR: 3000000,
    currentOutstandingINR: 2620000,
    requestedOrderNumber: 'PO-SIL-1081',
    requestedOrderValueINR: 680000,
    requestedAction: 'Temporary Credit Enhancement (+₹5.0 Lakhs)',
    reason: 'Heavy flood restocking buffer indent. Previous invoice clearance delayed due to NH-6 bridge repair.',
    reliabilityScore: '91% (Grade B+)',
    pastPaymentDaysAvg: 33,
    creditHeadroomAfterOrderINR: -300000, // Exceeds limit by 3.0L without enhancement
    urgency: 'Critical Restock',
    requestedTime: '18 Nov 2026, 09:30 AM',
    status: 'Pending Approval'
  },
  {
    id: 'CR-APP-2026-093',
    distributorId: 'DIST-004',
    distributorName: 'Eastern Drug House Agartala',
    territory: 'West Tripura (Agartala)',
    contactPerson: 'Mr. Bikram Saha',
    sanctionedLimitINR: 2500000,
    currentOutstandingINR: 1910000,
    requestedOrderNumber: 'PO-AGT-1079',
    requestedOrderValueINR: 340000,
    requestedAction: 'Payment Term 15-Day Extension',
    reason: 'Tripura Medical College institutional disbursement scheduled on Nov 30; requesting 15-day grace on Oct bill.',
    reliabilityScore: '94% (Grade A-)',
    pastPaymentDaysAvg: 29,
    creditHeadroomAfterOrderINR: 250000,
    urgency: 'Medium',
    requestedTime: '17 Nov 2026, 04:15 PM',
    status: 'Pending Approval'
  }
];

export const TOP_PRODUCTS_COMMERCIAL = [
  {
    skuCode: 'GRD-TAB-001',
    skuName: 'Paracetamol 650mg Tablets',
    brandName: 'DoloGRD-650',
    category: 'Tablets',
    monthlyRevenueINR: 6840000,
    unitsSold: 275800,
    growthRate: '+16.2%',
    prescriptionShare: '34.8%',
    marketPosition: '#1 in Assam Primary Healthcare'
  },
  {
    skuCode: 'GRD-HYG-001',
    skuName: 'Handuser-C® Hospital Handrub 500ml',
    brandName: 'Handuser-C®',
    category: 'Suspensions & Hygiene',
    monthlyRevenueINR: 5200000,
    unitsSold: 29700,
    growthRate: '+24.5%',
    prescriptionShare: '48.2%',
    marketPosition: '#1 Institutional Surgical Sanitizer'
  },
  {
    skuCode: 'GRD-SYR-002',
    skuName: 'Ambroxol + Terbutaline Cough Syrup',
    brandName: 'CofGRD Expectorant',
    category: 'Syrups',
    monthlyRevenueINR: 4120000,
    unitsSold: 60500,
    growthRate: '+31.4%',
    prescriptionShare: '28.6%',
    marketPosition: 'Top Winter Respiratory Formulation'
  },
  {
    skuCode: 'GRD-TAB-003',
    skuName: 'Amoxicillin & Potassium Clavulanate 625mg',
    brandName: 'ClavoGRD-625',
    category: 'Tablets',
    monthlyRevenueINR: 3650000,
    unitsSold: 27650,
    growthRate: '+11.8%',
    prescriptionShare: '22.4%',
    marketPosition: 'Leading Broad-Spectrum Antibiotic'
  },
  {
    skuCode: 'GRD-TAB-002',
    skuName: 'Azithromycin 500mg Tablets',
    brandName: 'AzithroGRD-500',
    category: 'Tablets',
    monthlyRevenueINR: 2840000,
    unitsSold: 31730,
    growthRate: '+9.4%',
    prescriptionShare: '18.9%',
    marketPosition: 'High Hospital Inpatient Demand'
  }
];

export const FIELD_FORCE_ROSTER = [
  {
    id: 'MR-01',
    name: 'Anupam Baruah',
    designation: 'Senior Medical Representative',
    hq: 'Guwahati Metro',
    territory: 'Kamrup Metro (Panbazar & GMCH)',
    doctorCallsTarget: 180,
    doctorCallsCompleted: 174,
    callAdherence: 96.6,
    pobBookedINR: 620000, // Personal Order Booking
    topBrandFocused: 'DoloGRD-650 & Handuser-C®',
    rating: 'A+ (Top Performer)'
  },
  {
    id: 'MR-02',
    name: 'Debasish Deb',
    designation: 'Medical Representative',
    hq: 'Shillong HQ',
    territory: 'East Khasi Hills & NEIGRIHMS',
    doctorCallsTarget: 160,
    doctorCallsCompleted: 156,
    callAdherence: 97.5,
    pobBookedINR: 480000,
    topBrandFocused: 'CofGRD Cough Syrup',
    rating: 'A+ (Top Performer)'
  },
  {
    id: 'MR-03',
    name: 'Bikash Gogoi',
    designation: 'Area Business Manager',
    hq: 'Dibrugarh HQ',
    territory: 'Dibrugarh & Tinsukia Tea Belt',
    doctorCallsTarget: 170,
    doctorCallsCompleted: 158,
    callAdherence: 92.9,
    pobBookedINR: 540000,
    topBrandFocused: 'ClavoGRD-625 & PantoGRD',
    rating: 'A'
  },
  {
    id: 'MR-04',
    name: 'Subrata Deb',
    designation: 'Territory Manager',
    hq: 'Silchar HQ',
    territory: 'Barak Valley & SMCH',
    doctorCallsTarget: 150,
    doctorCallsCompleted: 132,
    callAdherence: 88.0,
    pobBookedINR: 390000,
    topBrandFocused: 'DoloGRD-650 & Handuser-C®',
    rating: 'B+ (Logistics Impacted)'
  },
  {
    id: 'MR-05',
    name: 'Monojit Paul',
    designation: 'Medical Representative',
    hq: 'Agartala HQ',
    territory: 'West Tripura & GBP Hospital',
    doctorCallsTarget: 160,
    doctorCallsCompleted: 142,
    callAdherence: 88.8,
    pobBookedINR: 410000,
    topBrandFocused: 'AzithroGRD & CefiGRD-O',
    rating: 'B+'
  },
  {
    id: 'MR-06',
    name: 'Keviseto Angami',
    designation: 'Field Officer',
    hq: 'Dimapur HQ',
    territory: 'Dimapur Commercial Hub & Kohima',
    doctorCallsTarget: 140,
    doctorCallsCompleted: 134,
    callAdherence: 95.7,
    pobBookedINR: 360000,
    topBrandFocused: 'CofGRD & DoloGRD',
    rating: 'A'
  }
];
