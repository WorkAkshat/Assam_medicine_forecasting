import React, { useState } from 'react';
import {
  TrendingUp,
  Target,
  Users,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Pill,
  Check,
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import {
  SALES_DIRECTOR_PROFILE,
  TERRITORY_PERFORMANCE,
  COMMERCIAL_CREDIT_APPROVALS,
  TOP_PRODUCTS_COMMERCIAL
} from '../../data/mockSalesDirectorData';
import { formatNumber, formatCurrency } from '../../utils/formatters';
import { usePersistentState } from '../../hooks/usePersistentState';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { processCreditApproval, STORAGE_KEYS } from '../../services/grdDataService';

export default function SalesDirectorDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [approvals, setApprovals] = usePersistentState(STORAGE_KEYS.CREDIT_APPROVALS, COMMERCIAL_CREDIT_APPROVALS);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalActionType, setApprovalActionType] = useState('approve'); // approve or reject

  const handleActionClick = (approval, type) => {
    setSelectedApproval(approval);
    setApprovalActionType(type);
    setIsApprovalModalOpen(true);
  };

  const handleConfirmDecision = () => {
    if (!selectedApproval) return;
    processCreditApproval({
      approvalId: selectedApproval.id,
      decision: approvalActionType,
      directorNotes: approvalActionType === 'approve' ? 'Approved by Sales Director from dashboard' : 'Held for credit reconciliation',
      user: currentUser
    });
    const newStatusText = approvalActionType === 'approve' ? 'Approved & Released' : 'Held for Payment';
    setApprovals(prev => prev.map(a => a.id === selectedApproval.id ? { ...a, status: newStatusText } : a));
    setIsApprovalModalOpen(false);
    if (approvalActionType === 'approve') {
      toast.success(`Order ${selectedApproval.requestedOrderNumber} for ${selectedApproval.distributorName} approved and released!`);
    } else {
      toast.warning(`Order ${selectedApproval.requestedOrderNumber} for ${selectedApproval.distributorName} held for payment.`);
    }
  };

  const pendingCount = approvals.filter(a => a.status === 'Pending Approval').length;

  const territoryColumns = [
    {
      header: 'Territory & Region',
      accessor: 'territoryName',
      render: (row) => (
        <div>
          <span className="font-bold text-navy-950 text-xs sm:text-sm font-sans">{row.territoryName}</span>
          <div className="text-2xs text-slate-500 mt-0.5">{row.coverage}</div>
          <span className="text-2xs text-terracotta-700 font-semibold">{row.regionalHead}</span>
        </div>
      )
    },
    {
      header: 'Monthly Target',
      accessor: 'targetINR',
      sortValue: (row) => row.targetINR,
      render: (row) => (
        <div className="text-right sm:text-left">
          <span className="font-bold text-xs text-navy-950 font-sans">{formatCurrency(row.targetINR)}</span>
          <div className="text-2xs text-slate-400">Monthly Quota</div>
        </div>
      )
    },
    {
      header: 'Revenue Achieved',
      accessor: 'achievedINR',
      sortValue: (row) => row.achievedINR,
      render: (row) => (
        <div className="text-right sm:text-left">
          <span className="font-bold text-xs sm:text-sm text-navy-950 font-sans">{formatCurrency(row.achievedINR)}</span>
          <div className="text-2xs text-emerald-700 font-semibold">{row.trend}</div>
        </div>
      )
    },
    {
      header: 'Quota %',
      accessor: 'percentage',
      sortValue: (row) => row.percentage,
      render: (row) => {
        let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        if (row.percentage < 90) {
          badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';
        } else if (row.percentage < 100) {
          badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
        }

        return (
          <div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeColor}`}>
              {row.percentage}%
            </span>
            <div className="w-20 bg-slate-100 h-1 rounded-full mt-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full ${row.percentage >= 100 ? 'bg-emerald-500' : row.percentage >= 90 ? 'bg-blue-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(100, row.percentage)}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      header: 'Market Coverage',
      accessor: 'fieldReps',
      render: (row) => (
        <div>
          <span className="text-xs font-semibold text-navy-900">{row.activeDistributors} C&amp;F Distributors</span>
          <div className="text-2xs text-slate-500">{row.fieldReps} MRs · {row.chemistOutreach} Retailers</div>
        </div>
      )
    },
    {
      header: 'Credit Outstanding',
      accessor: 'outstandingCreditINR',
      sortValue: (row) => row.outstandingCreditINR,
      render: (row) => (
        <div className="text-right">
          <span className="font-bold text-xs text-navy-950 font-sans">{formatCurrency(row.outstandingCreditINR)}</span>
          <div className="text-2xs text-slate-400">Active Term</div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Sales Director Leadership Banner - Concise & Clean */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-navy-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-terracotta-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: Identity & Key Metrics */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-amber-400 text-navy-950 shadow-2xs">
                Commercial Leadership
              </span>
              <span className="px-2 py-0.5 rounded-full text-3xs font-semibold bg-white/10 text-slate-200 border border-white/10">
                8 Northeast States
              </span>
              <span className="text-2xs text-slate-400">
                Rupjyoti Bhattacharya · Commercial Desk
              </span>
            </div>

            <h1 className="font-sans font-bold text-lg sm:text-xl text-white tracking-tight">
              Northeast Regional Sales Overview
            </h1>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-300">
              <span>Target: <strong className="text-white font-mono">{formatCurrency(SALES_DIRECTOR_PROFILE.monthlyTargetINR)}</strong></span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span>Achieved: <strong className="text-emerald-400 font-mono">{formatCurrency(SALES_DIRECTOR_PROFILE.achievedMTDINR)}</strong> ({SALES_DIRECTOR_PROFILE.achievementPercentage}%)</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span>Projected: <strong className="text-amber-300 font-mono">{formatCurrency(SALES_DIRECTOR_PROFILE.runRateForecastINR)}</strong></span>
            </div>
          </div>

          {/* Right: Target Gauge & Fast Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Target Progress Pill Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 px-3.5 py-2 rounded-xl text-left min-w-[170px]">
              <div className="flex justify-between items-center text-2xs font-semibold text-slate-300">
                <span>Month Target</span>
                <span className="text-emerald-400 font-bold font-mono">{SALES_DIRECTOR_PROFILE.achievementPercentage}%</span>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all"
                  style={{ width: `${SALES_DIRECTOR_PROFILE.achievementPercentage}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                {SALES_DIRECTOR_PROFILE.daysRemainingInMonth}d left in {SALES_DIRECTOR_PROFILE.currentMonth}
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-row lg:flex-col gap-1.5 shrink-0">
              <Link to="/sales-director/credit-approvals">
                <Button size="xs" className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs py-1.5 px-3 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap">
                  <CreditCard className="w-3.5 h-3.5" />
                  Credit Approvals ({pendingCount})
                </Button>
              </Link>

              <Link to="/sales-director/field-force">
                <Button variant="outline" size="xs" className="w-full border-white/20 hover:bg-white/10 text-white font-medium text-xs py-1.5 px-3 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap">
                  <Users className="w-3.5 h-3.5" />
                  Field Force (48 MRs)
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Commercial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Regional Revenue (MTD)"
          value={formatCurrency(SALES_DIRECTOR_PROFILE.achievedMTDINR)}
          subtitle="All 8 Northeast States"
          icon={TrendingUp}
          trend={{ direction: 'up', value: `+${SALES_DIRECTOR_PROFILE.growthYoY}% YoY Growth` }}
        />
        <StatCard
          title="Monthly Target"
          value={formatCurrency(SALES_DIRECTOR_PROFILE.monthlyTargetINR)}
          subtitle="Dhanuka Board Quota"
          icon={Target}
          trend={{ direction: 'up', value: `${SALES_DIRECTOR_PROFILE.achievementPercentage}% Achieved` }}
        />
        <StatCard
          title="Active Field Force"
          value={`${SALES_DIRECTOR_PROFILE.fieldForceSize} Reps`}
          subtitle="MRs & Area Managers"
          icon={Users}
          trend={{ direction: 'up', value: '94.2% Doctor Calls' }}
        />
        <StatCard
          title="Total Market Credit"
          value="₹1.12 Crores"
          subtitle="14 C&F Distributors"
          icon={CreditCard}
          trend={{ direction: 'neutral', value: '92.4% Within Term' }}
        />
      </div>

      {/* Commercial Credit Approval Queue (Actionable Desk) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-terracotta-600" />
              <h3 className="font-sans font-bold text-base text-navy-950">Pending Distributor Credit Clearance Desk</h3>
              <span className={`px-2 py-0.5 rounded-full text-2xs font-bold border ${
                pendingCount > 0 
                  ? 'bg-rose-100 text-rose-800 border-rose-200' 
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}>
                {pendingCount > 0 ? `${pendingCount} Awaiting Director Sign-off` : 'All Clear (0 Pending)'}
              </span>
            </div>
            <p className="text-2xs sm:text-xs text-slate-500 mt-0.5">
              Review and clear purchase orders that require sales director credit extension or emergency release.
            </p>
          </div>

          <Link to="/sales-director/credit-approvals" className="text-xs font-semibold text-terracotta-700 hover:text-terracotta-800 flex items-center gap-1">
            View All Approvals <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {approvals.map((item) => (
            <div 
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                item.status === 'Approved & Released'
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-2xs'
                  : item.status === 'Held for Payment'
                  ? 'bg-slate-50 border-slate-300 opacity-80'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono font-bold text-xs text-navy-950">{item.requestedOrderNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-2xs font-bold border ${
                    item.status === 'Approved & Released'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : item.status === 'Held for Payment'
                      ? 'bg-slate-200 text-slate-700 border-slate-300'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-navy-900 mt-1">{item.distributorName}</h4>
                <p className="text-2xs text-slate-500">{item.territory} · {item.contactPerson}</p>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 my-2 text-2xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Order Value:</span>
                    <strong className="text-navy-950 font-mono font-bold">{formatCurrency(item.requestedOrderValueINR)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reliability Score:</span>
                    <strong className="text-emerald-700 font-bold">{item.reliabilityScore}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Outstanding:</span>
                    <span className="text-slate-700 font-mono">{formatCurrency(item.currentOutstandingINR)}</span>
                  </div>
                </div>

                <p className="text-2xs text-slate-600 line-clamp-2 italic">
                  "{item.reason}"
                </p>
              </div>

              {item.status === 'Pending Approval' ? (
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    className="flex-1 bg-navy-950 hover:bg-navy-900 text-white font-semibold text-xs py-1.5 flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                    onClick={() => handleActionClick(item, 'approve')}
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Approve Release
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs py-1.5 px-3 border-slate-300 text-slate-600 hover:text-rose-600 hover:border-rose-300 cursor-pointer flex items-center gap-1"
                    onClick={() => handleActionClick(item, 'reject')}
                  >
                    <X className="w-3.5 h-3.5" />
                    Hold
                  </Button>
                </div>
              ) : item.status === 'Approved & Released' ? (
                <div className="bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-center py-2 px-3 rounded-lg text-2xs font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Approved &amp; Released for Picking</span>
                </div>
              ) : (
                <div className="bg-slate-100 border border-slate-300 text-slate-700 text-center py-2 px-3 rounded-lg text-2xs font-semibold flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Held for Credit Reconciliation</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Regional Territory Performance Table */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-navy-900" />
              <h3 className="font-sans font-bold text-base text-navy-950">Northeast Territory Performance Breakdown</h3>
            </div>
            <p className="text-2xs sm:text-xs text-slate-500 mt-0.5">
              Live sales performance across Assam valley and 7 Northeast sister states.
            </p>
          </div>

          <Link to="/sales-director/territories">
            <Button variant="outline" size="sm" className="text-xs font-semibold">
              View Territory Detail
            </Button>
          </Link>
        </div>

        <div className="mt-1">
          <Table
            columns={territoryColumns}
            data={TERRITORY_PERFORMANCE}
            keyField="id"
            keyExtractor={(row) => row.id}
            rowsPerPage={5}
            exportable={false}
            className="border-0 shadow-none rounded-xl"
          />
        </div>
      </div>

      {/* Top Prescribed & Revenue Formulations Grid */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-terracotta-600" />
              <h3 className="font-sans font-bold text-base text-navy-950">Top Revenue Generating Formulations</h3>
            </div>
            <p className="text-2xs sm:text-xs text-slate-500 mt-0.5">
              Leading products driving commercial revenue and hospital tender dispensations.
            </p>
          </div>

          <Link to="/sales-director/products" className="text-xs font-semibold text-terracotta-700 hover:text-terracotta-800 flex items-center gap-1">
            View All Products <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {TOP_PRODUCTS_COMMERCIAL.map((prod) => (
            <div key={prod.skuCode} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-navy-950 text-xs">{prod.skuCode}</span>
                <span className="text-2xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {prod.growthRate} YoY
                </span>
              </div>

              <div>
                <h4 className="font-bold text-xs text-navy-900">{prod.brandName}</h4>
                <p className="text-2xs text-slate-500">{prod.skuName}</p>
              </div>

              <div className="flex justify-between items-baseline pt-1 text-xs">
                <span className="font-bold text-navy-950 font-sans">{formatCurrency(prod.monthlyRevenueINR)}</span>
                <span className="text-2xs text-slate-500">{formatNumber(prod.unitsSold)} units</span>
              </div>

              <p className="text-3xs text-slate-400 font-semibold uppercase tracking-wider">
                {prod.marketPosition}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Decision Confirmation Modal */}
      {isApprovalModalOpen && selectedApproval && (
        <Modal
          isOpen={isApprovalModalOpen}
          onClose={() => setIsApprovalModalOpen(false)}
          title={approvalActionType === 'approve' ? 'Confirm Purchase Order Release' : 'Hold Purchase Order'}
          subtitle={`Order ${selectedApproval.requestedOrderNumber} · ${selectedApproval.distributorName}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs text-slate-700">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Value:</span>
                <strong className="text-navy-950 font-mono font-bold">{formatCurrency(selectedApproval.requestedOrderValueINR)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Outstanding:</span>
                <span className="font-mono text-slate-700">{formatCurrency(selectedApproval.currentOutstandingINR)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Available Headroom After Release:</span>
                <span className="font-mono font-bold text-emerald-700">{formatCurrency(selectedApproval.creditHeadroomAfterOrderINR)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              {approvalActionType === 'approve'
                ? `Authorizing this PO will immediately release consignment loading at Guwahati Central Depot and debit the distributor's 30-day commercial ledger.`
                : `Holding this PO will notify the distributor that further indents require partial ledger clearance or bank remittance confirmation.`}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={() => setIsApprovalModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className={approvalActionType === 'approve' ? 'bg-navy-900 hover:bg-navy-950 text-white font-bold' : 'bg-rose-600 hover:bg-rose-700 text-white font-bold'}
                onClick={handleConfirmDecision}
              >
                {approvalActionType === 'approve' ? 'Confirm & Release PO' : 'Confirm Hold'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
