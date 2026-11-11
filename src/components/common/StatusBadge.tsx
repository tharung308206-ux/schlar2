import React from 'react';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'primary';

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  size = 'sm',
  showDot = true,
  className = ''
}) => {
  // Infer variant if not provided
  const resolvedVariant: BadgeVariant = variant || (() => {
    const s = status.toLowerCase();
    if (['active', 'present', 'paid', 'approved', 'completed', 'balanced', 'on track'].includes(s)) {
      return 'success';
    }
    if (['pending', 'upcoming', 'draft', 'submitted', 'on leave', 'grace period'].includes(s)) {
      return 'warning';
    }
    if (['inactive', 'absent', 'overdue', 'late', 'failed', 'suspended', 'high load'].includes(s)) {
      return 'danger';
    }
    if (['issued', 'in transit', 'interview scheduled', 'enrolled'].includes(s)) {
      return 'info';
    }
    return 'neutral';
  })();

  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dot: string }> = {
    success: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200/80',
      dot: 'bg-emerald-500'
    },
    warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200/80',
      dot: 'bg-amber-500'
    },
    danger: {
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200/80',
      dot: 'bg-rose-500'
    },
    info: {
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-200/80',
      dot: 'bg-sky-500'
    },
    primary: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200/80',
      dot: 'bg-blue-500'
    },
    neutral: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200/80',
      dot: 'bg-slate-400'
    }
  };

  const style = variantStyles[resolvedVariant];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${style.bg} ${style.text} ${style.border} ${sizeClasses} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} aria-hidden="true" />}
      <span>{status}</span>
    </span>
  );
};
