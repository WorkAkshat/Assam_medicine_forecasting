// mockOrders.js - Order Management & Fulfilment Tracking
export const ORDER_STATUSES = ['All Statuses', 'Pending Approval', 'Approved', 'Dispatched', 'Delivered', 'Partially Fulfilled', 'Delayed'];

export const MOCK_ORDERS = [
  {
    id: 'ORD-2026-1084',
    orderNumber: 'GRD-PO-1084',
    orderDate: '2026-11-16',
    customerName: 'Gauhati Medical College & Hospital (GMCH)',
    customerType: 'Government Hospital',
    customerLocation: 'Guwahati, Assam',
    distributorName: 'Pragjyotish Medico & Trade Agencies',
    totalItems: 3,
    totalQuantity: 6500,
    totalAmountINR: 524500,
    status: 'Approved',
    priority: 'Urgent (ICU Indent)',
    expectedDeliveryDate: '2026-11-18',
    assignedWarehouse: 'Guwahati Central Depot',
    fulfillmentPercentage: 100,
    items: [
      { skuCode: 'GRD-HYG-001', name: 'Handuser-C® 500ml', orderedQty: 2500, fulfilledQty: 2500, unitPrice: 175.00 },
      { skuCode: 'GRD-TAB-001', name: 'Paracetamol 650mg Tablets', orderedQty: 3000, fulfilledQty: 3000, unitPrice: 24.80 },
      { skuCode: 'GRD-TAB-003', name: 'ClavoGRD-625 Tablets', orderedQty: 1000, fulfilledQty: 1000, unitPrice: 132.00 }
    ],
    notes: 'Direct hospital ward distribution approved by Chief Medical Superintendent.'
  },
  {
    id: 'ORD-2026-1083',
    orderNumber: 'GRD-PO-1083',
    orderDate: '2026-11-15',
    customerName: 'Indian Army Eastern Command Base Hospital',
    customerType: 'Defense & Railways',
    customerLocation: 'Basistha, Guwahati',
    distributorName: 'Direct Institutional Supply Desk',
    totalItems: 2,
    totalQuantity: 900,
    totalAmountINR: 810000,
    status: 'Dispatched',
    priority: 'High Priority',
    expectedDeliveryDate: '2026-11-17',
    assignedWarehouse: 'Rani cGMP Formulation Plant',
    fulfillmentPercentage: 100,
    items: [
      { skuCode: 'GRD-HYG-002', name: 'Handuser-C® Institutional Can 5 Liters', orderedQty: 600, fulfilledQty: 600, unitPrice: 1350.00 },
      { skuCode: 'GRD-HYG-001', name: 'Handuser-C® Hospital Surgical Handrub 500ml', orderedQty: 300, fulfilledQty: 300, unitPrice: 175.00 }
    ],
    notes: 'Batch COA and dual-testing quality certification attached for army inspection.'
  },
  {
    id: 'ORD-2026-1082',
    orderNumber: 'GRD-PO-1082',
    orderDate: '2026-11-14',
    customerName: 'Silchar Medical College & Hospital (SMCH)',
    customerType: 'Government Hospital',
    customerLocation: 'Silchar, Assam',
    distributorName: 'Barak Valley Healthcare Agency',
    totalItems: 3,
    totalQuantity: 4200,
    totalAmountINR: 312000,
    status: 'Delayed',
    priority: 'Critical (Stockout Alert)',
    expectedDeliveryDate: '2026-11-16',
    assignedWarehouse: 'Silchar C&F Depot (Barak Valley)',
    fulfillmentPercentage: 45,
    items: [
      { skuCode: 'GRD-TAB-001', name: 'Paracetamol 650mg Tablets', orderedQty: 2500, fulfilledQty: 1000, unitPrice: 24.80 },
      { skuCode: 'GRD-HYG-001', name: 'Handuser-C® 500ml', orderedQty: 1200, fulfilledQty: 500, unitPrice: 175.00 },
      { skuCode: 'GRD-SUS-001', name: 'Cefixime Oral Suspension', orderedQty: 500, fulfilledQty: 400, unitPrice: 64.00 }
    ],
    notes: 'Transit delay on Meghalaya-Barak Valley corridor due to highway landslide repairs.'
  },
  {
    id: 'ORD-2026-1081',
    orderNumber: 'GRD-PO-1081',
    orderDate: '2026-11-13',
    customerName: 'Apollo Pharmacy Northeast Hub',
    customerType: 'Retail Chain',
    customerLocation: 'Guwahati Central Hub',
    distributorName: 'Pragjyotish Medico & Trade Agencies',
    totalItems: 4,
    totalQuantity: 8400,
    totalAmountINR: 648000,
    status: 'Delivered',
    priority: 'Normal',
    expectedDeliveryDate: '2026-11-14',
    assignedWarehouse: 'Guwahati Central Depot',
    fulfillmentPercentage: 100,
    items: [
      { skuCode: 'GRD-TAB-001', name: 'DoloGRD-650', orderedQty: 4000, fulfilledQty: 4000, unitPrice: 24.80 },
      { skuCode: 'GRD-CAP-003', name: 'Becogrd-Z', orderedQty: 2000, fulfilledQty: 2000, unitPrice: 48.00 },
      { skuCode: 'GRD-TAB-004', name: 'PantoGRD-40', orderedQty: 1800, fulfilledQty: 1800, unitPrice: 66.50 },
      { skuCode: 'GRD-TAB-005', name: 'CetiGRD-10', orderedQty: 600, fulfilledQty: 600, unitPrice: 28.50 }
    ],
    notes: 'Delivered in full on time. Invoiced via GST e-way bill.'
  },
  {
    id: 'ORD-2026-1080',
    orderNumber: 'GRD-PO-1080',
    orderDate: '2026-11-12',
    customerName: 'Police Bazar Surgi-Pharma',
    customerType: 'Stockist Depot',
    customerLocation: 'Shillong, Meghalaya',
    distributorName: 'Khasi Hills Medical Supplies',
    totalItems: 2,
    totalQuantity: 1800,
    totalAmountINR: 218400,
    status: 'Partially Fulfilled',
    priority: 'Normal',
    expectedDeliveryDate: '2026-11-15',
    assignedWarehouse: 'Shillong Meghalaya C&F Hub',
    fulfillmentPercentage: 70,
    items: [
      { skuCode: 'GRD-SYR-002', name: 'CofGRD Expectorant', orderedQty: 1200, fulfilledQty: 1200, unitPrice: 68.00 },
      { skuCode: 'GRD-TAB-002', name: 'AzithroGRD-500', orderedQty: 600, fulfilledQty: 100, unitPrice: 89.50 }
    ],
    notes: 'Partial stockout on Azithromycin 500mg at Shillong hub. Balance 500 units routed from Guwahati Central Depot.'
  },
  {
    id: 'ORD-2026-1079',
    orderNumber: 'GRD-PO-1079',
    orderDate: '2026-11-16',
    customerName: 'Assam Medical College & Hospital (AMCH)',
    customerType: 'Government Hospital',
    customerLocation: 'Dibrugarh, Assam',
    distributorName: 'Brahmaputra Pharma Distributors',
    totalItems: 3,
    totalQuantity: 3600,
    totalAmountINR: 382400,
    status: 'Pending Approval',
    priority: 'High Priority',
    expectedDeliveryDate: '2026-11-19',
    assignedWarehouse: 'Dibrugarh Regional Depot',
    fulfillmentPercentage: 0,
    items: [
      { skuCode: 'GRD-TAB-003', name: 'ClavoGRD-625', orderedQty: 1500, fulfilledQty: 0, unitPrice: 132.00 },
      { skuCode: 'GRD-SYR-001', name: 'DoloGRD Baby Syrup', orderedQty: 1500, fulfilledQty: 0, unitPrice: 31.50 },
      { skuCode: 'GRD-HYG-002', name: 'Handuser-C® 5L Jar', orderedQty: 600, fulfilledQty: 0, unitPrice: 1350.00 }
    ],
    notes: 'Awaiting commercial credit sign-off from sales director.'
  }
];
