// grdDataService.js - Centralized Data Management & Cross-Role Business Workflow Engine
import { MOCK_INVENTORY_ITEMS } from '../data/mockInventory.js';
import { MOCK_ORDERS } from '../data/mockOrders.js';
import { DISTRIBUTOR_ORDERS, DISTRIBUTOR_PROFILE } from '../data/mockDistributorPortalData.js';
import { MOCK_REPLENISHMENT_RECOMMENDATIONS } from '../data/mockReplenishment.js';
import { INTER_DEPOT_TRANSFERS, PENDING_REPLENISHMENT_APPROVALS } from '../data/mockSupplyChainData.js';
import { COMMERCIAL_CREDIT_APPROVALS } from '../data/mockSalesDirectorData.js';
import { PLANT_PRODUCTION_BATCHES, PLANT_DOCK_DISPATCHES } from '../data/mockWarehouseData.js';

import { MOCK_SKUS } from '../data/mockSkus.js';

export const SYNC_EVENT = 'grd_local_storage_sync';

export const STORAGE_KEYS = {
  INVENTORY: 'grd_inventory_items',
  DISTRIBUTOR_INVENTORY: 'grd_distributor_inventory',
  ORDERS: 'grd_orders_ledger',
  DISTRIBUTOR_ORDERS: 'grd_distributor_orders',
  REPLENISHMENT: 'grd_replenishment_recommendations',
  SCM_APPROVALS: 'grd_supply_chain_approvals',
  TRANSFERS: 'grd_inter_depot_transfers',
  CREDIT_APPROVALS: 'grd_credit_approvals',
  PLANT_BATCHES: 'grd_warehouse_batches',
  DOCK_DISPATCHES: 'grd_dock_dispatches',
  ALERTS: 'grd_alerts_data',
  ACTIVITY_LOG: 'grd_activity_log',
  SKUS: 'grd_skus_master',
  CUSTOMERS: 'grd_customers_master',
  STOCKISTS: 'grd_stockists_master',
  DISTRIBUTORS: 'grd_distributors_master',
  USERS: 'grd_users_master',
  SETTINGS: 'grd_system_settings',
  LOGISTICS_SHIPMENTS: 'grd_logistics_shipments',
  FIELD_FORCE: 'grd_field_force_roster',
  WAREHOUSE_AUDITS: 'grd_warehouse_audits'
};

export const INITIAL_DISTRIBUTOR_INVENTORY = [
  {
    skuCode: 'GRD-TAB-001',
    skuName: 'Paracetamol 650mg Tablets',
    brandName: 'DoloGRD-650',
    category: 'Tablets',
    packSize: '10 x 15 Tablets (Blister)',
    godownStock: 3500,
    tradePrice: 24.80,
    mrp: 32.50,
    location: 'Pragjyotish Medico Panbazar Godown'
  },
  {
    skuCode: 'GRD-TAB-002',
    skuName: 'Azithromycin 500mg Tablets',
    brandName: 'AzithroGRD-500',
    category: 'Tablets',
    packSize: '3 x 10 Tablets (Alu-Alu)',
    godownStock: 1200,
    tradePrice: 89.50,
    mrp: 118.00,
    location: 'Pragjyotish Medico Panbazar Godown'
  },
  {
    skuCode: 'GRD-HYG-001',
    skuName: 'Handuser-C® Hospital Surgical Handrub 500ml',
    brandName: 'Handuser-C',
    category: 'Suspensions & Hygiene',
    packSize: '500ml Dispenser Bottle',
    godownStock: 800,
    tradePrice: 175.00,
    mrp: 225.00,
    location: 'Pragjyotish Medico Panbazar Godown'
  }
];

// Initial Activity Log Seed
export const INITIAL_ACTIVITY_LOG = [
  {
    id: 'ACT-001',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    timeAgo: '15m ago',
    type: 'TRANSFER',
    action: 'Inter-Depot Stock Transfer Approved',
    details: 'Dr. Abhijit Sarma authorized 2,500 units of Paracetamol 650mg for Silchar C&F Depot.',
    userName: 'Dr. Abhijit Sarma',
    userRole: 'Supply Chain Manager',
    iconColor: 'text-blue-600 bg-blue-50'
  },
  {
    id: 'ACT-002',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    timeAgo: '45m ago',
    type: 'BATCH',
    action: 'cGMP Production Batch Cleared',
    details: 'Batch RANI-2026-B089 (45,000 packs) cleared QA and schedule M compliance sign-off.',
    userName: 'Pranabesh Bora',
    userRole: 'Warehouse Controller',
    iconColor: 'text-emerald-600 bg-emerald-50'
  },
  {
    id: 'ACT-003',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    timeAgo: '2h ago',
    type: 'ORDER',
    action: 'Purchase Order Invoiced & Dispatched',
    details: 'Order GRD-PO-1083 dispatched to Indian Army Eastern Command Base Hospital.',
    userName: 'Rupjyoti Bhattacharya',
    userRole: 'Sales Director',
    iconColor: 'text-amber-600 bg-amber-50'
  },
  {
    id: 'ACT-004',
    timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
    timeAgo: '4h ago',
    type: 'ALERT',
    action: 'Logistics Corridor Delay Alert',
    details: 'NH-6 Meghalaya-Barak Valley corridor transit buffer updated due to Sonapur tunnel repairs.',
    userName: 'Debojit Choudhury',
    userRole: 'Super Admin',
    iconColor: 'text-rose-600 bg-rose-50'
  }
];

// Helper to safely load data with fallback
export function getStoredData(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item);
    }
  } catch (err) {
    console.warn(`[grdDataService] Error reading ${key}:`, err);
  }
  return fallback;
}

// Helper to safely save data and broadcast sync event
export function setStoredData(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key, value } }));
  } catch (err) {
    console.warn(`[grdDataService] Error saving ${key}:`, err);
  }
}

// Global Activity Logger
export function logActivity({ type = 'GENERAL', action, details, user }) {
  const currentLogs = getStoredData(STORAGE_KEYS.ACTIVITY_LOG, INITIAL_ACTIVITY_LOG);
  const newEntry = {
    id: `ACT-${Date.now()}`,
    timestamp: new Date().toISOString(),
    timeAgo: 'Just now',
    type,
    action,
    details,
    userName: user?.name || 'Authorized User',
    userRole: user?.roleName || 'System',
    iconColor: 
      type === 'ORDER' ? 'text-amber-600 bg-amber-50' :
      type === 'BATCH' ? 'text-emerald-600 bg-emerald-50' :
      type === 'TRANSFER' ? 'text-blue-600 bg-blue-50' :
      type === 'CREDIT' ? 'text-purple-600 bg-purple-50' :
      type === 'ALERT' ? 'text-rose-600 bg-rose-50' : 'text-slate-600 bg-slate-50'
  };
  const updatedLogs = [newEntry, ...currentLogs].slice(0, 50);
  setStoredData(STORAGE_KEYS.ACTIVITY_LOG, updatedLogs);
  return newEntry;
}

// -------------------------------------------------------------
// WORKFLOW PIPELINE 1: Distributor Order & Commercial Credit
// -------------------------------------------------------------
export function submitDistributorOrder({ cartEntries, deliveryGodown, orderUrgency, catalog, user }) {
  const distributorOrders = getStoredData(STORAGE_KEYS.DISTRIBUTOR_ORDERS, DISTRIBUTOR_ORDERS);
  const generalOrders = getStoredData(STORAGE_KEYS.ORDERS, MOCK_ORDERS);
  const creditApprovals = getStoredData(STORAGE_KEYS.CREDIT_APPROVALS, COMMERCIAL_CREDIT_APPROVALS);

  // Compute order financials
  let subtotal = 0;
  let totalUnits = 0;
  const lineItems = cartEntries.map(([skuCode, qty]) => {
    const item = catalog.find(i => i.skuCode === skuCode) || {};
    const price = item.tradePrice || 30;
    subtotal += price * qty;
    totalUnits += qty;
    return {
      skuCode,
      name: item.skuName || item.name || skuCode,
      batchNo: item.batchNo || 'B2406',
      quantity: qty,
      orderedQty: qty,
      fulfilledQty: qty,
      rate: price,
      unitPrice: price,
      amount: price * qty
    };
  });

  const gstAmount = subtotal * 0.12;
  const grandTotal = Math.round(subtotal + gstAmount);
  const availableCredit = DISTRIBUTOR_PROFILE.availableCreditINR || 2650000;
  const isCreditExceeded = grandTotal > availableCredit;

  const poNumber = `GRD-PO-GHY-${Math.floor(1086 + Math.random() * 900)}`;
  const orderId = `ORD-GHY-${Date.now().toString().slice(-6)}`;
  const initialStatus = isCreditExceeded ? 'Pending Credit Approval' : 'Approved';

  // 1. Distributor portal record
  const distributorOrderRecord = {
    id: orderId,
    poNumber: poNumber,
    orderDate: new Date().toISOString().split('T')[0],
    orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    distributorId: DISTRIBUTOR_PROFILE.id,
    distributorName: DISTRIBUTOR_PROFILE.name,
    destinationGodown: deliveryGodown,
    supplyingWarehouse: 'Guwahati Central Depot',
    totalItemsCount: cartEntries.length,
    itemsCount: cartEntries.length,
    totalQuantity: totalUnits,
    totalUnits: totalUnits,
    subtotalINR: subtotal,
    gstINR: gstAmount,
    totalAmountINR: grandTotal,
    paymentTerm: '30 Days Net Credit',
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    status: initialStatus,
    statusBadge: isCreditExceeded ? 'Credit Hold' : 'Approved for Picking',
    priority: orderUrgency || 'Normal Restock',
    expectedDelivery: 'Tomorrow, 04:30 PM',
    transporterName: 'Assam Bengal Roadways (Express Fleet)',
    vehicleNumber: 'AS-01-LC-4492',
    driverName: 'Manoj Kalita',
    driverPhone: '+91 98640 55120',
    invoiceNumber: `INV-GRD-2026-${Math.floor(5400 + Math.random() * 500)}`,
    items: lineItems,
    lineItems: lineItems
  };

  // 2. Central Orders ledger record
  const generalOrderRecord = {
    id: orderId,
    orderNumber: poNumber,
    orderDate: distributorOrderRecord.orderDate,
    customerName: DISTRIBUTOR_PROFILE.name,
    customerType: 'Authorized Distributor',
    customerLocation: DISTRIBUTOR_PROFILE.city + ', Assam',
    distributorName: DISTRIBUTOR_PROFILE.name,
    totalItems: cartEntries.length,
    totalQuantity: totalUnits,
    totalAmountINR: grandTotal,
    status: initialStatus === 'Approved' ? 'Approved' : 'Pending Approval',
    priority: isCreditExceeded ? 'Credit Review Required' : (orderUrgency || 'Normal'),
    expectedDeliveryDate: distributorOrderRecord.dueDate,
    assignedWarehouse: 'Guwahati Central Depot',
    fulfillmentPercentage: 100,
    items: lineItems,
    notes: isCreditExceeded ? 'Hold placed: Indent exceeds sanctioned 30-day credit limit.' : 'Auto-cleared via available distributor credit headroom.'
  };

  // 3. If credit exceeded, push to Sales Director's Credit Approvals
  if (isCreditExceeded) {
    const creditApprovalRecord = {
      id: `CR-APV-${Date.now().toString().slice(-4)}`,
      distributorId: DISTRIBUTOR_PROFILE.id,
      distributorName: DISTRIBUTOR_PROFILE.name,
      territory: DISTRIBUTOR_PROFILE.territory,
      contactPerson: DISTRIBUTOR_PROFILE.contactPerson,
      requestedOrderNumber: poNumber,
      orderId: orderId,
      requestedOrderValueINR: grandTotal,
      currentCreditLimitINR: DISTRIBUTOR_PROFILE.creditLimitINR,
      currentOutstandingINR: DISTRIBUTOR_PROFILE.currentOutstandingINR,
      creditHeadroomAfterOrderINR: availableCredit - grandTotal,
      requestedAction: 'Credit Limit Override & Stock Clearance',
      reliabilityScore: '4.8 / 5.0 (Prompt Pay)',
      outstandingDays: 18,
      status: 'Pending Approval',
      requestedTime: 'Just Now',
      notes: `Order of ₹${grandTotal.toLocaleString('en-IN')} exceeds available credit by ₹${Math.abs(availableCredit - grandTotal).toLocaleString('en-IN')}.`
    };
    setStoredData(STORAGE_KEYS.CREDIT_APPROVALS, [creditApprovalRecord, ...creditApprovals]);
  }

  setStoredData(STORAGE_KEYS.DISTRIBUTOR_ORDERS, [distributorOrderRecord, ...distributorOrders]);
  setStoredData(STORAGE_KEYS.ORDERS, [generalOrderRecord, ...generalOrders]);

  logActivity({
    type: 'ORDER',
    action: `Purchase Order Placed (${poNumber})`,
    details: `${DISTRIBUTOR_PROFILE.name} submitted PO for ${totalUnits} units (₹${grandTotal.toLocaleString('en-IN')}). Status: ${initialStatus}.`,
    user
  });

  return { distributorOrderRecord, generalOrderRecord, isCreditExceeded };
}

export function processCreditApproval({ approvalId, decision, directorNotes, user }) {
  const approvals = getStoredData(STORAGE_KEYS.CREDIT_APPROVALS, COMMERCIAL_CREDIT_APPROVALS);
  const distOrders = getStoredData(STORAGE_KEYS.DISTRIBUTOR_ORDERS, DISTRIBUTOR_ORDERS);
  const genOrders = getStoredData(STORAGE_KEYS.ORDERS, MOCK_ORDERS);

  const targetApproval = approvals.find(a => a.id === approvalId);
  if (!targetApproval) return false;

  const isApproved = decision === 'approve' || decision === 'adjust';
  const newStatusText = isApproved ? 'Approved & Released' : 'Held for Payment';
  const orderStatus = isApproved ? 'Approved' : 'Held for Payment';

  // Update credit approvals table
  const updatedApprovals = approvals.map(a => a.id === approvalId ? {
    ...a,
    status: newStatusText,
    directorNotes: directorNotes || (isApproved ? 'Approved by Sales Director Rupjyoti Bhattacharya' : 'Held for payment clearance')
  } : a);
  setStoredData(STORAGE_KEYS.CREDIT_APPROVALS, updatedApprovals);

  // Sync to distributor orders
  const updatedDistOrders = distOrders.map(o => (o.poNumber === targetApproval.requestedOrderNumber || o.id === targetApproval.orderId) ? {
    ...o,
    status: orderStatus,
    statusBadge: isApproved ? 'Approved for Picking' : 'Payment Required'
  } : o);
  setStoredData(STORAGE_KEYS.DISTRIBUTOR_ORDERS, updatedDistOrders);

  // Sync to general orders
  const updatedGenOrders = genOrders.map(o => (o.orderNumber === targetApproval.requestedOrderNumber || o.id === targetApproval.orderId) ? {
    ...o,
    status: orderStatus,
    notes: isApproved ? `Credit override sanctioned by ${user?.name || 'Sales Director'}.` : 'Held: Waiting for overdue remittance.'
  } : o);
  setStoredData(STORAGE_KEYS.ORDERS, updatedGenOrders);

  logActivity({
    type: 'CREDIT',
    action: `Credit Request ${isApproved ? 'Approved' : 'Held'}`,
    details: `${user?.name || 'Sales Director'} ${isApproved ? 'cleared credit for' : 'placed hold on'} PO ${targetApproval.requestedOrderNumber} (₹${targetApproval.requestedOrderValueINR?.toLocaleString('en-IN')}).`,
    user
  });

  return true;
}

// -------------------------------------------------------------
// WORKFLOW PIPELINE 2: Order Dispatch & Inventory Deduction
// -------------------------------------------------------------
export function dispatchOrder({ orderId, vehicleNo, transporter, user }) {
  const genOrders = getStoredData(STORAGE_KEYS.ORDERS, MOCK_ORDERS);
  const distOrders = getStoredData(STORAGE_KEYS.DISTRIBUTOR_ORDERS, DISTRIBUTOR_ORDERS);
  const inventory = getStoredData(STORAGE_KEYS.INVENTORY, MOCK_INVENTORY_ITEMS);
  const dockDispatches = getStoredData(STORAGE_KEYS.DOCK_DISPATCHES, PLANT_DOCK_DISPATCHES);

  const targetOrder = genOrders.find(o => o.id === orderId || o.orderNumber === orderId);
  if (!targetOrder) return false;

  // Double-Dispatch Guard: Prevent repeated clicks or duplicate stock deductions
  if (targetOrder.status === 'Dispatched' || targetOrder.status === 'Delivered') {
    console.warn(`[dispatchOrder] Duplicate dispatch blocked: Order ${targetOrder.orderNumber} is already ${targetOrder.status}.`);
    return false;
  }

  // 1. Deduct stock from warehouse
  let updatedInventory = [...inventory];
  if (targetOrder.items && targetOrder.items.length > 0) {
    targetOrder.items.forEach(item => {
      const idx = updatedInventory.findIndex(inv => 
        (inv.skuCode === item.skuCode || inv.skuId === item.skuCode) && 
        (inv.locationName?.includes('Guwahati') || inv.locationName === targetOrder.assignedWarehouse)
      );
      if (idx !== -1) {
        const currentOnHand = updatedInventory[idx].onHand;
        const currentAvailable = updatedInventory[idx].available;
        const deductQty = item.orderedQty || item.quantity || 0;
        updatedInventory[idx] = {
          ...updatedInventory[idx],
          onHand: Math.max(0, currentOnHand - deductQty),
          available: Math.max(0, currentAvailable - deductQty)
        };
      }
    });
    setStoredData(STORAGE_KEYS.INVENTORY, updatedInventory);
  }

  // 2. Update orders
  const updatedGenOrders = genOrders.map(o => (o.id === orderId || o.orderNumber === orderId) ? {
    ...o,
    status: 'Dispatched',
    dispatchedAt: new Date().toISOString()
  } : o);
  setStoredData(STORAGE_KEYS.ORDERS, updatedGenOrders);

  const updatedDistOrders = distOrders.map(o => (o.id === orderId || o.poNumber === targetOrder.orderNumber) ? {
    ...o,
    status: 'In Transit',
    statusBadge: 'On Delivery Truck',
    vehicleNumber: vehicleNo || o.vehicleNumber || 'AS-01-LC-4492',
    transporterName: transporter || o.transporterName || 'Assam Bengal Roadways'
  } : o);
  setStoredData(STORAGE_KEYS.DISTRIBUTOR_ORDERS, updatedDistOrders);

  // 3. Add to dock dispatches
  const gatePassRecord = {
    gatePassId: `GP-GHY-${Date.now().toString().slice(-4)}`,
    dockId: 'Dispatch Bay 02',
    destination: targetOrder.customerLocation || 'Guwahati Trade Godown',
    distanceKm: 25,
    transporter: transporter || 'Assam Bengal Roadways',
    vehicleNo: vehicleNo || 'AS-01-LC-4492',
    driverName: 'Manoj Kalita',
    driverPhone: '+91 98640 55120',
    consignment: targetOrder.orderNumber,
    totalCartons: Math.ceil(targetOrder.totalQuantity / 50),
    totalPacks: targetOrder.totalQuantity,
    loadingStatus: 'Loaded & Sealed (100%)',
    gateStatus: 'Gate Pass Signed & Cleared',
    departureTime: 'Just Now',
    eta: 'Today 04:30 PM'
  };
  setStoredData(STORAGE_KEYS.DOCK_DISPATCHES, [gatePassRecord, ...dockDispatches]);

  logActivity({
    type: 'ORDER',
    action: `Order Dispatched (${targetOrder.orderNumber})`,
    details: `Dispatched ${targetOrder.totalQuantity} units for ${targetOrder.customerName} via truck ${vehicleNo || 'AS-01-LC-4492'}. Stock deducted from Guwahati Depot.`,
    user
  });

  return true;
}

// -------------------------------------------------------------
// WORKFLOW PIPELINE 3: cGMP Plant Batch & Mother Hub Inward
// -------------------------------------------------------------
export function createPlantBatch({ 
  batchNo: customBatchNo, 
  skuCode, 
  medicine, 
  formulation, 
  quantityPacks, 
  storageZone, 
  dockId, 
  qcStatus, 
  inspector, 
  mfgDate: customMfg, 
  expiryDate: customExp, 
  user 
}) {
  const batches = getStoredData(STORAGE_KEYS.PLANT_BATCHES, PLANT_PRODUCTION_BATCHES);
  const batchNo = customBatchNo || `RANI-2026-B${Math.floor(95 + Math.random() * 20)}`;
  const mfgDate = customMfg || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const expiryDate = customExp || new Date(Date.now() + 2 * 365 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const newBatch = {
    batchNo,
    skuCode,
    medicine,
    formulation: formulation || 'Tablets (Strip of 10)',
    quantityPacks: Number(quantityPacks),
    availableUnits: Number(quantityPacks),
    dispatchedUnits: 0,
    mfgDate,
    expiryDate,
    aisleLocation: 'Aisle A-01 / Pallet 05',
    storageZone: storageZone || 'Ambient Finished Goods (15-25°C)',
    qcStatus: qcStatus || 'Passed cGMP QA',
    qaOfficer: inspector || user?.name || 'Pranabesh Bora',
    barcode: `890123450${Math.floor(1000 + Math.random() * 9000)}`,
    dispatchStatus: 'Ready for Staging',
    inwardStatus: 'Staging at Dock',
    inspector: inspector || user?.name || 'Dr. Nilakshi Das (QA Lead)',
    dockId: dockId || 'Dock Bay 01'
  };

  setStoredData(STORAGE_KEYS.PLANT_BATCHES, [newBatch, ...batches]);

  logActivity({
    type: 'BATCH',
    action: `New cGMP Batch Formulated (${batchNo})`,
    details: `${Number(quantityPacks).toLocaleString('en-IN')} packs of ${medicine} (${skuCode}) formulated and verified at Rani Plant.`,
    user
  });

  return newBatch;
}

export function releaseBatchQA({ batchNo, user }) {
  const batches = getStoredData(STORAGE_KEYS.PLANT_BATCHES, PLANT_PRODUCTION_BATCHES);
  const updated = batches.map(b => b.batchNo === batchNo ? {
    ...b,
    qcStatus: 'Passed cGMP QA',
    qaOfficer: user?.name || 'Pranabesh Bora',
    dispatchStatus: 'Ready for Staging'
  } : b);
  setStoredData(STORAGE_KEYS.PLANT_BATCHES, updated);

  logActivity({
    type: 'BATCH',
    action: `Batch QA Cleared (${batchNo})`,
    details: `Batch ${batchNo} cleared Schedule M microbiology tests and released from quarantine.`,
    user
  });
  return true;
}

export function inwardBatchToGuwahati({ batchNo, user }) {
  const batches = getStoredData(STORAGE_KEYS.PLANT_BATCHES, PLANT_PRODUCTION_BATCHES);
  const inventory = getStoredData(STORAGE_KEYS.INVENTORY, MOCK_INVENTORY_ITEMS);

  const batch = batches.find(b => b.batchNo === batchNo);
  if (!batch) return false;

  // 1. Update batch inward status
  const updatedBatches = batches.map(b => b.batchNo === batchNo ? {
    ...b,
    inwardStatus: 'Inwarded to Guwahati Depot',
    dispatchStatus: 'Transferred to Mother Hub'
  } : b);
  setStoredData(STORAGE_KEYS.PLANT_BATCHES, updatedBatches);

  // 2. Add units to Guwahati Central Depot in inventory ledger
  let skuUpdated = false;
  let updatedInventory = inventory.map(item => {
    if ((item.skuCode === batch.skuCode || item.skuId === batch.skuCode) && item.locationName?.includes('Guwahati')) {
      skuUpdated = true;
      return {
        ...item,
        onHand: item.onHand + batch.quantityPacks,
        available: item.available + batch.quantityPacks,
        status: 'Optimal'
      };
    }
    return item;
  });

  if (!skuUpdated) {
    const newInvItem = {
      id: `INV-${Date.now()}`,
      skuId: batch.skuCode,
      skuCode: batch.skuCode,
      skuName: batch.medicine,
      category: batch.formulation?.split(' ')[0] || 'Tablets',
      locationId: 'LOC-GHY-01',
      locationName: 'Guwahati Central Depot',
      state: 'Assam',
      onHand: batch.quantityPacks,
      reserved: 0,
      inTransit: 0,
      available: batch.quantityPacks,
      minStock: 1000,
      maxStock: 10000,
      reorderLevel: 2500,
      status: 'Optimal',
      daysOfInventory: 30,
      batchNumber: batch.batchNo,
      expiryDate: batch.expiryDate,
      mfgDate: batch.mfgDate
    };
    updatedInventory = [newInvItem, ...updatedInventory];
  }

  setStoredData(STORAGE_KEYS.INVENTORY, updatedInventory);

  logActivity({
    type: 'TRANSFER',
    action: `Factory Inward Received (${batchNo})`,
    details: `Inwarded ${batch.quantityPacks.toLocaleString('en-IN')} units of ${batch.medicine} from Rani Plant into Guwahati Central Depot stock.`,
    user
  });

  return true;
}

// -------------------------------------------------------------
// WORKFLOW PIPELINE 4: Smart Replenishment & Stock Transfers
// -------------------------------------------------------------
export function approveReplenishmentRecommendation({ recommendationId, user }) {
  const recommendations = getStoredData(STORAGE_KEYS.REPLENISHMENT, MOCK_REPLENISHMENT_RECOMMENDATIONS);
  const scmApprovals = getStoredData(STORAGE_KEYS.SCM_APPROVALS, PENDING_REPLENISHMENT_APPROVALS);
  const transfers = getStoredData(STORAGE_KEYS.TRANSFERS, INTER_DEPOT_TRANSFERS);
  const inventory = getStoredData(STORAGE_KEYS.INVENTORY, MOCK_INVENTORY_ITEMS);

  const rec = recommendations.find(r => r.id === recommendationId) || scmApprovals.find(a => a.id === recommendationId);
  if (!rec) return false;

  const skuCode = rec.skuCode;
  const qty = rec.recommendedReplenishQty || rec.recommendedQty || 2000;
  const destFacility = rec.destinationFacility || rec.destinationHub || 'Regional Depot';
  const sourceFacility = rec.sourceFacility || rec.sourceHub || 'Guwahati Central Depot';

  // 1. Update recommendations table
  const updatedRecs = recommendations.map(r => r.id === recommendationId ? {
    ...r,
    workflowStatus: 'Approved',
    approvalHistory: [
      ...(r.approvalHistory || []),
      { date: new Date().toISOString().replace('T', ' ').slice(0, 16), action: 'Approved for Dispatch', user: user?.name || 'Supply Chain Manager' }
    ]
  } : r);
  setStoredData(STORAGE_KEYS.REPLENISHMENT, updatedRecs);

  // 2. Update SCM pending approvals
  const updatedScm = scmApprovals.map(a => a.id === recommendationId ? {
    ...a,
    status: 'Approved for Dispatch',
    approvedAt: 'Just Now'
  } : a);
  setStoredData(STORAGE_KEYS.SCM_APPROVALS, updatedScm);

  // 3. Create active inter-depot transfer
  const newTransfer = {
    transferId: `TRF-2026-${Math.floor(45 + Math.random() * 50)}`,
    sourceDepot: sourceFacility,
    destinationDepot: destFacility,
    skuCode: skuCode,
    medicine: rec.skuName || rec.medicineName || skuCode,
    quantityUnits: qty,
    reason: rec.rationale || rec.urgencyReason || 'Demand buffering & stockout prevention',
    transporter: 'Brahmaputra Fast Freight',
    vehicleNo: 'AS-01-GC-4482',
    status: 'In Transit',
    departureTime: 'Today 03:00 PM',
    estimatedArrival: 'Tomorrow 08:00 AM'
  };
  setStoredData(STORAGE_KEYS.TRANSFERS, [newTransfer, ...transfers]);

  // 4. Reserve stock at source, add inTransit at destination
  const updatedInventory = inventory.map(item => {
    if (item.skuCode === skuCode) {
      if (item.locationName === sourceFacility || item.locationName?.includes('Guwahati')) {
        return {
          ...item,
          reserved: item.reserved + qty,
          available: Math.max(0, item.available - qty)
        };
      }
      if (item.locationName === destFacility || item.locationName?.includes(destFacility.split(' ')[0])) {
        return {
          ...item,
          inTransit: item.inTransit + qty
        };
      }
    }
    return item;
  });
  setStoredData(STORAGE_KEYS.INVENTORY, updatedInventory);

  logActivity({
    type: 'TRANSFER',
    action: `Replenishment Approved (${recommendationId})`,
    details: `${user?.name || 'Dr. Abhijit Sarma'} authorized dispatch of ${qty.toLocaleString('en-IN')} units of ${skuCode} to ${destFacility}.`,
    user
  });

  return newTransfer;
}

export function completeInterDepotTransfer({ transferId, user }) {
  const transfers = getStoredData(STORAGE_KEYS.TRANSFERS, INTER_DEPOT_TRANSFERS);
  const inventory = getStoredData(STORAGE_KEYS.INVENTORY, MOCK_INVENTORY_ITEMS);

  const transfer = transfers.find(t => t.transferId === transferId);
  if (!transfer) return false;

  // 1. Update transfer status
  const updatedTransfers = transfers.map(t => t.transferId === transferId ? {
    ...t,
    status: 'Delivered & Inwarded',
    completedAt: 'Just Now'
  } : t);
  setStoredData(STORAGE_KEYS.TRANSFERS, updatedTransfers);

  // 2. Clear reserved at source, clear inTransit and increment onHand at destination
  const updatedInventory = inventory.map(item => {
    if (item.skuCode === transfer.skuCode) {
      if (item.locationName === transfer.sourceDepot || item.locationName?.includes(transfer.sourceDepot.split(' ')[0])) {
        return {
          ...item,
          onHand: Math.max(0, item.onHand - transfer.quantityUnits),
          reserved: Math.max(0, item.reserved - transfer.quantityUnits)
        };
      }
      if (item.locationName === transfer.destinationDepot || item.locationName?.includes(transfer.destinationDepot.split(' ')[0])) {
        const newOnHand = item.onHand + transfer.quantityUnits;
        const newAvailable = item.available + transfer.quantityUnits;
        return {
          ...item,
          onHand: newOnHand,
          available: newAvailable,
          inTransit: Math.max(0, item.inTransit - transfer.quantityUnits),
          status: 'Optimal'
        };
      }
    }
    return item;
  });
  setStoredData(STORAGE_KEYS.INVENTORY, updatedInventory);

  logActivity({
    type: 'TRANSFER',
    action: `Transfer Delivered (${transferId})`,
    details: `Transfer of ${transfer.quantityUnits.toLocaleString('en-IN')} units of ${transfer.medicine} arrived safely at ${transfer.destinationDepot}. Stock replenished.`,
    user
  });

  return true;
}

// -------------------------------------------------------------
// WORKFLOW PIPELINE 5: Distributor Delivery Receipt & Retail Sales
// -------------------------------------------------------------
export function confirmDistributorDelivery({ orderId, user }) {
  const distOrders = getStoredData(STORAGE_KEYS.DISTRIBUTOR_ORDERS, DISTRIBUTOR_ORDERS);
  const genOrders = getStoredData(STORAGE_KEYS.ORDERS, MOCK_ORDERS);

  const targetOrder = distOrders.find(o => o.id === orderId || o.poNumber === orderId);
  if (!targetOrder) return false;

  // Double-delivery prevention guard
  if (targetOrder.status === 'Delivered') {
    console.warn(`[confirmDistributorDelivery] Duplicate receipt blocked: PO ${targetOrder.poNumber} is already marked Delivered.`);
    return false;
  }

  const deliveredDate = new Date().toISOString().split('T')[0];
  const deliveredTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Update distributor orders
  const updatedDistOrders = distOrders.map(o => (o.id === orderId || o.poNumber === targetOrder.poNumber) ? {
    ...o,
    status: 'Delivered',
    statusBadge: 'Received & Verified at Godown',
    deliveredDate,
    deliveredTime,
    verifiedBy: user?.name || 'Bipul Goswami'
  } : o);
  setStoredData(STORAGE_KEYS.DISTRIBUTOR_ORDERS, updatedDistOrders);

  // 2. Update central orders ledger
  const updatedGenOrders = genOrders.map(o => (o.id === orderId || o.orderNumber === targetOrder.poNumber) ? {
    ...o,
    status: 'Delivered',
    deliveryDate: deliveredDate,
    notes: `Consignment delivered & verified by ${user?.name || 'Authorized Distributor'}.`
  } : o);
  setStoredData(STORAGE_KEYS.ORDERS, updatedGenOrders);

  // 3. Increment distributor godown inventory
  const distInventory = getStoredData(STORAGE_KEYS.DISTRIBUTOR_INVENTORY, INITIAL_DISTRIBUTOR_INVENTORY);
  let updatedDistInv = [...distInventory];
  if (targetOrder.items && targetOrder.items.length > 0) {
    targetOrder.items.forEach(item => {
      const idx = updatedDistInv.findIndex(inv => inv.skuCode === item.skuCode);
      const qty = item.orderedQty || item.quantity || 0;
      if (idx !== -1) {
        updatedDistInv[idx] = {
          ...updatedDistInv[idx],
          godownStock: (updatedDistInv[idx].godownStock || 0) + qty
        };
      } else {
        updatedDistInv.push({
          skuCode: item.skuCode,
          skuName: item.name || item.skuCode,
          brandName: item.brandName || item.name || item.skuCode,
          category: item.category || 'Tablets',
          packSize: item.packSize || 'Standard Pack',
          godownStock: qty,
          tradePrice: item.unitPrice || item.rate || 45,
          mrp: Math.round((item.unitPrice || 45) * 1.3),
          location: 'Pragjyotish Medico Panbazar Godown'
        });
      }
    });
    setStoredData(STORAGE_KEYS.DISTRIBUTOR_INVENTORY, updatedDistInv);
  }

  logActivity({
    type: 'ORDER',
    action: `Consignment Received (${targetOrder.poNumber})`,
    details: `${user?.name || 'Distributor Partner'} received & verified delivery of ${targetOrder.totalQuantity} units at Panbazar Godown. Stock added to distributor inventory.`,
    user
  });

  return true;
}

export function billRetailSaleToStockist({ stockistName, skuCode, skuName, quantity, tradePrice, user }) {
  const distInventory = getStoredData(STORAGE_KEYS.DISTRIBUTOR_INVENTORY, INITIAL_DISTRIBUTOR_INVENTORY);
  const targetStock = distInventory.find(i => i.skuCode === skuCode);

  const availableGodown = targetStock ? (targetStock.godownStock || 0) : 0;
  if (availableGodown < quantity) {
    throw new Error(`Insufficient godown stock for ${skuName || skuCode}. Available: ${availableGodown} packs, requested: ${quantity} packs.`);
  }

  // Deduct quantity from distributor godown inventory
  const updatedDistInv = distInventory.map(item => item.skuCode === skuCode ? {
    ...item,
    godownStock: Math.max(0, (item.godownStock || 0) - quantity)
  } : item);
  setStoredData(STORAGE_KEYS.DISTRIBUTOR_INVENTORY, updatedDistInv);

  const invoiceNumber = `RET-INV-${Math.floor(2000 + Math.random() * 8000)}`;
  const totalAmount = quantity * tradePrice;

  logActivity({
    type: 'ORDER',
    action: `Retail Sale Billed (${invoiceNumber})`,
    details: `Billed ${quantity} units of ${skuName || skuCode} to ${stockistName} (₹${totalAmount.toLocaleString('en-IN')}). Godown stock deducted by ${quantity} packs (Remaining: ${availableGodown - quantity}).`,
    user
  });

  return { invoiceNumber, totalAmount, remainingStock: availableGodown - quantity };
}

// -------------------------------------------------------------
// WORKFLOW PIPELINE 6: Master SKU Management (Step 1-6 Engine)
// -------------------------------------------------------------
export function registerMasterSku({ skuData, user }) {
  const skus = getStoredData(STORAGE_KEYS.SKUS, MOCK_SKUS);
  const inventory = getStoredData(STORAGE_KEYS.INVENTORY, MOCK_INVENTORY_ITEMS);

  // Check duplicate
  const exists = skus.find(s => s.code.toLowerCase() === skuData.code.trim().toLowerCase());
  if (exists) {
    throw new Error(`SKU Code "${skuData.code}" already exists in Master Formulary!`);
  }

  const newSku = {
    ...skuData,
    id: `SKU-${Date.now()}`,
    code: skuData.code.trim(),
    name: skuData.name.trim(),
    brandName: skuData.brandName.trim(),
    tradePrice: Number(skuData.tradePrice) || 50,
    mrp: Number(skuData.mrp) || 65,
    costPrice: Number(skuData.costPrice) || 35,
    minStock: Number(skuData.minStock) || 1000,
    maxStock: Number(skuData.maxStock) || 8000,
    reorderLevel: Number(skuData.reorderLevel) || 2000,
    shelfLifeMonths: Number(skuData.shelfLifeMonths) || 24,
    fastMoving: skuData.fastMoving ?? true,
    activeStatus: 'Active',
    createdAt: new Date().toISOString()
  };

  const updatedSkus = [newSku, ...skus];
  setStoredData(STORAGE_KEYS.SKUS, updatedSkus);

  // Auto-provision initial inventory row in Guwahati Mother Hub
  const invExists = inventory.find(i => i.skuCode === newSku.code && i.locationName?.includes('Guwahati'));
  if (!invExists) {
    const newInvItem = {
      id: `INV-${Date.now()}`,
      skuId: newSku.id,
      skuCode: newSku.code,
      skuName: newSku.name || newSku.brandName || newSku.code,
      category: newSku.category || 'Tablets',
      locationId: 'LOC-GHY-01',
      location: 'Guwahati Central Depot',
      locationName: 'Guwahati Central Depot',
      state: 'Assam',
      onHand: 0,
      reserved: 0,
      inTransit: Number(newSku.minStock) || 1000,
      available: 0,
      minStock: Number(newSku.minStock) || 1000,
      maxStock: Number(newSku.maxStock) || 8000,
      reorderLevel: Number(newSku.reorderLevel) || 2000,
      status: 'Optimal',
      daysCover: 24,
      daysOfInventory: 24,
      batchNumber: `GRD-${newSku.code.replace(/[^A-Za-z0-9]/g, '').substring(0, 4).toUpperCase()}-B2401`,
      expiryDate: '2028-11-30',
      mfgDate: new Date().toISOString().split('T')[0],
      unitsPerBox: 100
    };
    setStoredData(STORAGE_KEYS.INVENTORY, [newInvItem, ...inventory]);
  }

  logActivity({
    type: 'GENERAL',
    action: `New Formulation Registered (${newSku.code})`,
    details: `${newSku.brandName} (${newSku.name}) registered in Master Formulary by ${user?.name || 'Super Admin'}.`,
    user
  });

  return newSku;
}

export function updateMasterSku({ skuId, skuData, user }) {
  const skus = getStoredData(STORAGE_KEYS.SKUS, MOCK_SKUS);
  const inventory = getStoredData(STORAGE_KEYS.INVENTORY, MOCK_INVENTORY_ITEMS);

  const updatedSkus = skus.map(s => (s.id === skuId || s.code === skuData.code) ? {
    ...s,
    ...skuData,
    tradePrice: Number(skuData.tradePrice) || s.tradePrice,
    mrp: Number(skuData.mrp) || s.mrp,
    costPrice: Number(skuData.costPrice) || s.costPrice,
    minStock: Number(skuData.minStock) || s.minStock,
    maxStock: Number(skuData.maxStock) || s.maxStock,
    reorderLevel: Number(skuData.reorderLevel) || s.reorderLevel,
    shelfLifeMonths: Number(skuData.shelfLifeMonths) || s.shelfLifeMonths,
    updatedAt: new Date().toISOString()
  } : s);
  setStoredData(STORAGE_KEYS.SKUS, updatedSkus);

  // Sync updated name & category in inventory
  const updatedInventory = inventory.map(item => {
    if (item.skuId === skuId || item.skuCode === skuData.code) {
      return {
        ...item,
        skuName: skuData.name || skuData.brandName || item.skuName,
        category: skuData.category || item.category,
        minStock: Number(skuData.minStock) || item.minStock,
        maxStock: Number(skuData.maxStock) || item.maxStock,
        reorderLevel: Number(skuData.reorderLevel) || item.reorderLevel
      };
    }
    return item;
  });
  setStoredData(STORAGE_KEYS.INVENTORY, updatedInventory);

  logActivity({
    type: 'GENERAL',
    action: `Formulation Updated (${skuData.code})`,
    details: `Formulation ${skuData.brandName || skuData.code} specifications updated by ${user?.name || 'Authorized User'}.`,
    user
  });

  return true;
}

export function deleteMasterSku({ skuId, skuCode, user }) {
  const skus = getStoredData(STORAGE_KEYS.SKUS, MOCK_SKUS);
  const batches = getStoredData(STORAGE_KEYS.PLANT_BATCHES, PLANT_PRODUCTION_BATCHES);
  const orders = getStoredData(STORAGE_KEYS.ORDERS, MOCK_ORDERS);

  const target = skus.find(s => s.id === skuId || s.code === skuCode);
  const code = target?.code || skuCode;

  // Regulatory Integrity Check: check if medicine has open production batches or active orders
  const hasBatches = batches.some(b => b.skuCode === code);
  const hasOrders = orders.some(o => o.items?.some(it => it.skuCode === code));

  if (hasBatches || hasOrders) {
    // Instead of destructive hard-delete which breaks historical relationships, mark as Archived/Discontinued
    const updatedSkus = skus.map(s => (s.id === skuId || s.code === code) ? {
      ...s,
      activeStatus: 'Archived / Discontinued',
      isArchived: true,
      archivedAt: new Date().toISOString()
    } : s);
    setStoredData(STORAGE_KEYS.SKUS, updatedSkus);

    logActivity({
      type: 'GENERAL',
      action: `Formulation Archived (${code})`,
      details: `Medicine ${target?.brandName || code} archived (protected from hard-delete due to existing manufacturing lots or purchase orders).`,
      user
    });

    return { archived: true, hardDeleted: false };
  }

  // Safe hard delete if no dependencies exist
  const updatedSkus = skus.filter(s => s.id !== skuId && s.code !== skuCode);
  setStoredData(STORAGE_KEYS.SKUS, updatedSkus);

  logActivity({
    type: 'GENERAL',
    action: `Formulation Deleted (${code})`,
    details: `Medicine ${target?.brandName || code} permanently deleted from Master Formulary.`,
    user
  });

  return { archived: false, hardDeleted: true };
}
