
import React from 'react';
import type { Connector } from '../types';

export const ConnectorStatus: React.FC<Connector> = ({ name, status, iconUrl }) => {
  const statusIndicator = {
    Connected: 'bg-brand-green',
    Syncing: 'bg-brand-yellow',
    Error: 'bg-brand-red',
  };

  const statusTextColor = {
    Connected: 'text-brand-green',
    Syncing: 'text-brand-yellow',
    Error: 'text-brand-red',
  };

  return (
    <div className="flex items-center justify-between p-3 bg-brand-primary rounded-lg">
      <div className="flex items-center space-x-3">
        <img src={iconUrl} alt={`${name} logo`} className="h-8 w-8 object-contain" />
        <span className="font-medium text-brand-text">{name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className={`h-2.5 w-2.5 rounded-full ${statusIndicator[status]}`}></div>
        <span className={`text-sm font-semibold ${statusTextColor[status]}`}>{status}</span>
      </div>
    </div>
  );
};
