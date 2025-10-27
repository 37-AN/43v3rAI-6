import React from 'react';
import { ChartPieIcon, AdjustmentsHorizontalIcon, Cog6ToothIcon, QuestionMarkCircleIcon, ArrowLeftOnRectangleIcon, ServerStackIcon } from '@heroicons/react/24/outline';
import type { ActiveView } from '../types';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={!onClick} 
      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors w-full text-left ${active ? 'bg-brand-accent text-brand-text' : 'text-brand-light hover:bg-brand-accent/50 hover:text-brand-text'} ${!onClick ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <Icon className="h-6 w-6" />
      <span className="font-medium">{label}</span>
    </button>
  );
};

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="hidden lg:flex w-64 bg-brand-secondary flex-col p-4 space-y-2">
      <div className="flex-1">
        <nav className="space-y-2">
          <NavItem icon={ChartPieIcon} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
          <NavItem icon={Cog6ToothIcon} label="Workflows" active={activeView === 'workflows'} onClick={() => setActiveView('workflows')} />
          <NavItem icon={ServerStackIcon} label="Architecture" active={activeView === 'architecture'} onClick={() => setActiveView('architecture')} />
          <NavItem icon={AdjustmentsHorizontalIcon} label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
        </nav>
      </div>
      <div className="space-y-2">
        <NavItem icon={QuestionMarkCircleIcon} label="Support" />
        <NavItem icon={ArrowLeftOnRectangleIcon} label="Logout" />
      </div>
    </div>
  );
};