// mockAlerts.js - Real-Time Supply Chain Alerts & Notifications
export const ALERT_TYPES = ['All Alerts', 'Critical Risk', 'Low Stock', 'Near Expiry', 'Transit Delay', 'Demand Surge', 'Approval Needed'];

export const MOCK_ALERTS = [
  {
    id: 'ALT-101',
    type: 'Critical Risk',
    title: 'Severe Stockout Risk at Silchar C&F Depot',
    description: 'Paracetamol 650mg and Handuser-C® 500ml stock will deplete within 24–48 hours. SMCH and local civil hospitals have unfulfilled indents.',
    timestamp: '18 mins ago',
    severity: 'critical',
    skuCode: 'GRD-TAB-001',
    location: 'Silchar C&F Depot (Barak Valley)',
    actionRequired: 'Expedite in-transit shipment AS-01-LC-4492 or dispatch emergency courier buffer.',
    isRead: false
  },
  {
    id: 'ALT-102',
    type: 'Near Expiry',
    title: '850 units Paracetamol Batch Expiring in 27 Days',
    description: 'Batch GRD-P650-B2404 at Agartala Depot reaches expiry on Dec 15, 2026. Current monthly depot turnover is insufficient for full sell-through.',
    timestamp: '1 hour ago',
    severity: 'critical',
    skuCode: 'GRD-TAB-001',
    location: 'Agartala Regional Depot',
    actionRequired: 'Authorize immediate FEFO transfer to Agartala Govt Medical College at 15% discount.',
    isRead: false
  },
  {
    id: 'ALT-103',
    type: 'Transit Delay',
    title: 'NH-6 Highway Delay Affecting 2 Consignments',
    description: 'Landslide clearing at Sonapur tunnel has increased average Guwahati-Silchar transit time from 3.0 days to 5.2 days.',
    timestamp: '2 hours ago',
    severity: 'warning',
    skuCode: 'Multi-SKU',
    location: 'Meghalaya-Barak Valley Corridor',
    actionRequired: 'PharmaPredict engine automatically recalculated safety stock buffers (+2.2 days).',
    isRead: false
  },
  {
    id: 'ALT-104',
    type: 'Demand Surge',
    title: 'Winter Cough Syrup Demand Spike in Shillong & Upper Assam',
    description: 'CofGRD Expectorant weekly pharmacy consumption grew +34.8% due to high altitude temperature drop.',
    timestamp: '4 hours ago',
    severity: 'warning',
    skuCode: 'GRD-SYR-002',
    location: 'Shillong & Dibrugarh',
    actionRequired: 'Replenishment order of 2,400 units queued for approval.',
    isRead: true
  },
  {
    id: 'ALT-105',
    type: 'Approval Needed',
    title: 'Institutional Indent Pending: Army Base Hospital',
    description: 'PO #GRD-PO-1083 for 900 units Handuser-C® requires quality test report verification before dispatch.',
    timestamp: '5 hours ago',
    severity: 'info',
    skuCode: 'GRD-HYG-002',
    location: 'Rani Formulation Plant',
    actionRequired: 'Quality team dual-batch certificate uploaded. Pending sign-off.',
    isRead: true
  },
  {
    id: 'ALT-106',
    type: 'Low Stock',
    title: 'Azithromycin 500mg Low Stock in Shillong C&F',
    description: 'Only 40 units available against safety stock threshold of 500 units.',
    timestamp: '7 hours ago',
    severity: 'warning',
    skuCode: 'GRD-TAB-002',
    location: 'Shillong Meghalaya C&F Hub',
    actionRequired: 'Transfer of 1,200 units approved and queued for dispatch.',
    isRead: true
  }
];
