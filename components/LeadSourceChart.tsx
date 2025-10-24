
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { LeadSource } from '../types';

interface LeadSourceChartProps {
  data: LeadSource[];
}

export const LeadSourceChart: React.FC<LeadSourceChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#415A77" horizontal={false} />
        <XAxis type="number" stroke="#778DA9" />
        <YAxis dataKey="name" type="category" stroke="#778DA9" width={100} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1B263B',
            border: '1px solid #415A77',
            color: '#E0E1DD'
          }}
          cursor={{ fill: 'rgba(119, 141, 169, 0.2)' }}
        />
        <Bar dataKey="value" name="Leads" barSize={20} radius={[0, 10, 10, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
