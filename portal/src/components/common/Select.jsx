import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function Select({
  value,
  onChange,
  options = [],
  icon: Icon,
  placeholder = 'Select option...',
  className = '',
  dropdownClassName = '',
  direction = 'down',
  align = 'left',
  size = 'sm'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize options: can be strings ['All', 'Assam'] or objects [{ value: 'All', label: 'All States' }]
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt, label: String(opt) };
    }
    return { value: opt.value, label: opt.label || opt.name || String(opt.value) };
  });

  const selectedOption = normalizedOptions.find(opt => String(opt.value) === String(value));
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Esc key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const isFullWidth = className.includes('w-full');
  const roundedClass = isFullWidth ? 'rounded-xl px-3 py-2' : 'rounded-full px-3.5 py-1.5';

  return (
    <div className={`relative ${isFullWidth ? 'w-full block' : 'inline-block'} text-left`} ref={dropdownRef}>
      {/* Trigger Button - Pill Rounded by Default to match user reference */}
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex items-center gap-1.5 bg-white border border-slate-200 ${roundedClass} text-xs font-semibold text-slate-700 shadow-2xs hover:border-slate-300 hover:bg-slate-50/80 focus:outline-none transition-all cursor-pointer ${
          isOpen ? 'ring-2 ring-navy-900/10 border-navy-900 bg-slate-50' : ''
        } ${className}`}
      >
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
        <span className={`truncate text-left ${isFullWidth ? 'flex-1' : 'max-w-[200px]'}`}>{displayLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
          isOpen ? 'rotate-180 text-navy-950' : ''
        }`} />
      </button>

      {/* Rounded Custom Dropdown Menu */}
      {isOpen && (
        <div 
          role="listbox"
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} ${direction === 'up' ? 'bottom-full mb-1.5 slide-in-from-bottom-1' : 'top-full mt-1.5 slide-in-from-top-1'} ${isFullWidth ? 'w-full min-w-full' : 'min-w-[190px] w-max max-w-[calc(100vw-32px)]'} bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${dropdownClassName}`}
        >
          <div className="max-h-64 overflow-y-auto space-y-1 pr-0.5 custom-scrollbar">
            {normalizedOptions.map((opt) => {
              const isSelected = String(opt.value) === String(value);

              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    if (typeof onChange === 'function') {
                      try {
                        onChange(opt.value);
                      } catch {
                        // Fallback if caller callback expects a synthetic event with e.target.value
                        onChange({ target: { value: opt.value, name: opt.label } });
                      }
                    }
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-navy-950 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-navy-950'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
