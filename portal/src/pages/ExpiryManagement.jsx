import React, { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Tag
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import { MOCK_EXPIRY_BATCHES, EXPIRY_SUMMARY } from '../data/mockExpiry';
import { formatNumber, formatCurrency } from '../utils/formatters';

export default function ExpiryManagement() {
  const [batches, setBatches] = useState(() => 
    MOCK_EXPIRY_BATCHES.map(b => ({
      ...b,
      daysUntilExpiry: b.daysToExpiry !== undefined ? b.daysToExpiry : (b.daysUntilExpiry || 0),
      quantity: b.batchQuantity !== undefined ? b.batchQuantity : (b.quantity || 0),
      estimatedValueINR: b.financialExposureINR !== undefined ? b.financialExposureINR : (b.estimatedValueINR || 0),
      manufacturingDate: b.mfgDate || b.manufacturingDate || '2024-04-15',
      expiryDate: b.expDate || b.expiryDate || '2026-12-15'
    }))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [horizonFilter, setHorizonFilter] = useState('All');
  const [liquidationBatch, setLiquidationBatch] = useState(null);
  const [liquidationSuccess, setLiquidationSuccess] = useState(false);
  const [fefoAction, setFefoAction] = useState('Hospital Indent Priority');

  const valueAtRisk = EXPIRY_SUMMARY.totalExposureValueINR || EXPIRY_SUMMARY.potentialLossINR || 245395;

  const filteredBatches = batches.filter(batch => {
    const matchSearch = batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        batch.skuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        batch.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchHorizon = true;
    if (horizonFilter === '<30') matchHorizon = batch.daysUntilExpiry <= 30;
    else if (horizonFilter === '30-60') matchHorizon = batch.daysUntilExpiry > 30 && batch.daysUntilExpiry <= 60;
    else if (horizonFilter === '60-90') matchHorizon = batch.daysUntilExpiry > 60 && batch.daysUntilExpiry <= 90;

    return matchSearch && matchHorizon;
  });

  const handleLiquidationSubmit = (e) => {
    e.preventDefault();
    setLiquidationSuccess(true);
    setTimeout(() => {
      setLiquidationSuccess(false);
      setLiquidationBatch(null);
    }, 1200);
  };

  const columns = [
    {
      header: 'Batch # & Lot',
      accessor: 'batchNumber',
      className: 'whitespace-nowrap min-w-[130px]',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-navy-950 text-xs whitespace-nowrap">{row.batchNumber}</span>
          <div className="text-2xs text-slate-500 font-sans mt-0.5 whitespace-nowrap">Mfg: {row.manufacturingDate}</div>
        </div>
      )
    },
    {
      header: 'Medicine Formulation',
      accessor: 'skuName',
      render: (row) => (
        <div>
          <div className="font-semibold text-navy-900 text-xs">{row.skuName}</div>
          <span className="text-2xs font-sans text-slate-400">{row.skuCode}</span>
        </div>
      )
    },
    {
      header: 'Storage Location',
      accessor: 'locationName',
      render: (row) => (
        <span className="text-xs text-slate-800 font-medium">{row.locationName}</span>
      )
    },
    {
      header: 'Days to Expiry',
      accessor: 'daysUntilExpiry',
      align: 'center',
      className: 'whitespace-nowrap',
      sortValue: (row) => row.daysUntilExpiry,
      render: (row) => {
        const isExpired = row.daysUntilExpiry <= 0;
        const isCritical = row.daysUntilExpiry > 0 && row.daysUntilExpiry <= 30;
        const isWarning = row.daysUntilExpiry > 30 && row.daysUntilExpiry <= 60;
        return (
          <div className="text-center font-sans">
            <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
              isExpired ? 'bg-rose-200 text-rose-950 border border-rose-300' :
              isCritical ? 'bg-rose-100 text-rose-800 border border-rose-200' :
              isWarning ? 'bg-amber-100 text-amber-800 border border-amber-200' :
              'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {isExpired ? `Expired (${Math.abs(row.daysUntilExpiry)}d ago)` : `${row.daysUntilExpiry} Days`}
            </span>
            <div className="text-2xs text-slate-400 mt-0.5">{row.expiryDate}</div>
          </div>
        );
      }
    },
    {
      header: 'Batch Volume',
      accessor: 'quantity',
      align: 'right',
      className: 'whitespace-nowrap',
      sortValue: (row) => row.quantity,
      render: (row) => (
        <div className="text-right font-sans">
          <span className="font-bold text-navy-950 text-xs">{formatNumber(row.quantity)}</span>
          <div className="text-2xs text-slate-400">units</div>
        </div>
      )
    },
    {
      header: 'Batch Valuation',
      accessor: 'estimatedValueINR',
      align: 'right',
      className: 'whitespace-nowrap',
      sortValue: (row) => row.estimatedValueINR,
      render: (row) => (
        <div className="text-right font-sans">
          <span className="font-bold text-terracotta-700 text-xs">{formatCurrency(row.estimatedValueINR)}</span>
        </div>
      )
    },
    {
      header: 'FEFO Queue Status',
      render: (row) => {
        if (row.daysUntilExpiry <= 0) {
          return <Badge variant="danger">Expired - Quarantine</Badge>;
        }
        if (row.daysUntilExpiry <= 30) {
          return <Badge variant="danger">Urgent Liquidation</Badge>;
        }
        if (row.daysUntilExpiry <= 60) {
          return <Badge variant="warning">FEFO Priority Queue</Badge>;
        }
        return <Badge variant="info">Watchlist Rotation</Badge>;
      }
    },
    {
      header: 'Action',
      align: 'center',
      sortable: false,
      className: 'whitespace-nowrap',
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-center">
          <Button 
            variant={row.daysUntilExpiry <= 60 ? 'primary' : 'outline'}
            size="xs"
            onClick={() => setLiquidationBatch(row)}
            icon={Tag}
          >
            FEFO Action
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-bold text-2xl text-navy-950">
              Medicine Expiry Tracking (FEFO)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              Zero Wastage Policy
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Track medicine expiry dates. Follow First-Expiry, First-Out (FEFO) to sell older batches first and prevent medicine wastage.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Batches Expiring Soon"
          value={EXPIRY_SUMMARY.nearExpiryBatchesCount}
          subtitle="Expiring within 60 days"
          icon={Clock}
          trend={{ direction: 'down', text: 'Loss down 67.1%', isGood: true }}
          badge={{ text: 'Sell First', variant: 'warning' }}
        />
        <StatCard
          title="Value at Risk"
          value={formatCurrency(valueAtRisk)}
          subtitle="If not sold in time"
          icon={AlertTriangle}
          trend={{ direction: 'down', text: 'Down from ₹42.5L base', isGood: true }}
          badge={{ text: 'Actionable', variant: 'warning' }}
        />
        <StatCard
          title="Money Saved by FEFO"
          value="₹28.5 Lakhs"
          subtitle="Saved by prioritizing older stock"
          icon={ShieldCheck}
          trend={{ direction: 'up', text: '+94.2% Salvage Rate' }}
          badge={{ text: 'Saved', variant: 'success' }}
        />
        <StatCard
          title="Quality Compliance"
          value="100% cGMP"
          subtitle="Zero expired stock dispatched"
          icon={CheckCircle2}
          trend={{ direction: 'up', text: 'Zero expired dispatch', isGood: true }}
          badge={{ text: 'Compliant', variant: 'info' }}
        />
      </div>

      {/* Filter Toolbar */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Expiry Horizon:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
              {[
                { id: 'All', label: 'All Batches' },
                { id: '<30', label: '<30 Days (Immediate)' },
                { id: '30-60', label: '30-60 Days (FEFO Queue)' },
                { id: '60-90', label: '60-90 Days (Watchlist)' }
              ].map(h => (
                <button
                  key={h.id}
                  onClick={() => setHorizonFilter(h.id)}
                  className={`px-2.5 py-1 rounded text-2xs font-semibold transition-all ${
                    horizonFilter === h.id ? 'bg-white text-navy-950 shadow-2xs' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search batch #, SKU, or hub..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 py-1.5 text-xs w-full"
            />
          </div>
        </div>
      </div>

      {/* Paginated, Sortable Table */}
      <Table 
        title="Medicine Batches Expiry Schedule"
        subtitle="Batches arranged by First-Expiry, First-Out (FEFO) order to ensure zero wastage"
        columns={columns}
        data={filteredBatches}
        keyExtractor={(row) => row.batchNumber}
        exportFilename="grd_fefo_expiry_schedule"
        pageSize={10}
        showPagination={true}
        emptyMessage="No batches found in the selected expiry window."
      />

      {/* FEFO Action Modal */}
      <Modal
        isOpen={!!liquidationBatch}
        onClose={() => setLiquidationBatch(null)}
        title="FEFO Priority Dispatch Action"
        size="md"
      >
        {liquidationBatch && (
          <form onSubmit={handleLiquidationSubmit} className="space-y-4 text-xs">
            {liquidationSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-950 text-sm">FEFO Allocation Approved</h4>
                <p className="text-2xs text-emerald-700">Batch {liquidationBatch.batchNumber} allocated to emergency hospital tender indent.</p>
              </div>
            ) : (
              <>
                <div className="p-3 bg-amber-50 rounded-xl text-amber-950 space-y-1 border border-amber-200">
                  <div className="font-bold text-sm">{liquidationBatch.skuName}</div>
                  <div className="text-2xs text-amber-900">
                    Batch: <strong>{liquidationBatch.batchNumber}</strong> • Expiry Date: <strong>{liquidationBatch.expiryDate}</strong> ({liquidationBatch.daysUntilExpiry} days left)
                  </div>
                  <div className="text-2xs text-amber-800">
                    Quantity: <strong>{formatNumber(liquidationBatch.quantity)} units</strong> • Value: <strong>{formatCurrency(liquidationBatch.estimatedValueINR)}</strong>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-navy-950 mb-1">FEFO Recommendation Action</label>
                  <Select
                    value={fefoAction}
                    onChange={(val) => setFefoAction(val)}
                    options={[
                      { value: 'Hospital Indent Priority', label: 'Priority Allocation to Gauhati Medical College (GMCH)' },
                      { value: 'Army Hospital Indent', label: 'Direct Dispatch to 151 Army Base Hospital' },
                      { value: 'Special Promotional Discount', label: 'Offer 15% Clearance Rebate to Regional Stockists' },
                      { value: 'Quarantine Transfer', label: 'Transfer to Quarantine Area (Pending Lab Retest)' }
                    ]}
                    className="w-full justify-between"
                    dropdownClassName="w-full"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-navy-950 mb-1">Authorized Medical Officer Sign-Off</label>
                  <input
                    type="text"
                    required
                    defaultValue="Dr. Abhijit Sarma (Chief Supply Chain Officer)"
                    className="input w-full"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setLiquidationBatch(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Confirm FEFO Clearance
                  </Button>
                </div>
              </>
            )}
          </form>
        )}
      </Modal>
    </div>
  );
}
