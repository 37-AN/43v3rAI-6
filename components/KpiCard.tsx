
import React from 'react';
import type { Kpi } from '../types';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

export const KpiCard: React.FC<Kpi> = ({ title, value, change, changeType, icon: Icon }) => {
  const isIncrease = changeType === 'increase';
  const changeColor = isIncrease ? 'text-brand-green' : 'text-brand-red';

  return (
    <div className="bg-brand-secondary p-5 rounded-xl shadow-lg transition-transform hover:scale-105 duration-300">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <p className="text-sm text-brand-light font-medium">{title}</p>
          <p className="text-3xl font-bold text-brand-text mt-1">{value}</p>
        </div>
        <div className="bg-brand-accent p-3 rounded-full">
          <Icon className="h-6 w-6 text-brand-text" />
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-1">
        <div className={`flex items-center text-sm font-semibold ${changeColor}`}>
          {isIncrease ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
          <span>{change}</span>
        </div>
        <span className="text-xs text-brand-light">vs last month</span>
      </div>
    </div>
  );
};
