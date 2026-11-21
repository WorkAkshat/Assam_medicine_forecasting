import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Search,
  Inbox,
  FilterX
} from 'lucide-react';
import Select from './Select';

export default function Table({
  // Declarative API
  columns = [],
  data = [],
  keyExtractor,
  
  // Custom children/headers API fallback
  headers = [],
  children,
  
  // Table features
  title,
  subtitle,
  emptyMessage = 'No records found matching your filters.',
  pageSize: initialPageSize = 10,
  loading = false,
  showPagination = true,
  showSearch = false,
  searchPlaceholder = 'Quick filter table rows...',
  exportable = true,
  exportFilename = 'grd_data_export',
  actions,
  className = '',
  tableClassName = '',
  compact = false
}) {
  const isDeclarative = columns.length > 0;

  // Sorting state
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Table search state
  const [tableSearch, setTableSearch] = useState('');

  // Handle Sort Toggle
  const handleSort = (colIndex) => {
    if (sortKey === colIndex) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(colIndex);
      setSortDirection('asc');
    }
  };

  // Filtered & Sorted Data
  const processedData = useMemo(() => {
    if (!isDeclarative) return [];
    let result = [...data];

    // Quick search filter
    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      result = result.filter(row => {
        return Object.values(row).some(val => {
          if (val === null || val === undefined) return false;
          if (typeof val === 'object') return false;
          return String(val).toLowerCase().includes(q);
        });
      });
    }

    // Sort
    if (sortKey !== null && columns[sortKey]) {
      const col = columns[sortKey];
      result.sort((a, b) => {
        let valA = col.sortValue ? col.sortValue(a) : (col.accessor ? a[col.accessor] : a[Object.keys(a)[sortKey]]);
        let valB = col.sortValue ? col.sortValue(b) : (col.accessor ? b[col.accessor] : b[Object.keys(b)[sortKey]]);

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, columns, sortKey, sortDirection, tableSearch, isDeclarative]);

  // Pagination calculations
  const totalItems = processedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    if (!showPagination || pageSize === -1) return processedData;
    const start = (validCurrentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, validCurrentPage, pageSize, showPagination]);

  // Export CSV Handler
  const handleExportCSV = () => {
    if (!isDeclarative || processedData.length === 0) return;

    // Header labels
    const headers = columns.map(c => typeof c.header === 'string' ? c.header : (c.title || 'Column'));
    
    // Rows
    const rows = processedData.map(row => {
      return columns.map(col => {
        let val = col.exportValue 
          ? col.exportValue(row) 
          : (col.accessor ? row[col.accessor] : '');
        if (val === undefined || val === null) val = '';
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      }).join(',');
    });

    const csvContent = '\uFEFF' + [headers.map(h => `"${h}"`).join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exportFilename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If using children API (legacy layout fallback)
  if (!isDeclarative) {
    return (
      <div className={`w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card ${className}`}>
        <div className="overflow-x-auto">
          <table className={`w-full text-left border-collapse text-xs sm:text-sm ${tableClassName}`}>
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-semibold text-xs tracking-normal">
                {headers.map((h, i) => (
                  <th key={i} className={`py-3.5 px-4 ${h.className || ''}`}>
                    {h.label || h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {children}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Optional Table Toolbar (Title, Search & Export) */}
      {(title || showSearch || actions || (exportable && title)) && (
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
          <div>
            {title && (
              <h3 className="font-sans font-bold text-navy-950 text-base leading-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-2xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {showSearch && (
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={tableSearch}
                  onChange={(e) => {
                    setTableSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-navy-900 bg-white"
                />
              </div>
            )}

            {actions}

            {exportable && title && (
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-navy-950 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-colors"
                title="Download CSV Table Data"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="overflow-x-auto w-full">
        <table className={`w-full text-left border-collapse text-xs sm:text-sm ${tableClassName}`}>
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-semibold text-xs tracking-normal select-none">
              {columns.map((col, idx) => {
                const isSorted = sortKey === idx;
                const canSort = col.sortable !== false;

                const align = col.align || (
                  (col.headerClassName?.includes('text-right') || col.className?.includes('text-right')) ? 'right' :
                  (col.headerClassName?.includes('text-center') || col.className?.includes('text-center')) ? 'center' :
                  'left'
                );
                const justifyClass = align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start';
                const textAlignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

                return (
                  <th 
                    key={idx} 
                    onClick={() => canSort && handleSort(idx)}
                    className={`${compact ? 'py-2 px-2 sm:px-2.5 text-2xs sm:text-xs' : 'py-3 px-4 text-xs sm:text-sm'} font-semibold whitespace-nowrap ${textAlignClass} ${canSort ? 'cursor-pointer hover:bg-slate-100/70 transition-colors' : ''} ${col.headerClassName || ''}`}
                  >
                    <div className={`flex items-center gap-1.5 whitespace-nowrap ${justifyClass}`}>
                      <span>{col.header}</span>
                      {canSort && (
                        <span className="text-slate-400 shrink-0">
                          {isSorted ? (
                            sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-navy-900" /> : <ArrowDown className="w-3.5 h-3.5 text-navy-900" />
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading ? (
              // Loading Skeleton Shimmer
              Array.from({ length: 4 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="py-4 px-4">
                      <div className="h-4 bg-slate-100 rounded-md w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="py-12 px-4 text-center">
                  <div className="max-w-xs mx-auto space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Inbox className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800">{emptyMessage}</p>
                    {tableSearch && (
                      <button
                        onClick={() => setTableSearch('')}
                        className="text-2xs text-terracotta-600 hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        <FilterX className="w-3 h-3" /> Clear table search filter
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              // Real Data Rows
              paginatedData.map((row, rowIdx) => {
                const key = keyExtractor ? keyExtractor(row, rowIdx) : (row.id || rowIdx);
                return (
                  <tr 
                    key={key} 
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {columns.map((col, colIdx) => {
                      const align = col.align || (
                        (col.className?.includes('text-right') || col.headerClassName?.includes('text-right')) ? 'right' :
                        (col.className?.includes('text-center') || col.headerClassName?.includes('text-center')) ? 'center' :
                        'left'
                      );
                      const textAlignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

                      return (
                        <td key={colIdx} className={`${compact ? 'py-2 px-2 sm:px-2.5 text-2xs sm:text-xs' : 'py-3 px-4 text-xs sm:text-sm'} ${textAlignClass} ${col.className || ''}`}>
                          {col.render 
                            ? col.render(row, rowIdx) 
                            : (col.accessor ? row[col.accessor] : null)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {showPagination && totalItems > 0 && (
        <div className="p-3 sm:px-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-2xs text-slate-500 bg-slate-50/40">
          {totalPages <= 1 ? (
            /* Single Page View (Clean, concise, no disabled pagination clutter) */
            <>
              <div className="flex items-center gap-3">
                <span className="text-slate-600">
                  Showing all <strong className="text-navy-950 font-bold">{totalItems}</strong> {totalItems === 1 ? 'entry' : 'entries'}
                </span>

                {/* Show Rows selector only if there are enough total items to paginate (e.g. > 10 items) */}
                {totalItems > 10 && (
                  <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
                    <span>Rows:</span>
                    <Select
                      value={pageSize}
                      onChange={(val) => {
                        setPageSize(Number(val));
                        setCurrentPage(1);
                      }}
                      options={[10, 20, 50, 100]}
                      direction="up"
                      className="py-0.5 px-2 text-2xs min-w-[55px]"
                      dropdownClassName="min-w-[90px]"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/90 border border-slate-200/60 text-slate-600 font-medium text-[11px] tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  All records loaded
                </span>
              </div>
            </>
          ) : (
            /* Multi-Page View (Active pagination with previous/next controls) */
            <>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 text-center sm:text-left">
                <span className="text-slate-600">
                  Showing <strong className="text-navy-950 font-bold">{(validCurrentPage - 1) * pageSize + 1}</strong> to <strong className="text-navy-950 font-bold">{Math.min(validCurrentPage * pageSize, totalItems)}</strong> of <strong className="text-navy-950 font-bold">{totalItems}</strong> entries
                </span>

                <div className="flex items-center gap-1.5 pl-2.5 sm:pl-3 border-l border-slate-200">
                  <span>Rows:</span>
                  <Select
                    value={pageSize}
                    onChange={(val) => {
                      setPageSize(Number(val));
                      setCurrentPage(1);
                    }}
                    options={[10, 20, 50, 100]}
                    direction="up"
                    className="py-0.5 px-2 text-2xs min-w-[55px]"
                    dropdownClassName="min-w-[90px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  disabled={validCurrentPage === 1}
                  className="p-1 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed text-slate-600 transition-colors cursor-pointer shadow-2xs"
                  title="First Page"
                  aria-label="First Page"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={validCurrentPage === 1}
                  className="p-1 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed text-slate-600 transition-colors cursor-pointer shadow-2xs"
                  title="Previous Page"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <span className="px-2.5 py-0.5 font-medium text-slate-600 text-2xs">
                  Page <strong className="font-bold text-navy-950">{validCurrentPage}</strong> of <strong className="font-semibold text-slate-800">{totalPages}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={validCurrentPage >= totalPages}
                  className="p-1 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed text-slate-600 transition-colors cursor-pointer shadow-2xs"
                  title="Next Page"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={validCurrentPage >= totalPages}
                  className="p-1 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed text-slate-600 transition-colors cursor-pointer shadow-2xs"
                  title="Last Page"
                  aria-label="Last Page"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
