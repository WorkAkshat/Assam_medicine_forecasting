// mockForecasts.js - Decision-Support Demand Forecasting Data
export const MOCK_FORECAST_ITEMS = [
  {
    id: 'FC-001',
    skuId: 'SKU-001',
    skuCode: 'GRD-TAB-001',
    skuName: 'Paracetamol 650mg Tablets',
    category: 'Tablets',
    targetState: 'Assam',
    targetLocation: 'Guwahati & Barak Valley',
    customerSegment: 'All Segments',
    historicalAverageMonthly: 7200,
    forecastNext30Days: 8850,
    forecastNext60Days: 9100,
    forecastNext90Days: 7800,
    baselineStatisticalModel: 7400,
    projectedGrowthPct: 22.9,
    confidenceLevel: 'High (92%)',
    accuracyScore: 84.6, // Last measured MAPE-based accuracy
    forecastBias: '+3.2% (Slight Underestimate)',
    seasonalityPattern: 'Winter viral fevers & post-monsoon influenza peak (Nov–Jan)',
    primaryDrivers: [
      'Pre-winter hospital and institutional stock building in GMCH & Silchar Medical College',
      'Seasonal viral respiratory surge in lower Assam and Kamrup districts',
      'Distributor replenishment cycle following Diwali festival buffer clearance'
    ],
    riskFactors: [
      'Fog and transport transit delays on NH-27 Guwahati-Silchar highway',
      'Potential stockout at Silchar C&F if replenishment transit exceeds 5 days'
    ],
    recommendedAction: 'Increase Rani plant batch formulation by 2,000 strips; dispatch 1,500 strips buffer to Silchar C&F before cold wave onset.'
  },
  {
    id: 'FC-002',
    skuId: 'SKU-002',
    skuCode: 'GRD-TAB-002',
    skuName: 'Azithromycin 500mg Tablets',
    category: 'Tablets',
    targetState: 'Assam',
    targetLocation: 'Dibrugarh & Upper Assam',
    customerSegment: 'Hospitals & Retail',
    historicalAverageMonthly: 3400,
    forecastNext30Days: 4600,
    forecastNext60Days: 4900,
    forecastNext90Days: 3800,
    baselineStatisticalModel: 3550,
    projectedGrowthPct: 29.5,
    confidenceLevel: 'High (89%)',
    accuracyScore: 81.4,
    forecastBias: '+1.8%',
    seasonalityPattern: 'Winter RTI (Respiratory Tract Infection) surge in tea garden communities',
    primaryDrivers: [
      'Upper Assam winter broncho-pulmonary treatment protocols',
      'Hospital bulk indent from Assam Medical College Dibrugarh & Tinsukia Civil Hospital',
      'Surge in retail OTC and prescription refill velocity'
    ],
    riskFactors: [
      'Active raw material (Azithromycin API) lead time from supplier (12 days)'
    ],
    recommendedAction: 'Trigger bulk batch run at Rani facility; ensure minimum 1,200 units reserved for Dibrugarh hub by Nov 25.'
  },
  {
    id: 'FC-003',
    skuId: 'SKU-003',
    skuCode: 'GRD-TAB-003',
    skuName: 'Amoxicillin & Potassium Clavulanate 625mg',
    category: 'Tablets',
    targetState: 'Nagaland & Manipur',
    targetLocation: 'Dimapur & Imphal',
    customerSegment: 'Stockists & Clinical',
    historicalAverageMonthly: 2100,
    forecastNext30Days: 2950,
    forecastNext60Days: 3100,
    forecastNext90Days: 2600,
    baselineStatisticalModel: 2200,
    projectedGrowthPct: 34.1,
    confidenceLevel: 'Medium (83%)',
    accuracyScore: 78.2,
    forecastBias: '-2.4% (Slight Overestimate)',
    seasonalityPattern: 'Winter clinical demand + highway blockage buffering',
    primaryDrivers: [
      'Stockists in Dimapur stocking up ahead of winter road maintenance',
      'Rise in bacterial RTI and post-viral bacterial secondary infections'
    ],
    riskFactors: [
      'NH-29 transit disruption risk between Dimapur and Kohima/Imphal'
    ],
    recommendedAction: 'Prioritize multi-modal transit; pre-position 800 units in Dimapur buffer warehouse.'
  },
  {
    id: 'FC-004',
    skuId: 'SKU-014',
    skuCode: 'GRD-HYG-001',
    skuName: 'Handuser-C® Hospital Surgical Handrub 500ml',
    category: 'Suspensions & Hygiene',
    targetState: 'Multi-State Northeast',
    targetLocation: 'Regional Medical Colleges & Defense Bases',
    customerSegment: 'Institutional & Hospitals',
    historicalAverageMonthly: 5500,
    forecastNext30Days: 7400,
    forecastNext60Days: 7800,
    forecastNext90Days: 6200,
    baselineStatisticalModel: 5800,
    projectedGrowthPct: 27.6,
    confidenceLevel: 'High (94%)',
    accuracyScore: 88.5,
    forecastBias: '+0.9%',
    seasonalityPattern: 'Annual State Health Mission (NHM) and Defense procurement cycle',
    primaryDrivers: [
      'Government hospital quarterly sanitization tenders renewal in Assam & Meghalaya',
      'Army Base Hospital procurement (Eastern Command supply order scheduled Dec 1)',
      'Continuous infection-control compliance protocols in ICU/OT wards'
    ],
    riskFactors: [
      'Packaging pump dispenser availability from vendor in Kolkata'
    ],
    recommendedAction: 'Maintain uninterrupted packaging inventory at Rani plant; schedule direct institutional dispatches.'
  },
  {
    id: 'FC-005',
    skuId: 'SKU-012',
    skuCode: 'GRD-SYR-002',
    skuName: 'Ambroxol + Terbutaline + Guaiphenesin Cough Syrup',
    category: 'Syrups',
    targetState: 'Meghalaya & Mizoram',
    targetLocation: 'Shillong & Aizawl',
    customerSegment: 'Retailers & Dispensaries',
    historicalAverageMonthly: 4100,
    forecastNext30Days: 5800,
    forecastNext60Days: 6200,
    forecastNext90Days: 4500,
    baselineStatisticalModel: 4300,
    projectedGrowthPct: 34.8,
    confidenceLevel: 'High (87%)',
    accuracyScore: 82.0,
    forecastBias: '+4.1%',
    seasonalityPattern: 'High hill altitude winter chill & dry cough epidemic (Nov–Feb)',
    primaryDrivers: [
      'Sub-zero and high moisture conditions triggering acute bronchitis in Shillong plateau and Aizawl hills',
      'Rapid replenishment demand from hill stockists with small storage footprints'
    ],
    riskFactors: [
      'Steep ghat transit times (Guwahati to Shillong: 4 hrs; Guwahati to Aizawl: 18-24 hrs)'
    ],
    recommendedAction: 'Establish 2-week rolling safety stock at Shillong C&F; batch shipment via containerized trucks.'
  },
  {
    id: 'FC-006',
    skuId: 'SKU-017',
    skuCode: 'GRD-SUS-001',
    skuName: 'Cefixime Oral Suspension IP 50mg/5ml',
    category: 'Suspensions & Hygiene',
    targetState: 'Assam & Tripura',
    targetLocation: 'Tezpur & Agartala',
    customerSegment: 'Pediatric Clinics & Retailers',
    historicalAverageMonthly: 1950,
    forecastNext30Days: 2600,
    forecastNext60Days: 2750,
    forecastNext90Days: 2100,
    baselineStatisticalModel: 2050,
    projectedGrowthPct: 26.8,
    confidenceLevel: 'Medium (81%)',
    accuracyScore: 76.8,
    forecastBias: '-1.5%',
    seasonalityPattern: 'Late autumn pediatric gastrointestinal and enteric fever cases',
    primaryDrivers: [
      'Pediatric clinic prescription flow in rural health centers',
      'Stock replenishment for rural healthcare sub-centers in Darrang & Sonitpur'
    ],
    riskFactors: [
      'Short 7-day reconstituted shelf life requires education of stockists against retail hoarding'
    ],
    recommendedAction: 'Supply dry syrup bottles in smaller, frequent batch lots to prevent stock aging.'
  }
];

// Historical vs Forecast Monthly Trend for Top SKUs (6 Months Past + 3 Months Horizon)
export const FORECAST_CHART_TIMELINE = [
  { month: 'Jun 2026', actualSales: 24800, baselineForecast: 23500, aiForecast: 24200, confidenceLower: 22000, confidenceUpper: 26000, accuracy: 81.2 },
  { month: 'Jul 2026', actualSales: 26100, baselineForecast: 24200, aiForecast: 25800, confidenceLower: 23500, confidenceUpper: 27500, accuracy: 83.5 },
  { month: 'Aug 2026', actualSales: 28900, baselineForecast: 25800, aiForecast: 28100, confidenceLower: 26000, confidenceUpper: 30500, accuracy: 84.1 },
  { month: 'Sep 2026', actualSales: 31200, baselineForecast: 28000, aiForecast: 30800, confidenceLower: 28500, confidenceUpper: 33000, accuracy: 85.0 },
  { month: 'Oct 2026', actualSales: 33500, baselineForecast: 29500, aiForecast: 33100, confidenceLower: 31000, confidenceUpper: 35500, accuracy: 86.4 },
  { month: 'Nov 2026 (Curr)', actualSales: 34100, baselineForecast: 30200, aiForecast: 34800, confidenceLower: 32500, confidenceUpper: 37000, accuracy: 87.2 },
  { month: 'Dec 2026 (FC)', actualSales: null, baselineForecast: 31500, aiForecast: 38200, confidenceLower: 35000, confidenceUpper: 41000, accuracy: null },
  { month: 'Jan 2027 (FC)', actualSales: null, baselineForecast: 32000, aiForecast: 39500, confidenceLower: 36000, confidenceUpper: 42500, accuracy: null },
  { month: 'Feb 2027 (FC)', actualSales: null, baselineForecast: 28500, aiForecast: 33400, confidenceLower: 30500, confidenceUpper: 36000, accuracy: null },
];

export const FORECAST_ACCURACY_BY_CATEGORY = [
  { category: 'Tablets', baselineAccuracy: 66.4, currentModelAccuracy: 84.6, improvement: '+18.2%', sampleSize: '125,000 units' },
  { category: 'Capsules', baselineAccuracy: 63.8, currentModelAccuracy: 81.2, improvement: '+17.4%', sampleSize: '68,000 units' },
  { category: 'Syrups', baselineAccuracy: 61.2, currentModelAccuracy: 82.8, improvement: '+21.6%', sampleSize: '94,000 units' },
  { category: 'Suspensions & Hygiene', baselineAccuracy: 65.5, currentModelAccuracy: 88.5, improvement: '+23.0%', sampleSize: '110,000 units' },
];

export const STATE_WISE_DEMAND_DISTRIBUTION = [
  { state: 'Assam', demandSharePct: 54, monthlyVolume: 42000, growthRate: '+14.2%', stockRisk: 'Moderate' },
  { state: 'Meghalaya', demandSharePct: 12, monthlyVolume: 9300, growthRate: '+11.8%', stockRisk: 'High (Shillong RTI)' },
  { state: 'Tripura', demandSharePct: 11, monthlyVolume: 8500, growthRate: '+8.4%', stockRisk: 'Low' },
  { state: 'Nagaland', demandSharePct: 8, monthlyVolume: 6200, growthRate: '+16.5%', stockRisk: 'High (Transit Gap)' },
  { state: 'Manipur', demandSharePct: 7, monthlyVolume: 5400, growthRate: '+9.1%', stockRisk: 'Critical (Highway Delay)' },
  { state: 'Mizoram', demandSharePct: 4, monthlyVolume: 3100, growthRate: '+12.0%', stockRisk: 'Moderate' },
  { state: 'Arunachal Pradesh', demandSharePct: 3, monthlyVolume: 2300, growthRate: '+7.5%', stockRisk: 'Low' },
  { state: 'Sikkim', demandSharePct: 1, monthlyVolume: 800, growthRate: '+5.2%', stockRisk: 'Low' },
];
