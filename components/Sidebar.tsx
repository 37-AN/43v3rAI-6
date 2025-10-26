import React from 'react';
import {
  ChartPieIcon,
  Cog6ToothIcon,
  ServerStackIcon,
  HomeIcon,
  ChartBarIcon,
  CubeIcon,
  BoltIcon,
  LifebuoyIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import type { ActiveView } from '../types';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick, badge }) => {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`group relative flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-left ${
        active
          ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/20'
          : 'text-dark-300 hover:text-white hover:bg-dark-800'
      } ${!onClick ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <Icon className={`h-5 w-5 transition-transform duration-200 ${active ? '' : 'group-hover:scale-110'}`} />
      <span className="font-medium text-sm">{label}</span>
      {badge && (
        <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-accent-pink text-white">
          {badge}
        </span>
      )}
      {active && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-white rounded-l-full"></div>
      )}
    </button>
  );
};

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="hidden lg:flex w-64 bg-dark-900 border-r border-dark-800 flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-dark-800">
        <div className="flex items-center space-x-2 px-3 py-2">
          <div className="h-2 w-2 bg-accent-green rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Navigation</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-wider">Main</h3>
          </div>
          <NavItem
            icon={ChartPieIcon}
            label="Dashboard"
            active={activeView === 'dashboard'}
            onClick={() => setActiveView('dashboard')}
          />
          <NavItem
            icon={ChartBarIcon}
            label="Analytics"
            badge="New"
          />
          <NavItem
            icon={CubeIcon}
            label="Data Sources"
          />
        </div>

        <div className="pt-6 space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-dark-500 uppercase tracking-wider">Platform</h3>
          </div>
          <NavItem
            icon={Cog6ToothIcon}
            label="Workflows"
            active={activeView === 'workflows'}
            onClick={() => setActiveView('workflows')}
          />
          <NavItem
            icon={ServerStackIcon}
            label="Architecture"
            active={activeView === 'architecture'}
            onClick={() => setActiveView('architecture')}
          />
          <NavItem
            icon={BoltIcon}
            label="Settings"
            active={activeView === 'settings'}
            onClick={() => setActiveView('settings')}
          />
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-dark-800 space-y-1">
        <NavItem icon={LifebuoyIcon} label="Help & Support" />
        <NavItem icon={ArrowRightOnRectangleIcon} label="Sign Out" />

        {/* Status Card */}
        <div className="mt-4 p-3 bg-gradient-to-br from-brand-500/10 to-accent-purple/10 border border-brand-500/20 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-8 w-8 bg-gradient-to-br from-brand-500 to-accent-purple rounded-lg flex items-center justify-center">
              <BoltIcon className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-white">System Status</p>
              <p className="text-xs text-dark-400">All systems operational</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-dark-400">Uptime:</span>
            <span className="text-accent-green font-semibold">99.9%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
