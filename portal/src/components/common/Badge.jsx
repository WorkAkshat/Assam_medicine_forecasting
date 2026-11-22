import React from 'react';
import { getStatusBadgeClass } from '../../utils/formatters';

export default function Badge({ 
  children, 
  status, 
  variant, 
  dot = false, 
  size = 'sm',
  className = '' 
}) {
  let styleClass = '';

  if (variant) {
    switch (variant) {
      case 'success':
        styleClass = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
        break;
      case 'warning':
        styleClass = 'bg-amber-50 text-amber-800 border-amber-200/80';
        break;
      case 'danger':
      case 'critical':
        styleClass = 'bg-rose-50 text-rose-800 border-rose-200/80';
        break;
      case 'info':
        styleClass = 'bg-blue-50 text-blue-800 border-blue-200/80';
        break;
      default:
        styleClass = 'bg-slate-100 text-slate-700 border-slate-200';
    }
  } else if (status) {
    styleClass = getStatusBadgeClass(status);
  } else if (typeof children === 'string') {
    styleClass = getStatusBadgeClass(children);
  } else {
    styleClass = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  const sizeClasses = size === 'xs' 
    ? 'px-2 py-0.2 text-[10px]' 
    : size === 'md' 
    ? 'px-3 py-1 text-xs' 
    : 'px-2.5 py-0.5 text-2xs sm:text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-2xs tracking-wide whitespace-nowrap ${sizeClasses} ${styleClass} ${className}`}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-pulse" />
      )}
      <span>{children || status}</span>
    </span>
  );
}
