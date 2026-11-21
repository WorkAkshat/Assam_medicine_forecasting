import React, { useState } from 'react';
import {
  Boxes,
  Truck,
  Clock,
  CheckCircle2,
  FileText,
  Search,
  Filter,
  Printer,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { DISTRIBUTOR_PROFILE, DISTRIBUTOR_ORDERS } from '../../data/mockDistributorPortalData';
import { formatNumber, formatCurrency } from '../../utils/formatters';
import { confirmDistributorDelivery, STORAGE_KEYS } from '../../services/grdDataService';

export default function DistributorOrders() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = usePersistentState(STORAGE_KEYS.DISTRIBUTOR_ORDERS, DISTRIBUTOR_ORDERS);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const handleConfirmDelivery = (order) => {
    const success = confirmDistributorDelivery({
      orderId: order.id,
      user: currentUser
    });
    if (success) {
      toast.success(`PO ${order.poNumber} marked as Delivered! Stock verified and inwarded at Godown.`);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchStatus = selectedStatus === 'All' || order.status === selectedStatus;
    const matchSearch = !searchQuery ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.invoiceNumber && order.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.vehicleNumber && order.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const inTransitCount = orders.filter(o => o.status === 'In Transit').length;
  const approvedCount = orders.filter(o => o.status === 'Approved').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const totalValue = orders.reduce((acc, curr) => acc + curr.totalAmountINR, 0);

  const handleOpenInvoice = (order) => {
    setActiveInvoice(order);
    setIsInvoiceOpen(true);
  };

  const orderColumns = [
    {
      header: 'Order & PO Reference',
      accessor: 'id',
      className: 'whitespace-nowrap min-w-[140px]',
      render: (row) => (
        <div>
          <span className="font-bold text-navy-950 text-xs sm:text-sm font-mono whitespace-nowrap">{row.id}</span>
          <div className="text-2xs text-slate-500 font-mono mt-0.5 whitespace-nowrap">{row.poNumber}</div>
          <span className="text-2xs text-terracotta-700 font-semibold whitespace-nowrap">{row.orderDate} · {row.orderTime}</span>
        </div>
      )
    },
    {
      header: 'Destination Godown',
      accessor: 'destinationGodown',
      render: (row) => (
        <div className="min-w-[180px] max-w-[280px]">
          <p className="text-xs font-semibold text-navy-900" title={row.destinationGodown}>{row.destinationGodown}</p>
          <p className="text-2xs text-slate-400 mt-0.5">From: {row.supplyingWarehouse}</p>
        </div>
      )
    },
    {
      header: 'Items & Quantity',
      accessor: 'totalQuantity',
      sortValue: (row) => row.totalQuantity,
      render: (row) => (
        <div className="text-right sm:text-left">
          <div className="font-bold text-xs text-navy-950 font-sans">{formatNumber(row.totalQuantity)} units</div>
          <div className="text-2xs text-slate-500">{row.totalItemsCount} medicine lines</div>
        </div>
      )
    },
    {
      header: 'Invoice Amount',
      accessor: 'totalAmountINR',
      sortValue: (row) => row.totalAmountINR,
      render: (row) => (
        <div className="text-right">
          <div className="font-bold text-xs sm:text-sm text-navy-950 font-sans">{formatCurrency(row.totalAmountINR)}</div>
          <div className="text-2xs text-emerald-700 font-semibold">{row.paymentTerm}</div>
        </div>
      )
    },
    {
      header: 'Current Status',
      accessor: 'status',
      render: (row) => {
        let badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
        let dotColor = 'bg-blue-500';
        if (row.status === 'In Transit') {
          badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
          dotColor = 'bg-amber-500 animate-pulse';
        } else if (row.status === 'Delivered') {
          badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
          dotColor = 'bg-emerald-500';
        }

        return (
          <div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
              {row.statusBadge || row.status}
            </span>
            {row.status === 'In Transit' && (
              <p className="text-2xs text-amber-700 font-medium mt-1">Expected: {row.expectedDelivery}</p>
            )}
          </div>
        );
      }
    },
    {
      header: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5 flex-wrap">
          {row.status === 'In Transit' && (
            <Button
              size="sm"
              variant="primary"
              className="text-xs py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              onClick={() => handleConfirmDelivery(row)}
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Confirm Delivery
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="text-xs py-1 px-2.5"
            onClick={() => handleOpenInvoice(row)}
          >
            <FileText className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Tax Invoice
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-bold text-2xl text-navy-950">My Orders &amp; Invoices</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              Pragjyotish Medico
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Track your stock purchase orders, delivery vehicles, and download GST tax invoices from Guwahati Central Depot.
          </p>
        </div>

        <Link to="/distributor/new-order">
          <Button className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            Place New Order
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Orders Placed"
          value={DISTRIBUTOR_ORDERS.length}
          subtitle="This billing quarter"
          icon={Boxes}
          trend={{ direction: 'up', value: `${formatCurrency(totalValue)} Total` }}
        />
        <StatCard
          title="In Transit Now"
          value={inTransitCount}
          subtitle="On delivery truck"
          icon={Truck}
          trend={{ direction: 'up', value: 'Arrival Today' }}
        />
        <StatCard
          title="Processing at Depot"
          value={approvedCount}
          subtitle="Guwahati Depot packing"
          icon={Clock}
          trend={{ direction: 'neutral', value: 'Ready Tomorrow' }}
        />
        <StatCard
          title="Delivered & Invoiced"
          value={deliveredCount}
          subtitle="Safely received at godown"
          icon={CheckCircle2}
          trend={{ direction: 'up', value: '100% Verified' }}
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['All', 'In Transit', 'Approved', 'Delivered'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${selectedStatus === status
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
              >
                {status === 'All' ? 'All Orders' : status}
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-2xs bg-white/20">
                  {status === 'All' ? DISTRIBUTOR_ORDERS.length : DISTRIBUTOR_ORDERS.filter(o => o.status === status).length}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, PO, or Vehicle..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 focus:border-navy-900 transition-all"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="mt-2">
          <Table
            columns={orderColumns}
            data={filteredOrders}
            keyField="id"
            searchPlaceholder=""
            rowsPerPage={8}
          />
        </div>
      </div>

      {/* GST Tax Invoice & Dispatch Details Modal */}
      {isInvoiceOpen && activeInvoice && (
        <Modal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          title={`GST Tax Invoice: ${activeInvoice.invoiceNumber || activeInvoice.id}`}
          subtitle={`Purchase Order Reference: ${activeInvoice.poNumber}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-5 text-xs text-slate-700">

            {/* Invoice Printable Sheet */}
            <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4 font-sans">

              {/* Header Box */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-navy-950 text-base tracking-tight">GRD Pharmaceuticals</span>
                    <span className="text-2xs font-bold text-terracotta-700 bg-terracotta-50 px-2 py-0.5 rounded border border-terracotta-200">Dhanuka Group</span>
                  </div>
                  <p className="text-2xs text-slate-500 mt-1">Rani cGMP Formulation Plant &amp; Central Distribution Depot</p>
                  <p className="text-2xs text-slate-500">Kamrup Rural, Assam - 781131 · GSTIN: 18AABCG1948Q1Z8</p>
                  <p className="text-2xs text-slate-500">Drug License: 20B/KMP/2012/0991, 21B/KMP/2012/0992</p>
                </div>

                <div className="sm:text-right bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-2xs uppercase tracking-wider text-slate-400 font-bold">Tax Invoice</span>
                  <p className="text-sm font-bold text-navy-950 font-mono">{activeInvoice.invoiceNumber || 'INV-DRAFT'}</p>
                  <p className="text-2xs text-slate-600 mt-0.5">Date: {activeInvoice.orderDate}</p>
                  <p className="text-2xs text-emerald-700 font-semibold mt-0.5">Terms: {activeInvoice.paymentTerm}</p>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-2xs font-bold text-slate-400 uppercase tracking-wide">Billed To (Buyer)</span>
                  <p className="font-bold text-navy-950 text-xs mt-0.5">{DISTRIBUTOR_PROFILE.name}</p>
                  <p className="text-2xs text-slate-600">{activeInvoice.destinationGodown}</p>
                  <p className="text-2xs text-slate-600 mt-0.5">GSTIN: <span className="font-mono font-medium">{DISTRIBUTOR_PROFILE.gstin}</span></p>
                  <p className="text-2xs text-slate-600">DL No: <span className="font-mono font-medium">{DISTRIBUTOR_PROFILE.dlNumber}</span></p>
                </div>

                <div>
                  <span className="text-2xs font-bold text-slate-400 uppercase tracking-wide">Dispatch &amp; Carrier</span>
                  <p className="font-bold text-navy-950 text-xs mt-0.5">{activeInvoice.transporterName || 'Dedicated Delivery Van'}</p>
                  <p className="text-2xs text-slate-600">Vehicle: <span className="font-mono font-bold text-navy-900">{activeInvoice.vehicleNumber || 'AS-01-LC-4492'}</span></p>
                  <p className="text-2xs text-slate-600 mt-0.5">Driver: {activeInvoice.driverName || 'Manoj Kalita'} ({activeInvoice.driverPhone || '+91 98640 55120'})</p>
                  <p className="text-2xs text-emerald-700 font-semibold">Status: {activeInvoice.statusBadge || activeInvoice.status}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-2xs uppercase text-slate-500 font-bold">
                    <tr>
                      <th className="py-2 px-3">Item / Formulation</th>
                      <th className="py-2 px-3 text-right">Quantity</th>
                      <th className="py-2 px-3 text-right">Trade Rate (₹)</th>
                      <th className="py-2 px-3 text-right">Taxable (₹)</th>
                      <th className="py-2 px-3 text-right">GST (12%)</th>
                      <th className="py-2 px-3 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeInvoice.items.map((item, idx) => {
                      const taxable = item.orderedQty * item.unitPrice;
                      const gst = taxable * 0.12;
                      const lineTotal = taxable + gst;

                      return (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-2 px-3">
                            <span className="font-mono font-bold text-navy-950 text-2xs">{item.skuCode}</span>
                            <div className="font-semibold text-navy-900">{item.name}</div>
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-navy-950">
                            {formatNumber(item.orderedQty)}
                          </td>
                          <td className="py-2 px-3 text-right font-mono">
                            ₹{item.unitPrice.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-right font-mono">
                            ₹{taxable.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-slate-500">
                            ₹{gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-navy-950">
                            ₹{lineTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-navy-950">
                    <tr>
                      <td colSpan={4} className="py-2.5 px-3 text-right">Grand Total (Incl. GST):</td>
                      <td className="py-2.5 px-3 text-right text-slate-500 font-mono">₹{activeInvoice.gstINR?.toLocaleString('en-IN') || '34,072'}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-700 text-sm font-mono">{formatCurrency(activeInvoice.totalAmountINR)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Payment Advice & Signatures */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 text-2xs text-slate-500">
                <span>Beneficiary: GRD Pharmaceuticals Ltd · HDFC Bank Panbazar (IFSC: HDFC0000184)</span>
                <span className="font-semibold text-navy-900">Authorized Signatory · Guwahati Depot Desk</span>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-2xs text-slate-400">Computer generated invoice valid under Indian IT Act 2000.</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  Print Invoice
                </Button>
                <Button size="sm" className="bg-navy-900 hover:bg-navy-950 text-white" onClick={() => setIsInvoiceOpen(false)}>
                  Close
                </Button>
              </div>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
}
