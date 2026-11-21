import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Select from '../../components/common/Select';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { usePersistentState } from '../../hooks/usePersistentState';
import { DISTRIBUTOR_PROFILE, GUWAHATI_DEPOT_STOCK, DISTRIBUTOR_ORDERS } from '../../data/mockDistributorPortalData';
import { MOCK_SKUS } from '../../data/mockSkus';
import { MOCK_INVENTORY_ITEMS } from '../../data/mockInventory';
import { formatNumber, formatCurrency } from '../../utils/formatters';
import { submitDistributorOrder, STORAGE_KEYS } from '../../services/grdDataService';

export default function DistributorNewOrder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [distributorOrders] = usePersistentState(STORAGE_KEYS.DISTRIBUTOR_ORDERS, DISTRIBUTOR_ORDERS);
  const [skus] = usePersistentState(STORAGE_KEYS.SKUS, MOCK_SKUS);
  const [inventory] = usePersistentState(STORAGE_KEYS.INVENTORY, MOCK_INVENTORY_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryGodown, setDeliveryGodown] = useState('Pragjyotish Medico Central Godown, Panbazar, Guwahati');
  const [orderUrgency, setOrderUrgency] = useState('Routine Weekly Restock');
  const [cart, setCart] = useState({
    'GRD-TAB-001': 1000,
    'GRD-HYG-001': 500
  });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [generatedPoNumber, setGeneratedPoNumber] = useState('');
  const [orderResultStatus, setOrderResultStatus] = useState('');

  // Build unified dynamic catalog
  const catalog = skus.map(sku => {
    const invItem = inventory.find(i => (i.skuCode === sku.code || i.skuId === sku.code) && i.locationName?.includes('Guwahati'));
    const baseItem = GUWAHATI_DEPOT_STOCK.find(i => i.skuCode === sku.code);
    return {
      skuCode: sku.code,
      skuName: sku.name,
      brandName: sku.brandName || baseItem?.brandName || sku.name,
      category: sku.category || 'Tablets',
      packSize: sku.packSize || baseItem?.packSize || '10 x 10 Blister',
      dosageForm: sku.dosageForm || baseItem?.dosageForm || 'Tablets',
      batchNumber: invItem?.batchNumber || baseItem?.batchNumber || 'GRD-B2401',
      expiryDate: invItem?.expiryDate || baseItem?.expiryDate || '2028-11-30',
      availableUnits: invItem ? Math.max(0, invItem.available) : (baseItem ? baseItem.availableUnits : 5000),
      tradePrice: Number(sku.tradePrice) || (baseItem ? baseItem.tradePrice : 50),
      mrp: Number(sku.mrp) || (baseItem ? baseItem.mrp : 65),
      minOrderQty: Number(sku.minOrderQty) || Number(baseItem?.minOrderQty) || 500,
      priorityLevel: sku.vitalCategory?.includes('VED-V') ? 'Vital' : sku.vitalCategory?.includes('VED-E') ? 'Essential' : 'Desirable'
    };
  });

  // Filter medicines
  const filteredCatalog = catalog.filter(item => {
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = !searchQuery ||
      item.skuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skuCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brandName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const updateQuantity = (skuCode, delta) => {
    setCart(prev => {
      const current = prev[skuCode] || 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        const copy = { ...prev };
        delete copy[skuCode];
        return copy;
      }
      return { ...prev, [skuCode]: updated };
    });
  };

  const setExactQuantity = (skuCode, value) => {
    const num = parseInt(value, 10);
    setCart(prev => {
      if (isNaN(num) || num <= 0) {
        const copy = { ...prev };
        delete copy[skuCode];
        return copy;
      }
      return { ...prev, [skuCode]: num };
    });
  };

  const removeFromCart = (skuCode) => {
    setCart(prev => {
      const copy = { ...prev };
      delete copy[skuCode];
      return copy;
    });
  };

  // Calculate totals
  const cartEntries = Object.entries(cart);
  let subtotal = 0;
  let totalUnits = 0;

  cartEntries.forEach(([skuCode, qty]) => {
    const item = catalog.find(i => i.skuCode === skuCode);
    if (item) {
      subtotal += item.tradePrice * qty;
      totalUnits += qty;
    }
  });

  const gstAmount = subtotal * 0.12;
  const grandTotal = subtotal + gstAmount;
  const remainingCredit = DISTRIBUTOR_PROFILE.availableCreditINR - grandTotal;
  const isCreditExceeded = remainingCredit < 0;

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (cartEntries.length === 0) return;

    const result = submitDistributorOrder({
      cartEntries,
      deliveryGodown,
      orderUrgency,
      catalog: catalog,
      user: currentUser
    });

    setGeneratedPoNumber(result.distributorOrderRecord.poNumber);
    setOrderResultStatus(result.distributorOrderRecord.status);
    setIsSuccessModalOpen(true);

    if (result.isCreditExceeded) {
      toast.warning(`Order ${result.distributorOrderRecord.poNumber} exceeds credit limit. Transmitted to Sales Director Rupjyoti Bhattacharya for credit authorization.`);
    } else {
      toast.success(`Purchase Order ${result.distributorOrderRecord.poNumber} submitted to Guwahati Central Depot for priority packing.`);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-bold text-2xl text-navy-950">Place Purchase Order</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Direct Depot Supply
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-0.5">
            Select essential medicines directly from Guwahati Central Depot inventory for same-day dispatch.
          </p>
        </div>

        <Link to="/distributor/orders">
          <Button variant="outline" className="text-xs font-semibold">
            View Order History
          </Button>
        </Link>
      </div>

      {/* Credit Status & Warehouse Info Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wide">Available Credit Limit</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-bold font-sans text-emerald-700">{formatCurrency(DISTRIBUTOR_PROFILE.availableCreditINR)}</span>
            <span className="text-2xs text-slate-400">of {formatCurrency(DISTRIBUTOR_PROFILE.creditLimitINR)}</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${(DISTRIBUTOR_PROFILE.availableCreditINR / DISTRIBUTOR_PROFILE.creditLimitINR) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wide">Supplying Mother Depot</span>
          <div className="flex items-center gap-2 mt-1">
            <Building2 className="w-4 h-4 text-navy-900 shrink-0" />
            <p className="font-bold text-xs text-navy-950 truncate">Guwahati Central Depot</p>
          </div>
          <p className="text-2xs text-slate-500 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-600" />
            Same-day dispatch for orders confirmed before 02:00 PM
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wide">Authorized Buyer</span>
          <div className="flex items-center gap-1.5 mt-1">
            <ShieldCheck className="w-4 h-4 text-terracotta-600 shrink-0" />
            <p className="font-bold text-xs text-navy-950 truncate">{DISTRIBUTOR_PROFILE.name}</p>
          </div>
          <p className="text-2xs text-slate-500 font-mono mt-1">DL: {DISTRIBUTOR_PROFILE.dlNumber} · GSTIN: {DISTRIBUTOR_PROFILE.gstin}</p>
        </div>
      </div>

      {/* Main Order Construction Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left: Medicine Catalog (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">

          {/* Search & Categories */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['All', 'Tablets', 'Capsules', 'Syrups', 'Suspensions & Hygiene'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${selectedCategory === cat
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Field */}
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search medicine name or SKU..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-900 transition-all"
                />
              </div>
            </div>

            {/* Medicine Items List */}
            <div className="space-y-2.5 mt-2">
              {filteredCatalog.map((item) => {
                const inCartQty = cart[item.skuCode] || 0;

                return (
                  <div
                    key={item.skuCode}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${inCartQty > 0
                      ? 'bg-navy-50/30 border-navy-300 ring-1 ring-navy-900/10'
                      : 'bg-white hover:bg-slate-50/70 border-slate-200'
                      }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-navy-950">{item.skuCode}</span>
                        <span className="px-2 py-0.2 rounded text-2xs font-semibold bg-slate-100 text-slate-600">
                          {item.category}
                        </span>
                        <span className="text-2xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                          {formatNumber(item.availableUnits)} units in depot
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-navy-900 mt-1">{item.skuName}</h4>
                      <p className="text-2xs text-terracotta-700 font-semibold">{item.brandName} · Pack of {item.packSize}</p>

                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="font-bold text-navy-950 font-sans">
                          Trade Price: ₹{item.tradePrice.toFixed(2)}
                        </span>
                        <span className="text-2xs text-slate-400 line-through">
                          MRP: ₹{item.mrp.toFixed(2)}
                        </span>
                        <span className="text-2xs text-slate-500 font-medium">
                          MOQ: {formatNumber(item.minOrderQty || 500)} units
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {inCartQty > 0 ? (
                        <div className="flex items-center bg-white border border-navy-300 rounded-xl overflow-hidden shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.skuCode, -(item.minOrderQty || 500))}
                            className="p-2 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                            title="Decrease Quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <input
                            type="number"
                            min="0"
                            step={item.minOrderQty || 500}
                            value={inCartQty}
                            onChange={(e) => setExactQuantity(item.skuCode, e.target.value)}
                            className="w-16 text-center text-xs font-bold font-mono text-navy-950 focus:outline-none"
                          />

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.skuCode, item.minOrderQty || 500)}
                            className="p-2 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                            title="Increase Quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.skuCode, item.minOrderQty || 500)}
                          className="text-xs font-semibold hover:border-navy-900 hover:text-navy-900"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1 text-terracotta-600" />
                          Add ({formatNumber(item.minOrderQty || 500)})
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Order Summary & Checkout Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-20">
          <form onSubmit={handleSubmitOrder} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">

            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-terracotta-600" />
                <h3 className="font-sans font-bold text-base text-navy-950">Purchase Order Summary</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">{cartEntries.length} items</span>
            </div>

            {/* Delivery & Urgency Settings */}
            <div className="space-y-3">
              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Delivery Destination
                </label>
                <Select
                  value={deliveryGodown}
                  onChange={(val) => setDeliveryGodown(val)}
                  options={[
                    { value: 'Pragjyotish Medico Central Godown, Panbazar, Guwahati', label: 'Pragjyotish Medico Central Godown, Panbazar' },
                    { value: 'Beltola Sub-Distribution Point, South Guwahati', label: 'Beltola Sub-Distribution Point, South Guwahati' },
                    { value: 'Nalbari Branch Godown, Lower Assam Hub', label: 'Nalbari Branch Godown, Lower Assam Hub' }
                  ]}
                  className="w-full justify-between"
                  dropdownClassName="w-full"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Indent Urgency / Purpose
                </label>
                <Select
                  value={orderUrgency}
                  onChange={(val) => setOrderUrgency(val)}
                  options={[
                    { value: 'Routine Weekly Restock', label: 'Routine Weekly Restock' },
                    { value: 'Urgent Hospital Indent (Priority Dispatch)', label: 'Urgent Hospital Indent (Priority Dispatch)' },
                    { value: 'District Seasonal Outbreak Restock', label: 'District Seasonal Outbreak Restock' }
                  ]}
                  className="w-full justify-between"
                  dropdownClassName="w-full"
                />
              </div>
            </div>

            {/* Items in Cart */}
            <div className="border border-slate-200 rounded-xl bg-slate-50/60 p-3 max-h-56 overflow-y-auto space-y-2">
              {cartEntries.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No medicines added to order yet.</p>
              ) : (
                cartEntries.map(([skuCode, qty]) => {
                  const item = GUWAHATI_DEPOT_STOCK.find(i => i.skuCode === skuCode);
                  if (!item) return null;
                  const lineTotal = item.tradePrice * qty;

                  return (
                    <div key={skuCode} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 last:border-0">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-semibold text-navy-900 truncate">{item.skuName}</p>
                        <p className="text-2xs text-slate-500">{formatNumber(qty)} units × ₹{item.tradePrice.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-navy-950 font-sans">
                          ₹{lineTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(skuCode)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Financial Calculations */}
            <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({formatNumber(totalUnits)} units):</span>
                <span className="font-mono font-medium">₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Applicable GST (12%):</span>
                <span className="font-mono font-medium">₹{gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-navy-950 pt-2 border-t border-slate-200">
                <span>Order Total (Incl. GST):</span>
                <span className="font-mono text-terracotta-700">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Credit Limit Verification Box */}
            <div className={`p-3 rounded-xl border text-xs ${isCreditExceeded
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
              }`}>
              <div className="flex items-center justify-between font-medium">
                <span>Credit Balance Remaining:</span>
                <span className="font-bold font-mono">
                  {isCreditExceeded ? 'Exceeded by ' + formatCurrency(Math.abs(remainingCredit)) : formatCurrency(remainingCredit)}
                </span>
              </div>
              {isCreditExceeded ? (
                <p className="text-2xs text-rose-700 mt-1 flex items-center gap-1 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  Order value exceeds available credit headroom of ₹26.5 Lakhs.
                </p>
              ) : (
                <p className="text-2xs text-emerald-700 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  Approved under standard 30-day distributor credit agreement.
                </p>
              )}
            </div>

            {/* Submit PO Button */}
            <Button
              type="submit"
              disabled={cartEntries.length === 0}
              className={`w-full py-2.5 text-xs font-bold shadow-md flex items-center justify-center gap-2 ${cartEntries.length === 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : isCreditExceeded
                  ? 'bg-amber-600 hover:bg-amber-700 text-white cursor-pointer'
                  : 'bg-navy-900 hover:bg-navy-950 text-white cursor-pointer'
                }`}
            >
              <PackageCheck className="w-4 h-4" />
              {isCreditExceeded ? 'Submit Indent for Sales Credit Authorization' : 'Confirm & Transmit Purchase Order'}
            </Button>

            <p className="text-2xs text-slate-400 text-center">
              {isCreditExceeded
                ? 'Indent will be submitted to Sales Director Rupjyoti Bhattacharya for credit limit clearance.'
                : 'Order will be immediately pushed to Guwahati Central Depot ERP for batch allocation and loading.'}
            </p>

          </form>
        </div>

      </div>

      {/* Order Confirmed Modal */}
      {isSuccessModalOpen && (
        <Modal
          isOpen={isSuccessModalOpen}
          onClose={() => navigate('/distributor/orders')}
          title={orderResultStatus === 'Pending Credit Approval' ? 'Order Submitted for Credit Authorization' : 'Purchase Order Transmitted Successfully'}
          subtitle={orderResultStatus === 'Pending Credit Approval' ? 'Indent queued for commercial review by Sales Director' : 'Guwahati Central Depot order desk has received your indent'}
          maxWidth="max-w-md"
        >
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Generated PO Reference</p>
              <h3 className="text-xl font-black text-navy-950 font-mono mt-0.5">{generatedPoNumber}</h3>
              <p className="text-xs text-slate-600 mt-1">Total: <strong className="text-navy-900">{formatCurrency(grandTotal)}</strong> · {formatNumber(totalUnits)} units</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Destination:</span>
                <span className="font-semibold text-navy-900">{deliveryGodown.split(',')[0]}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Expected Dispatch:</span>
                <span className="font-semibold text-emerald-700">Today before 04:30 PM</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Terms:</span>
                <span className="font-semibold text-navy-900">30 Days Net Credit</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  setCart({});
                }}
              >
                Place Another
              </Button>
              <Button
                size="sm"
                className="bg-navy-900 hover:bg-navy-950 text-white"
                onClick={() => navigate('/distributor/orders')}
              >
                Track In My Orders
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
