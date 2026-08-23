import React from 'react';
import { ProduceCondition } from '../types';

interface ConditionBadgeProps {
  condition: ProduceCondition;
  size?: 'sm' | 'md' | 'lg';
}

export const ConditionBadge: React.FC<ConditionBadgeProps> = ({ condition, size = 'md' }) => {
  const configs = {
    Excellent: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500 shadow-sm shadow-emerald-500/50',
      label: 'Excellent'
    },
    Good: {
      bg: 'bg-lime-50 text-lime-800 border-lime-200',
      dot: 'bg-lime-500 shadow-sm shadow-lime-500/50',
      label: 'Good'
    },
    Average: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500 shadow-sm shadow-amber-500/50',
      label: 'Average'
    },
    Poor: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-rose-500 shadow-sm shadow-rose-500/50',
      label: 'Poor'
    }
  };

  const config = configs[condition] || configs.Good;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs font-semibold px-2.5 py-1 gap-2',
    lg: 'text-sm font-bold px-3 py-1.5 gap-2.5'
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses[size]}`}>
      <span className={`rounded-full ${config.dot} ${dotSizes[size]} animate-pulse`} />
      <span>{config.label}</span>
    </span>
  );
};
