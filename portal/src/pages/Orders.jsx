import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Building2,
  Calendar,
  RotateCcw,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Drawer from '../components/common/Drawer';
import Select from '../components/common/Select';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';
import { usePersistentState } from '../hooks/usePersistentState';
import { MOCK_ORDERS } from '../data/mockOrders';
import { MOCK_SKUS } from '../data/mockSkus';
import { mockCustomers } from '../data/mockCustomers';
import { formatCurrency, formatNumber, getStatusBadgeVariant } from '../utils/formatters';
import { dispatchOrder, logActivity, STORAGE_KEYS } from '../services/grdDataService';

export default function Orders() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [orders, setOrders] = usePersistentState(STORAGE_KEYS.ORDERS, MOCK_ORDERS);
  const [skus] = usePersistentState(STORAGE_KEYS.SKUS, MOCK_SKUS);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const hasActiveFilters = searchQuery.trim() !== '' ||
    statusFilter !== 'All' ||
    typeFilter !== 'All' ||
    priorityFilter !== 'All' ||
    stateFilter !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setTypeFilter('All');
    setPriorityFilter('All');
    setStateFilter('All');
  };
  
  // Modals & Drawers
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Order Form State
  const [newCustomerName, setNewCustomerName] = useState(mockCustomers[0]?.name || '');
  const [newPriority, setNewPriority] = useState('Normal');
  const [newWarehouse, setNewWarehouse] = useState('Guwahati Central Depot');
  const [newItems, setNewItems] = useState([
    { skuCode: 'GRD-TAB-001', quantity: 500, unitPrice: 24.8 }
  ]);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Stats calculation
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter(o => o.status === 'Pending Approval').length;
  const dispatchedCount = orders.filter(o => o.status === 'Dispatched').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmountINR || 0), 0);
  const avgFulfillment = (orders.reduce((acc, o) => acc + o.fulfillmentPercentage, 0) / orders.length).toFixed(1);

  // Filtering
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.customerLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesType = typeFilter === 'All' || order.customerType === typeFilter;
    const matchesPriority = priorityFilter === 'All' || 
      (order.priority && order.priority.toLowerCase().includes(priorityFilter.toLowerCase()));
    const matchesState = stateFilter === 'All' ||
      (order.customerLocation && order.customerLocation.toLowerCase().includes(stateFilter.toLowerCase()));
    return matchesSearch && matchesStatus && matchesType && matchesPriority && matchesState;
  });

  const handleAddItemRow = () => {
    setNewItems([
      ...newItems,
      { skuCode: skus[0]?.code || 'GRD-TAB-001', quantity: 100, unitPrice: skus[0]?.tradePrice || 25 }
    ]);
  };

  const handleItemSkuChange = (index, skuCode) => {
    const foundSku = skus.find(s => s.code === skuCode);
    const updated = [...newItems];
    updated[index].skuCode = skuCode;
    if (foundSku) {
      updated[index].unitPrice = foundSku.tradePrice || foundSku.unitPrice || 25;
    }
    setNewItems(updated);
  };

  const handleItemQtyChange = (index, qty) => {
    const updated = [...newItems];
    updated[index].quantity = Number(qty) || 0;
    setNewItems(updated);
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const customerObj = mockCustomers.find(c => c.name === newCustomerName) || {
      name: newCustomerName,
      type: 'Hospital / Institution',
      city: 'Guwahati, Assam'
    };

    const calculatedTotal = newItems.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0);
    const calculatedQty = newItems.reduce((acc, it) => acc + it.quantity, 0);

    const created = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      orderNumber: `GRD-PO-${Math.floor(2000 + Math.random() * 8000)}`,
      orderDate: new Date().toISOString().split('T')[0],
      customerName: customerObj.name,
      customerType: customerObj.type || 'Government Hospital',
      customerLocation: `${customerObj.city || 'Assam'}`,
      distributorName: 'Guwahati Direct Supply Desk',
      totalItems: newItems.length,
      totalQuantity: calculatedQty,
      totalAmountINR: calculatedTotal,
      status: 'Pending Approval',
      priority: newPriority,
      expectedDeliveryDate: '2026-11-22',
      assignedWarehouse: newWarehouse,
      fulfillmentPercentage: 100,
      items: newItems.map(it => {
        const s = MOCK_SKUS.find(sku => sku.code === it.skuCode);
        return {
          skuCode: it.skuCode,
          name: s ? s.name : it.skuCode,
          orderedQty: it.quantity,
          fulfilledQty: it.quantity,
          unitPrice: it.unitPrice
        };
      }),
      notes: 'Indent logged via PharmaPredict Portal.'
    };

    setOrders([created, ...orders]);
    setCreateSuccess(true);
    toast.success(`Purchase Order ${created.orderNumber} placed successfully for ${created.customerName}`);
    setTimeout(() => {
      setCreateSuccess(false);
      setIsCreateModalOpen(false);
      setNewItems([{ skuCode: MOCK_SKUS[0]?.code || '', quantity: 500, unitPrice: MOCK_SKUS[0]?.tradePrice || 25 }]);
    }, 1200);
  };

  const handleStatusChange = (orderId, newStatus) => {
    if (newStatus === 'Dispatched') {
      dispatchOrder({ orderId, user: currentUser });
      toast.success(`Order ${orderId} dispatched! Stock deducted from warehouse depot.`);
    } else {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      logActivity({
        type: 'ORDER',
        action: `Order Status Updated (${orderId})`,
        details: `Order ${orderId} transitioned to ${newStatus} by ${currentUser?.name || 'Operations'}.`,
        user: currentUser
      });
      toast.info(`Order ${orderId} status updated: ${newStatus}`);
    }
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleExportOrders = () => {
    const headers = ['Order Number', 'Date', 'Customer Name', 'Customer Type', 'Location', 'Total Amount (INR)', 'Status', 'Priority', 'Assigned Warehouse'];
    const rows = filteredOrders.map(o => [
      `"${o.orderNumber}"`,
      `"${o.orderDate}"`,
      `"${o.customerName}"`,
      `"${o.customerType}"`,
      `"${o.customerLocation}"`,
      o.totalAmountINR,
      `"${o.status}"`,
      `"${o.priority}"`,
      `"${o.assignedWarehouse}"`
    ].join(','));
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'grd_orders_ledger.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders ledger downloaded (CSV)');
  };

  const columns = [
    {
      header: 'Order Number & Date',
      className: 'whitespace-nowrap min-w-[130px]',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-navy-900 text-xs whitespace-nowrap">{row.orderNumber}</span>
          <div className="text-2xs text-navy-700/60 flex items-center gap-1 mt-0.5 whitespace-nowrap">
            <Calendar className="w-3 h-3 text-slate-400" />
            {row.orderDate}
          </div>
        </div>
      )
    },
    {
      header: 'Customer & Hospital',
      className: 'min-w-[180px]',
      render: (row) => (
        <div>
          <div className="font-semibold text-navy-950 text-xs">{row.customerName}</div>
          <div className="text-2xs text-navy-700/70">{row.customerType} • {row.customerLocation}</div>
        </div>
      )
    },
    {
      header: 'Dispatch Warehouse',
      className: 'whitespace-nowrap',
      render: (row) => (
        <span className="text-xs text-navy-800">{row.assignedWarehouse}</span>
      )
    },
    {
      header: 'Order Amount & Units',
      align: 'right',
      className: 'whitespace-nowrap',
      render: (row) => (
        <div className="text-right">
          <div className="font-semibold text-navy-950 text-xs">{formatCurrency(row.totalAmountINR)}</div>
          <div className="text-2xs text-navy-700/60">{formatNumber(row.totalQuantity)} units ({row.totalItems} SKUs)</div>
        </div>
      )
    },
    {
      header: 'Urgency',
      align: 'center',
      className: 'whitespace-nowrap',
      render: (row) => (
        <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
          row.priority.includes('Urgent') || row.priority.includes('Critical') 
            ? 'bg-rose-50 text-rose-700 border-rose-200' 
            : row.priority.includes('High') 
              ? 'bg-amber-50 text-amber-700 border-amber-200' 
              : 'bg-navy-50 text-navy-800 border-navy-200'
        }`}>
          {row.priority}
        </span>
      )
    },
    {
      header: 'Order Status',
      align: 'center',
      className: 'whitespace-nowrap',
      render: (row) => (
        <div className="space-y-0.5 text-center">
          <Badge variant={getStatusBadgeVariant(row.status)}>
            {row.status}
          </Badge>
          <div className="text-2xs text-navy-700/60">{row.fulfillmentPercentage}% fulfilled</div>
        </div>
      )
    },
    {
      header: 'Actions',
      align: 'center',
      sortable: false,
      className: 'whitespace-nowrap',
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-center whitespace-nowrap">
          <Button 
            variant="outline" 
            size="xs"
            onClick={() => setSelectedOrder(row)}
            icon={Eye}
          >
            View Details
          </Button>
          {row.status === 'Pending Approval' && (
            <button
              onClick={() => handleStatusChange(row.id, 'Approved')}
              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-2xs font-medium"
            >
              Approve
            </button>
          )}
          {row.status === 'Approved' && (
            <button
              onClick={() => handleStatusChange(row.id, 'Dispatched')}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-2xs font-medium"
            >
              Dispatch
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-sans text-navy-950">
              Orders &amp; Dispatch Fulfillment
            </h1>
            <span className="text-xs bg-navy-100 text-navy-800 font-medium px-2 py-0.5 rounded-full">
              SLA: {avgFulfillment}% Fulfilled
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Track hospital purchase orders, approval workflows, and delivery status across Northeast India.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportOrders}
            icon={Download}
          >
            Export Orders (CSV)
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            icon={Plus}
          >
            Create New Order
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard 
          title="Total Orders (MTD)" 
          value={totalOrdersCount}
          subtitle={`Valuation: ${formatCurrency(totalRevenue)}`}
          icon={ShoppingCart}
        />
        <StatCard 
          title="Pending Approval" 
          value={pendingCount}
          subtitle="Awaiting allocation"
          icon={Clock}
          badge={{ text: 'Action Needed', variant: 'warning' }}
        />
        <StatCard 
          title="In Transit / Dispatched" 
          value={dispatchedCount}
          subtitle="En route via NE corridors"
          icon={Truck}
        />
        <StatCard 
          title="Delivered Successfully" 
          value={deliveredCount}
          subtitle="Fulfilled within SLA buffer"
          icon={CheckCircle2}
        />
        <StatCard 
          title="Order Fulfilment Rate" 
          value={`${avgFulfillment}%`}
          subtitle="Target: ≥ 95% SLA"
          icon={Building2}
          trend={{ direction: 'up', text: '+10.8% over baseline' }}
        />
      </div>

      {/* Filter Controls */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={[
                { value: 'All', label: 'All Statuses' },
                { value: 'Pending Approval', label: 'Pending Approval' },
                { value: 'Approved', label: 'Approved' },
                { value: 'Dispatched', label: 'Dispatched' },
                { value: 'Delivered', label: 'Delivered' },
                { value: 'Delayed', label: 'Delayed / Issue' }
              ]}
              icon={Filter}
            />

            <Select
              value={typeFilter}
              onChange={(val) => setTypeFilter(val)}
              options={[
                { value: 'All', label: 'All Customer Segments' },
                { value: 'Government Hospital', label: 'Government Medical Colleges' },
                { value: 'Defense & Railways', label: 'Defense & Indian Railways' },
                { value: 'Distributor', label: 'Primary Distributors' },
                { value: 'Retail Chain', label: 'Pharmacy Chains' }
              ]}
              icon={Building2}
            />

            <Select
              value={priorityFilter}
              onChange={(val) => setPriorityFilter(val)}
              options={[
                { value: 'All', label: 'All Priorities' },
                { value: 'Urgent', label: 'Urgent / Emergency' },
                { value: 'High', label: 'High Priority' },
                { value: 'Normal', label: 'Normal Priority' }
              ]}
              icon={AlertTriangle}
            />

            <Select
              value={stateFilter}
              onChange={(val) => setStateFilter(val)}
              options={[
                { value: 'All', label: 'All Northeast States' },
                { value: 'Assam', label: 'Assam' },
                { value: 'Meghalaya', label: 'Meghalaya' },
                { value: 'Tripura', label: 'Tripura' },
                { value: 'Nagaland', label: 'Nagaland' },
                { value: 'Manipur', label: 'Manipur' },
                { value: 'Mizoram', label: 'Mizoram' },
                { value: 'Arunachal', label: 'Arunachal Pradesh' }
              ]}
              icon={MapPin}
            />

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                title="Reset all active filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="relative w-full lg:w-64">
            <Search className="w-4 h-4 text-navy-700/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search PO #, customer or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 py-1.5 text-xs w-full"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <Table 
        title="Hospital & Pharmacy Orders"
        subtitle="Live purchase orders, indent fulfillment status, and dispatch tracking"
        columns={columns}
        data={filteredOrders}
        keyExtractor={(row) => row.id}
        emptyMessage="No orders found matching your criteria."
      />

      {/* Order Detail Drawer */}
      <Drawer
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details: ${selectedOrder?.orderNumber}`}
        size="md"
      >
        {selectedOrder && (
          <div className="space-y-5 text-sm">
            <div className="p-4 bg-navy-50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-navy-700/70">Customer:</span>
                <span className="font-semibold text-navy-950 text-xs">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-navy-700/70">Segment & Location:</span>
                <span className="text-xs text-navy-800">{selectedOrder.customerType} • {selectedOrder.customerLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-navy-700/70">PO Issue Date:</span>
                <span className="text-xs text-navy-800">{selectedOrder.orderDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-navy-700/70">Expected Delivery:</span>
                <span className="text-xs font-semibold text-terracotta-700">{selectedOrder.expectedDeliveryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-navy-700/70">Dispatch Warehouse:</span>
                <span className="text-xs font-medium text-navy-900">{selectedOrder.assignedWarehouse}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-2">Ordered Line Items</h4>
              <div className="border border-navy-100 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-navy-50 text-navy-700/80 border-b border-navy-100">
                    <tr>
                      <th className="p-2 font-medium">SKU / Item</th>
                      <th className="p-2 font-medium text-right">Qty</th>
                      <th className="p-2 font-medium text-right">Rate</th>
                      <th className="p-2 font-medium text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100">
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-navy-50/50">
                        <td className="p-2">
                          <div className="font-semibold text-navy-950">{item.name}</div>
                          <div className="text-2xs font-sans text-navy-700/60">{item.skuCode}</div>
                        </td>
                        <td className="p-2 text-right font-medium">{formatNumber(item.orderedQty)}</td>
                        <td className="p-2 text-right">₹{item.unitPrice}</td>
                        <td className="p-2 text-right font-semibold text-navy-900">
                          {formatCurrency(item.orderedQty * item.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-navy-50 font-bold text-navy-950">
                    <tr>
                      <td colSpan={3} className="p-2 text-right">Total Order Value:</td>
                      <td className="p-2 text-right text-terracotta-700">{formatCurrency(selectedOrder.totalAmountINR)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {selectedOrder.notes && (
              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-lg text-xs text-amber-900">
                <span className="font-bold block mb-0.5">Special Instructions:</span>
                {selectedOrder.notes}
              </div>
            )}

            <div className="pt-4 border-t border-navy-100 flex items-center gap-2">
              {selectedOrder.status === 'Pending Approval' && (
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => handleStatusChange(selectedOrder.id, 'Approved')}
                >
                  Approve Order & Reserve Inventory
                </Button>
              )}
              {selectedOrder.status === 'Approved' && (
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => handleStatusChange(selectedOrder.id, 'Dispatched')}
                >
                  Mark Order Dispatched
                </Button>
              )}
              {selectedOrder.status === 'Dispatched' && (
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => handleStatusChange(selectedOrder.id, 'Delivered')}
                >
                  Confirm Proof of Delivery (POD)
                </Button>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Create Order Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Medicine Purchase Indent"
        size="lg"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4">
          {createSuccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-semibold text-emerald-900">Purchase Order Created Successfully</h4>
              <p className="text-xs text-emerald-700">Inventory allocation initiated with FEFO priority rules.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-navy-900 mb-1">Select Customer / Institution *</label>
                  <Select
                    value={newCustomerName}
                    onChange={(val) => setNewCustomerName(val)}
                    options={mockCustomers.map(cust => ({
                      value: cust.name,
                      label: `${cust.name} (${cust.city})`
                    }))}
                    className="w-full justify-between"
                    dropdownClassName="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-900 mb-1">Dispatch Depot *</label>
                  <Select
                    value={newWarehouse}
                    onChange={(val) => setNewWarehouse(val)}
                    options={[
                      { value: 'Guwahati Central Depot', label: 'Guwahati Central Depot (Mother Hub)' },
                      { value: 'Rani cGMP Formulation Plant', label: 'Rani cGMP Formulation Plant' },
                      { value: 'Dibrugarh Upper Assam Depot', label: 'Dibrugarh Upper Assam Depot' },
                      { value: 'Silchar Barak Valley Depot', label: 'Silchar Barak Valley Depot' }
                    ]}
                    className="w-full justify-between"
                    dropdownClassName="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-navy-900 mb-1">Order Priority</label>
                <div className="flex gap-2">
                  {['Normal', 'High Priority', 'Urgent (ICU Indent)'].map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setNewPriority(p)}
                      className={`px-3 py-1.5 rounded text-xs font-medium border ${
                        newPriority === p 
                          ? 'bg-navy-900 text-white border-navy-900' 
                          : 'border-navy-200 text-navy-800 hover:bg-navy-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* SKU Selection Items */}
              <div className="border border-navy-100 rounded-lg p-3 space-y-2 bg-navy-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy-900">Line Items & SKUs</span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs text-terracotta-600 hover:text-terracotta-700 font-semibold"
                  >
                    + Add Another SKU
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {newItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded border border-navy-100">
                      <div className="col-span-7">
                        <Select
                          value={item.skuCode}
                          onChange={(val) => handleItemSkuChange(idx, val)}
                          options={skus.map(s => ({
                            value: s.code,
                            label: `${s.brandName ? `${s.brandName} - ` : ''}${s.name} (${s.code}) - ₹${s.tradePrice || s.unitPrice || 25}`
                          }))}
                          className="w-full justify-between"
                          dropdownClassName="w-full"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={item.quantity}
                          min={1}
                          onChange={(e) => handleItemQtyChange(idx, e.target.value)}
                          className="input w-full text-xs"
                        />
                      </div>
                      <div className="col-span-2 text-right text-xs font-semibold text-navy-900">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-navy-200/80 flex justify-between text-xs font-bold text-navy-950">
                  <span>Estimated Total Amount:</span>
                  <span className="text-terracotta-700">
                    {formatCurrency(newItems.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0))}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-navy-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Submit Purchase Order
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
}
