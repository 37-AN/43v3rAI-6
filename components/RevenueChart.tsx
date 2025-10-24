
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { RevenueData } from '../types';

interface RevenueChartProps {
  data: RevenueData[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00F5D4" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#00F5D4" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#415A77" />
        <XAxis dataKey="name" stroke="#778DA9" />
        <YAxis stroke="#778DA9" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1B263B',
            border: '1px solid #415A77',
            color: '#E0E1DD'
          }}
          itemStyle={{ color: '#E0E1DD' }}
        />
        <Area type="monotone" dataKey="revenue" stroke="#00F5D4" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
};
