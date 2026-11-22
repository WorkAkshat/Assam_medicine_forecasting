import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
  type = 'button',
  className = ''
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none gap-2 whitespace-nowrap shrink-0';

  const variants = {
    primary: 'bg-navy-900 hover:bg-navy-800 text-white shadow-sm',
    accent: 'bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-sm',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm',
    outline: 'bg-transparent hover:bg-navy-50 text-navy-900 border border-navy-200',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
  };

  const sizes = {
    xs: 'text-2xs px-2 py-1 rounded-lg gap-1',
    sm: 'text-xs px-2.5 py-1.5 rounded-lg',
    md: 'text-xs sm:text-sm px-3.5 py-2 rounded-xl',
    lg: 'text-sm sm:text-base px-5 py-2.5 rounded-xl'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && iconPosition === 'left' && <Icon className={`${size === 'xs' ? 'w-3.5 h-3.5' : 'w-4 h-4'} shrink-0`} />}
      <span className="inline-flex items-center gap-1.5">{children}</span>
      {Icon && iconPosition === 'right' && <Icon className={`${size === 'xs' ? 'w-3.5 h-3.5' : 'w-4 h-4'} shrink-0`} />}
    </button>
  );
}
