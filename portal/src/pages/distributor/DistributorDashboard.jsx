import React, { useState } from 'react';
import {
  CreditCard,
  ShoppingCart,
  Store,
  TrendingUp,
  Clock,
  Phone,
  MapPin,
  FileText,
  Plus,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { usePersistentState } from '../../hooks/usePersistentState';
import { STORAGE_KEYS } from '../../services/grdDataService';
import {
  DISTRIBUTOR_PROFILE,
  DISTRIBUTOR_ORDERS,
  DISTRIBUTOR_SUB_STOCKISTS,
  GUWAHATI_DEPOT_STOCK
} from '../../data/mockDistributorPortalData';
import { formatNumber, formatCurrency } from '../../utils/formatters';

export default function DistributorDashboard({ onOpenOrderModal }) {
  const navigate = useNavigate();
  const [orders] = usePersistentState(STORAGE_KEYS.DISTRIBUTOR_ORDERS, DISTRIBUTOR_ORDERS);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const activeOrder = orders.find(o => o.status === 'In Transit' || o.status === 'Pending Approval' || o.status === 'Approved') || orders[0];
  const pendingCount = orders.filter(o => o.status === 'Pending Approval' || o.status === 'Pending Credit Approval').length;
  const inTransitCount = orders.filter(o => o.status === 'In Transit').length;

  const depotStockColumns = [
    {
      header: 'Medicine & Formulation',
      accessor: 'skuName',
      render: (row) => (
        <div>
          <span className="font-sans font-bold text-navy-950 text-xs">{row.skuCode}</span>
          <div className="font-semibold text-navy-900 text-xs">{row.skuName}</div>
          <span className="text-2xs text-terracotta-700 font-semibold">{row.brandName} • {row.packSize}</span>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <span className="text-xs text-slate-700 font-medium">{row.category}</span>
      )
    },
    {
      header: 'Trade Price (DP)',
      accessor: 'tradePrice',
      sortValue: (row) => row.tradePrice,
      render: (row) => (
        <div className="text-right font-sans">
          <span className="font-bold text-navy-950 text-xs">₹{row.tradePrice.toFixed(2)}</span>
          <div className="text-2xs text-slate-400">MRP: ₹{row.mrp.toFixed(2)}</div>
        </div>
      )
    },
    {
      header: 'Available at Depot',
      accessor: 'availableUnits',
      sortValue: (row) => row.availableUnits,
      render: (row) => (
        <div className="text-right font-sans">
          <span className="font-bold text-emerald-700 text-xs">{formatNumber(row.availableUnits)} units</span>
          <div className="text-2xs text-slate-400">Guwahati Mother Hub</div>
        </div>
      )
    },
    {
      header: 'Dispatch Speed',
      accessor: 'dispatchLeadTime',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-2xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
          <Clock className="w-3 h-3 text-emerald-600" />
          {row.dispatchLeadTime}
        </span>
      )
    },
    {
      header: 'Action',
      sortable: false,
      render: (row) => (
        <div className="text-center">
          <Link
            to="/distributor/new-order"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-navy-900 hover:bg-navy-950 text-white transition-colors shadow-2xs"
          >
            <Plus className="w-3 h-3" />
            <span>Order</span>
          </Link>
        </div>
      )
    }
  ];

  const subStockistColumns = [
    {
      header: 'Stockist Name & Market',
      accessor: 'name',
      render: (row) => (
        <div>
          <span className="font-bold text-navy-950 text-xs">{row.name}</span>
          <div className="text-2xs text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-terracotta-600" />
            <span>{row.area}, {row.city}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Monthly Turnover',
      accessor: 'monthlyTurnoverINR',
      sortValue: (row) => row.monthlyTurnoverINR,
      render: (row) => (
        <div className="text-right font-sans font-semibold text-xs text-navy-950">
          {formatCurrency(row.monthlyTurnoverINR)}
        </div>
      )
    },
    {
      header: 'Stock Days Left',
      accessor: 'stockCoverDays',
      sortValue: (row) => row.stockCoverDays,
      render: (row) => (
        <div className="text-center font-sans">
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            row.stockCoverDays <= 7 ? 'bg-rose-100 text-rose-800 border border-rose-200' :
            row.stockCoverDays <= 12 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
            'bg-emerald-100 text-emerald-800 border border-emerald-200'
          }`}>
            {row.stockCoverDays} Days Left
          </span>
        </div>
      )
    },
    {
      header: 'Outstanding Balance',
      accessor: 'outstandingBalanceINR',
      sortValue: (row) => row.outstandingBalanceINR,
      render: (row) => (
        <div className="text-right font-sans text-xs font-medium text-slate-700">
          {formatCurrency(row.outstandingBalanceINR)}
        </div>
      )
    },
    {
      header: 'POS Sync Status',
      render: (row) => (
        <span className="text-2xs font-medium text-slate-500 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {row.posSyncStatus}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Distributor Profile Banner */}
      <div className="portal-card p-5 bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 text-white rounded-2xl shadow-md border border-navy-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-terracotta-500 text-white shadow-2xs">
                Certified C&amp;F Distributor
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-slate-200 border border-white/10">
                Partner Code: {DISTRIBUTOR_PROFILE.code}
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                A-Grade Channel Partner
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-white">
              {DISTRIBUTOR_PROFILE.name}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300 font-light">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-terracotta-400 shrink-0" />
                {DISTRIBUTOR_PROFILE.territory}
              </span>
              <span>&bull;</span>
              <span>Drug Lic: <strong className="text-white font-normal">{DISTRIBUTOR_PROFILE.dlNumber}</strong></span>
              <span>&bull;</span>
              <span>GSTIN: <strong className="text-white font-normal">{DISTRIBUTOR_PROFILE.gstin}</strong></span>
              <span>&bull;</span>
              <span>Mother Warehouse: <strong className="text-emerald-300 font-normal">{DISTRIBUTOR_PROFILE.supplyingWarehouse}</strong></span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to="/distributor/new-order"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Place New Stock Order</span>
            </Link>
            <Link
              to="/distributor/ledger"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Account Ledger</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Top KPI StatCards for Distributor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Available Credit Limit"
          value={formatCurrency(DISTRIBUTOR_PROFILE.availableCreditINR)}
          subtitle={`Total Limit: ${formatCurrency(DISTRIBUTOR_PROFILE.creditLimitINR)}`}
          icon={CreditCard}
          trend={{ direction: 'neutral', text: `₹${(DISTRIBUTOR_PROFILE.currentOutstandingINR / 100000).toFixed(1)}L Utilized` }}
          badge={{ text: '58.9% Available', variant: 'success' }}
        />
        <StatCard
          title="Active Stock Orders"
          value={`${orders.length} Orders`}
          subtitle={`${inTransitCount} In Transit · ${pendingCount} Under Review`}
          icon={ShoppingCart}
          trend={{ direction: 'up', text: '100% SLA Adherence' }}
          badge={{ text: 'Live Indents', variant: 'info' }}
        />
        <StatCard
          title="Mapped Sub-Stockists"
          value={`${DISTRIBUTOR_PROFILE.activeStockistsCount} Stores`}
          subtitle="Kamrup & Lower Assam coverage"
          icon={Store}
          trend={{ direction: 'up', text: 'All POS Active' }}
          badge={{ text: 'Direct Network', variant: 'neutral' }}
        />
        <StatCard
          title="Monthly Off-Take (MTD)"
          value="₹28.40 Lakhs"
          subtitle="Total secondary medicine sales"
          icon={TrendingUp}
          trend={{ direction: 'up', text: '+14.2% YoY Growth' }}
          badge={{ text: 'Winter Surge', variant: 'success' }}
        />
      </div>

      {/* Live Order In-Transit Card */}
      {activeOrder && (
        <div className="portal-card p-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <h3 className="font-sans font-bold text-base text-navy-950">
                  Live Consignment on Road: {activeOrder.poNumber}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  In Transit
                </span>
              </div>
              <p className="text-xs text-slate-500 font-light mt-0.5">
                Dispatched from Guwahati Central Depot to Pragjyotish Medico Panbazar Godown
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${activeOrder.driverPhone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call Driver: {activeOrder.driverName}</span>
              </a>
              <Link
                to="/distributor/orders"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-950 text-white text-xs font-semibold shadow-2xs transition-colors"
              >
                <span>Order Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 text-xs">
            <div>
              <span className="text-2xs text-slate-500 font-medium block">Vehicle &amp; Carrier</span>
              <strong className="text-navy-950 text-xs">{activeOrder.vehicleNumber}</strong>
              <div className="text-slate-500 text-2xs">{activeOrder.transporterName}</div>
            </div>
            <div>
              <span className="text-2xs text-slate-500 font-medium block">Consignment Value</span>
              <strong className="text-terracotta-700 text-xs font-sans">{formatCurrency(activeOrder.totalAmountINR)}</strong>
              <div className="text-slate-500 text-2xs">{activeOrder.totalQuantity} Units ({activeOrder.totalItemsCount} Medicines)</div>
            </div>
            <div>
              <span className="text-2xs text-slate-500 font-medium block">Estimated Arrival</span>
              <strong className="text-emerald-700 text-xs">{activeOrder.expectedDelivery}</strong>
              <div className="text-slate-500 text-2xs">Distance: 12 km via GS Road</div>
            </div>
            <div>
              <span className="text-2xs text-slate-500 font-medium block">Tax Invoice / E-Way Bill</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedInvoice(activeOrder);
                  setIsInvoiceModalOpen(true);
                }}
                className="text-navy-900 hover:text-terracotta-600 font-bold text-xs font-sans underline cursor-pointer text-left flex items-center gap-1"
              >
                <span>{activeOrder.invoiceNumber}</span>
                <FileText className="w-3 h-3 text-slate-400" />
              </button>
              <div className="text-slate-500 text-2xs">30-Day Net Credit Active</div>
            </div>
          </div>
        </div>
      )}

      {/* Guwahati Depot Real-Time Stock Availability Table */}
      <Table
        title="Guwahati Mother Depot - Real-Time Stock Visibility"
        subtitle="Stock currently available at Guwahati Central Depot ready for immediate same-day delivery"
        columns={depotStockColumns}
        data={GUWAHATI_DEPOT_STOCK}
        keyExtractor={(row) => row.skuCode}
        exportFilename="pragjyotish_depot_availability"
        pageSize={10}
        showPagination={true}
      />

      {/* Secondary Retail Stockists Network */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-sans font-bold text-base text-navy-950">
              My Sub-Stockist Retail Network (Assam &amp; Kamrup)
            </h3>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Live stock cover and weekly consumption of pharmacies and retail stockists supplied by Pragjyotish Medico.
            </p>
          </div>

          <Link
            to="/distributor/stockists"
            className="text-xs font-semibold text-navy-900 hover:text-terracotta-600 flex items-center gap-1 shrink-0"
          >
            <span>View All 24 Stockists</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <Table
          columns={subStockistColumns}
          data={DISTRIBUTOR_SUB_STOCKISTS}
          keyExtractor={(row) => row.id}
          exportFilename="pragjyotish_sub_stockists"
          pageSize={10}
          showPagination={true}
        />
      </div>

      {/* Tax Invoice & Consignment Pass Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          title={`Tax Invoice & Consignment Pass: ${selectedInvoice.invoiceNumber}`}
          size="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-2xs text-slate-500 block">Purchase Order</span>
                <span className="font-bold text-navy-950 font-sans">{selectedInvoice.poNumber}</span>
              </div>
              <div>
                <span className="text-2xs text-slate-500 block">Order Date</span>
                <span className="font-semibold text-slate-800">{selectedInvoice.orderDate}</span>
              </div>
              <div>
                <span className="text-2xs text-slate-500 block">Payment Terms</span>
                <span className="font-semibold text-slate-800">{selectedInvoice.paymentTerm}</span>
              </div>
              <div>
                <span className="text-2xs text-slate-500 block">Due Date</span>
                <span className="font-bold text-terracotta-700 font-sans">{selectedInvoice.dueDate}</span>
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-navy-950 text-xs">Consignment & Carrier Logistics</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-2xs text-slate-500 block">Transporter</span>
                  <span className="font-semibold text-slate-800">{selectedInvoice.transporterName}</span>
                </div>
                <div>
                  <span className="text-2xs text-slate-500 block">Vehicle Number</span>
                  <span className="font-mono font-bold text-navy-950">{selectedInvoice.vehicleNumber}</span>
                </div>
                <div>
                  <span className="text-2xs text-slate-500 block">Driver Contact</span>
                  <span className="font-semibold text-slate-800">{selectedInvoice.driverName} ({selectedInvoice.driverPhone})</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-navy-950 text-xs">Financial & GST Valuation</h4>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-2xs text-slate-500 block">Taxable Subtotal</span>
                  <span className="font-bold text-navy-950 font-sans">{formatCurrency(selectedInvoice.subtotalINR)}</span>
                </div>
                <div>
                  <span className="text-2xs text-slate-500 block">GST (12% Pharma IGST/CGST)</span>
                  <span className="font-bold text-slate-700 font-sans">{formatCurrency(selectedInvoice.gstINR)}</span>
                </div>
                <div>
                  <span className="text-2xs text-slate-500 block">Total Invoice Amount</span>
                  <span className="font-bold text-emerald-700 text-sm font-sans">{formatCurrency(selectedInvoice.totalAmountINR)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsInvoiceModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}