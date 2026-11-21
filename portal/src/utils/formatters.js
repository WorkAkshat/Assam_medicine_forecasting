// formatters.js - Data Formatting Utilities for PharmaPredict Portal
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakhs`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

export const formatPercent = (val) => {
  if (val === undefined || val === null) return '0%';
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${val.toFixed(1)}%`;
};

export const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'optimal':
    case 'active':
    case 'delivered':
    case 'completed':
    case 'target achieved (on track)':
    case 'target exceeded (pilot stage)':
    case 'excellent (compliant)':
    case 'compliant':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'low stock':
    case 'moderate':
    case 'pending review':
    case 'pending approval':
    case 'partially fulfilled':
    case 'watchlist (60-90 days)':
    case 'near destination':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'stockout risk':
    case 'critical':
    case 'critical risk':
    case 'critical delay risk':
    case 'delayed':
    case 'near expiry (<30 days)':
    case 'expired (quarantine required)':
    case 'high delay risk':
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    case 'excess stock':
    case 'excess':
    case 'approved':
    case 'dispatched':
    case 'in transit (on schedule)':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    default:
      return 'bg-slate-50 text-slate-700 border border-slate-200';
  }
};

export const getStatusBadgeVariant = (status) => {
  const s = status?.toLowerCase() || '';
  if (['optimal', 'active', 'delivered', 'completed', 'compliant', 'good'].some(k => s.includes(k))) return 'success';
  if (['low', 'moderate', 'pending', 'watchlist', 'warning'].some(k => s.includes(k))) return 'warning';
  if (['critical', 'stockout', 'delayed', 'expired', 'danger'].some(k => s.includes(k))) return 'danger';
  if (['dispatched', 'in transit', 'approved', 'excess'].some(k => s.includes(k))) return 'info';
  return 'neutral';
};

export const exportToCSV = (headers, rows, filename = 'grd_export') => {
  const csvContent = '\uFEFF' + [
    headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','),
    ...rows.map(row => row.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

