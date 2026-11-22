import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle,
  subvalue,
  change,
  isPositive,
  trend,
  icon: Icon,
  badge,
  badgeColor,
  className = ''
}) {
  // Normalize badge
  const badgeText = typeof badge === 'object' && badge !== null ? badge.text : badge;
  const badgeVariant = typeof badge === 'object' && badge !== null ? badge.variant : null;

  const getBadgeClasses = () => {
    if (badgeColor) return badgeColor;
    switch (badgeVariant) {
      case 'danger':
      case 'critical':
        return 'bg-rose-50 text-rose-800 border border-rose-200';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border border-amber-200';
      case 'success':
        return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
      case 'info':
        return 'bg-blue-50 text-blue-800 border border-blue-200';
      default:
        return 'bg-navy-50 text-navy-800 border border-navy-100';
    }
  };

  // Normalize trend
  const hasTrend = !!trend;
  const trendDir = trend?.direction || (isPositive ? 'up' : isPositive === false ? 'down' : 'neutral');
  const trendText = trend?.text || change;
  const isTrendGood = trend?.isGood !== undefined ? trend.isGood : (trendDir === 'up' && !title?.toLowerCase().includes('risk') && !title?.toLowerCase().includes('stockout') && !title?.toLowerCase().includes('loss'));

  return (
    <div className={`portal-card portal-card-hover p-4 sm:p-5 flex flex-col justify-between min-h-[148px] transition-all bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md ${className}`}>
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 font-sans tracking-tight">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-sans text-navy-950 tracking-tight">
                {value}
              </span>
              {subvalue && (
                <span className="text-xs text-slate-500 font-normal">
                  {subvalue}
                </span>
              )}
            </div>
          </div>
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center shrink-0 border border-navy-100/80 shadow-sm">
              <Icon className="w-5 h-5 text-navy-800" />
            </div>
          )}
        </div>

        {subtitle && !subvalue && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-1 leading-normal">
            {subtitle}
          </p>
        )}
      </div>

      {(trendText || badgeText) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
          {trendText ? (
            <div className={`inline-flex items-center gap-1.5 font-semibold text-xs truncate shrink min-w-0 ${
              trendDir === 'neutral'
                ? 'text-slate-600'
                : isTrendGood ? 'text-emerald-700' : 'text-rose-700'
            }`}>
              {trendDir === 'up' ? (
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              ) : trendDir === 'down' ? (
                <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
              )}
              <span className="truncate">{trendText}</span>
            </div>
          ) : <div />}

          {badgeText && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 whitespace-nowrap ml-auto ${getBadgeClasses()}`}>
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
