import React, { useState } from 'react';
import {
  Store,
  Phone,
  Search,
  Filter,
  TrendingUp,
  CheckCircle2,
  Clock,
  Building,
  ShoppingCart,
  Receipt,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { usePersistentState } from '../../hooks/usePersistentState';
import { DISTRIBUTOR_PROFILE, DISTRIBUTOR_SUB_STOCKISTS } from '../../data/mockDistributorPortalData';
import { MOCK_SKUS } from '../../data/mockSkus';
import { formatCurrency } from '../../utils/formatters';
import { billRetailSaleToStockist, STORAGE_KEYS } from '../../services/grdDataService';

export default function DistributorStockists() {
  const [stockistList, setStockistList] = usePersistentState(STORAGE_KEYS.STOCKISTS, DISTRIBUTOR_SUB_STOCKISTS);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [formName, setFormName] = useState('Kamakhya Medical & Surgical Store');
  const [formOwner, setFormOwner] = useState('Mr. Dhiren Kalita');
  const [formPhone, setFormPhone] = useState('+91 94351 88291');
  const [formLocality, setFormLocality] = useState('Panbazar');
  const [formLicense, setFormLicense] = useState('DL-KAM-2026-8812');
  const [formCreditLimit, setFormCreditLimit] = useState(250000);

  const handleRegisterStockist = (e) => {
    e.preventDefault();
    const newStockist = {
      id: `STK-GHY-${Math.floor(100 + Math.random() * 900)}`,
      name: formName,
      contactPerson: formOwner,
      phone: formPhone,
      locality: formLocality,
      address: `${formLocality}, Guwahati Metro`,
      drugLicenseNumber: formLicense,
      creditLimitINR: Number(formCreditLimit),
      outstandingINR: 0,
      monthlyTurnoverINR: 180000,
      stockCoverDays: 21,
      lowStockAlert: false,
      status: 'Active Licensed Chemist'
    };

    setStockistList(prev => [newStockist, ...prev]);
    setIsRegisterModalOpen(false);
    toast.success(`Retail chemist ${newStockist.name} registered into your distribution network! Ready for order billing.`);
  };
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [skus] = usePersistentState(STORAGE_KEYS.SKUS, MOCK_SKUS);
  const [selectedLocality, setSelectedLocality] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStockist, setSelectedStockist] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Bill Sale Modal State
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [billingStockist, setBillingStockist] = useState(null);
  const [billSkuCode, setBillSkuCode] = useState('GRD-TAB-001');
  const [billQty, setBillQty] = useState(100);

  const handleOpenBillModal = (stk) => {
    setBillingStockist(stk);
    setBillSkuCode(skus[0]?.code || 'GRD-TAB-001');
    setBillQty(100);
    setIsBillModalOpen(true);
  };

  const handleConfirmBillSale = (e) => {
    e.preventDefault();
    if (!billingStockist) return;
    const selectedItem = skus.find(s => s.code === billSkuCode) || { name: billSkuCode, tradePrice: 45 };
    const result = billRetailSaleToStockist({
      stockistName: billingStockist.name,
      skuCode: billSkuCode,
      skuName: selectedItem.brandName ? `${selectedItem.brandName} (${selectedItem.name})` : selectedItem.name,
      quantity: Number(billQty),
      tradePrice: Number(selectedItem.tradePrice || 45),
      user: currentUser
    });
    setIsBillModalOpen(false);
    toast.success(`Retail Invoice ${result.invoiceNumber} (₹${result.totalAmount.toLocaleString('en-IN')}) issued to ${billingStockist.name}! Final sale recorded.`);
  };

  // Filter stockists
  const filteredStockists = stockistList.filter(stk => {
    const localityText = `${stk.area || ''} ${stk.city || ''}`;
    const matchLocality = selectedLocality === 'All' || localityText.toLowerCase().includes(selectedLocality.toLowerCase());
    const matchSearch = !searchQuery || 
      stk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stk.dlNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      localityText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stk.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLocality && matchSearch;
  });

  const lowStockCount = DISTRIBUTOR_SUB_STOCKISTS.filter(s => s.stockCoverDays < 15).length;
  const totalOfftake = DISTRIBUTOR_SUB_STOCKISTS.reduce((acc, curr) => acc + (curr.monthlyTurnoverINR || 0), 0);
  const totalOutstanding = DISTRIBUTOR_SUB_STOCKISTS.reduce((acc, curr) => acc + (curr.outstandingBalanceINR || 0), 0);

  const handleOpenDetail = (stk) => {
    setSelectedStockist(stk);
    setIsDetailModalOpen(true);
  };

  const stockistColumns = [
    {
      header: 'Retail Chemist / Sub-Stockist',
      accessor: 'name',
      render: (row) => (
        <div>
          <span className="font-bold text-navy-950 text-xs sm:text-sm font-sans">{row.name}</span>
          <div className="text-2xs text-slate-500 mt-0.5">{row.contactPerson} · {row.phone}</div>
          <span className="text-2xs text-slate-400 font-mono">DL: {row.dlNumber}</span>
        </div>
      )
    },
    {
      header: 'Area & City',
      accessor: 'area',
      render: (row) => (
        <div>
          <span className="text-xs font-semibold text-navy-900">{row.area}</span>
          <div className="text-2xs text-slate-500">{row.city}, Assam</div>
        </div>
      )
    },
    {
      header: 'Monthly Turnover',
      accessor: 'monthlyTurnoverINR',
      sortValue: (row) => row.monthlyTurnoverINR,
      render: (row) => (
        <div className="text-right sm:text-left">
          <span className="font-bold text-xs text-navy-950 font-sans">{formatCurrency(row.monthlyTurnoverINR)}</span>
          <div className="text-2xs text-slate-400">Regular Indent</div>
        </div>
      )
    },
    {
      header: 'Stock Cover',
      accessor: 'stockCoverDays',
      sortValue: (row) => row.stockCoverDays,
      render: (row) => {
        let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        if (row.stockCoverDays < 15) {
          badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';
        } else if (row.stockCoverDays < 20) {
          badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
        }

        return (
          <div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeColor}`}>
              {row.stockCoverDays} Days
            </span>
            {row.stockCoverDays < 15 && (
              <span className="block text-2xs text-rose-600 font-medium mt-0.5">Replenish Soon</span>
            )}
          </div>
        );
      }
    },
    {
      header: 'Outstanding Dues',
      accessor: 'outstandingBalanceINR',
      sortValue: (row) => row.outstandingBalanceINR,
      render: (row) => (
        <div className="text-right">
          <span className="font-bold text-xs text-navy-950 font-sans">{formatCurrency(row.outstandingBalanceINR)}</span>
          <div className="text-2xs text-slate-500">Term: 15-21 Days</div>
        </div>
      )
    },
    {
      header: 'POS Synced',
      accessor: 'posSyncStatus',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-800">{row.posSyncStatus || 'Connected'}</span>
        </div>
      )
    },
    {
      header: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-end flex-wrap">
          <Button
            size="sm"
            variant="primary"
            className="text-xs py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1"
            onClick={() => handleOpenBillModal(row)}
          >
            <Receipt className="w-3.5 h-3.5" />
            Bill Sale
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs py-1 px-2.5"
            onClick={() => handleOpenDetail(row)}
          >
            View Store
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
            <h1 className="font-sans font-bold text-2xl text-navy-950">My Sub-Stockists Network</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              24 Mapped Retailers
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Monitor inventory levels, sales turnover, and supply requirements for retail pharmacies in Kamrup Metro, Morigaon &amp; Nalbari.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsRegisterModalOpen(true)}
            icon={Plus}
            className="bg-navy-900 hover:bg-navy-950 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            Register Retail Chemist
          </Button>
          <Link to="/distributor/new-order">
          <Button className="bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5">
            <ShoppingCart className="w-4 h-4" />
            Place Indent for Network
          </Button>
        </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Mapped Chemist Stores"
          value={DISTRIBUTOR_PROFILE.activeStockistsCount}
          subtitle="All licensed retail counters"
          icon={Store}
          trend={{ direction: 'up', value: '100% Active' }}
        />
        <StatCard
          title="Average Stock Cover"
          value="18.4 Days"
          subtitle="Across network medicines"
          icon={Clock}
          trend={{ direction: 'neutral', value: `${lowStockCount} Need Restock` }}
        />
        <StatCard
          title="Total Monthly Offtake"
          value={formatCurrency(totalOfftake)}
          subtitle="Direct pharmacy dispense"
          icon={TrendingUp}
          trend={{ direction: 'up', value: '+14.2% vs Last Mo' }}
        />
        <StatCard
          title="Outstanding Receivable"
          value={formatCurrency(totalOutstanding)}
          subtitle="From retail chemists"
          icon={Building}
          trend={{ direction: 'neutral', value: 'Normal Cycle' }}
        />
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Locality Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['All', 'Panbazar', 'Dispur', 'Jalukbari', 'Fancy Bazar', 'Nalbari', 'Morigaon'].map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setSelectedLocality(loc)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedLocality === loc
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {loc === 'All' ? 'All Localities' : loc}
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
              placeholder="Search store name, DL, or contact..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 transition-all"
            />
          </div>
        </div>

        {/* Stockists Table */}
        <div className="mt-2">
          <Table
            columns={stockistColumns}
            data={filteredStockists}
            keyField="id"
            searchPlaceholder=""
            rowsPerPage={8}
          />
        </div>
      </div>

      {/* Stockist Detail Modal */}
      {isDetailModalOpen && selectedStockist && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={selectedStockist.name}
          subtitle={`Licensed Retail Pharmacy · ${selectedStockist.area || ''}, ${selectedStockist.city || ''}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs text-slate-700">
            
            {/* Store Information Grid */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Contact Person:</span>
                <span className="font-bold text-navy-950">{selectedStockist.contactPerson}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Direct Phone:</span>
                <span className="font-semibold text-navy-900 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-terracotta-600" />
                  {selectedStockist.phone}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Drug License Number:</span>
                <span className="font-mono font-semibold text-navy-900">{selectedStockist.dlNumber}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Retail POS Synchronization:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Live Sync (Updated Today)
                </span>
              </div>
            </div>

            {/* Current Inventory Snapshot */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-2xs font-semibold text-slate-400 uppercase">Stock Coverage</span>
                <p className={`text-base font-bold font-sans mt-0.5 ${selectedStockist.stockCoverDays < 15 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {selectedStockist.stockCoverDays} Days
                </p>
                <p className="text-2xs text-slate-500 mt-0.5">Based on 30-day dispensing rate</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-2xs font-semibold text-slate-400 uppercase">Current Outstanding</span>
                <p className="text-base font-bold font-sans text-navy-950 mt-0.5">
                  {formatCurrency(selectedStockist.outstandingBalanceINR)}
                </p>
                <p className="text-2xs text-emerald-700 mt-0.5 font-semibold">Payment on time</p>
              </div>
            </div>

            {/* Fast-Moving SKU Indent Recommendation */}
            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 text-xs">
              <p className="font-bold text-amber-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-700" />
                Recommended Next Delivery Indent
              </p>
              <p className="text-slate-600 text-2xs mt-1">
                Based on current consumption trends, this retailer will need restock of <strong>Paracetamol 650mg</strong> and <strong>Ambroxol Cough Syrup</strong> within the next 48-72 hours.
              </p>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </Button>
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 font-semibold"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleOpenBillModal(selectedStockist);
                }}
              >
                <Receipt className="w-3.5 h-3.5" />
                Bill Retail Sale
              </Button>
              <Link to="/distributor/new-order">
                <Button size="sm" className="bg-navy-900 hover:bg-navy-950 text-white flex items-center gap-1">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Create Restock Order
                </Button>
              </Link>
            </div>

          </div>
        </Modal>
      )}

      {/* Bill Retail Sale Modal */}
      {isBillModalOpen && billingStockist && (
        <Modal
          isOpen={isBillModalOpen}
          onClose={() => setIsBillModalOpen(false)}
          title={`Bill Retail Sale: ${billingStockist.name}`}
          subtitle={`Issue invoice & record retail pharmacy sale under Drug License: ${billingStockist.dlNumber}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleConfirmBillSale} className="space-y-4 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <p className="font-bold text-navy-950 text-xs">{billingStockist.name}</p>
              <p className="text-2xs text-slate-500">{billingStockist.area}, {billingStockist.city} · Contact: {billingStockist.contactPerson}</p>
              <p className="text-2xs text-slate-400 font-mono">DL No: {billingStockist.dlNumber}</p>
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Medicine Formulation to Bill
              </label>
              <select
                value={billSkuCode}
                onChange={(e) => setBillSkuCode(e.target.value)}
                className="input py-2 text-xs w-full bg-slate-50"
              >
                {skus.map(s => (
                  <option key={s.code} value={s.code}>
                    {s.code} - {s.brandName ? `${s.brandName} (${s.name})` : s.name} [₹{s.tradePrice}/pack]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Quantity Billed (Packs)
              </label>
              <input
                type="number"
                min="10"
                step="10"
                required
                value={billQty}
                onChange={(e) => setBillQty(Number(e.target.value))}
                className="input py-2 text-xs w-full font-sans"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 flex items-center justify-between">
              <div>
                <span className="text-2xs text-emerald-700 block font-semibold">Total Retail Bill Amount</span>
                <span className="text-base font-bold font-sans">
                  ₹{((skus.find(s => s.code === billSkuCode)?.tradePrice || 45) * billQty).toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Net 15 Days Credit
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsBillModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5" />
                Issue Tax Invoice &amp; Dispatch
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
