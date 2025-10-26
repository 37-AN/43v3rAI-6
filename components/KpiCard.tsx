import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
import type { Kpi } from '../types';

export const KpiCard: React.FC<Kpi> = ({ title, value, change, icon: Icon, trend }) => {
  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;

  // Gradient colors based on KPI type
  const getGradient = () => {
    if (title.includes('Revenue')) return 'from-accent-green to-brand-500';
    if (title.includes('Customers')) return 'from-accent-purple to-brand-600';
    if (title.includes('Conversion')) return 'from-accent-cyan to-brand-500';
    if (title.includes('Growth')) return 'from-accent-orange to-accent-yellow';
    return 'from-brand-500 to-brand-600';
  };

  return (
    <div className="group relative">
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${getGradient()} rounded-xl opacity-20 blur group-hover:opacity-30 transition duration-300`}></div>

      {/* Card content */}
      <div className="relative bg-dark-900 border border-dark-800 rounded-xl p-6 hover:border-dark-700 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${getGradient()} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
            isPositive ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-orange/10 text-accent-orange'
          }`}>
            <TrendIcon className="h-3 w-3" />
            <span>{change}</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-dark-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>

        {/* Mini chart placeholder */}
        <div className="mt-4 h-12 flex items-end space-x-1">
          {[40, 60, 35, 70, 55, 80, 65, 90].map((height, i) => (
            <div
              key={i}
              className={`flex-1 bg-gradient-to-t ${getGradient()} rounded-t opacity-50 group-hover:opacity-70 transition-all duration-300`}
              style={{ height: `${height}%` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
