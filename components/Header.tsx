import React from 'react';
import { BellIcon, UserCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const Header: React.FC = () => {
  return (
    <header className="bg-dark-900/95 backdrop-blur-sm border-b border-dark-700/50 sticky top-0 z-50">
      <div className="mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-accent-purple blur-md opacity-50"></div>
                <div className="relative bg-gradient-to-br from-brand-500 to-brand-600 p-2 rounded-xl">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">UnifiedAI</h1>
                <p className="text-xs text-dark-400">Enterprise Platform</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search dashboards, metrics, data..."
                className="w-full bg-dark-800 border border-dark-700 rounded-lg py-2 pl-10 pr-4 text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg transition-all duration-200">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-accent-pink rounded-full ring-2 ring-dark-900"></span>
            </button>

            {/* User Profile */}
            <button className="flex items-center space-x-3 p-2 hover:bg-dark-800 rounded-lg transition-all duration-200">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-dark-400">admin@unifiedai.com</p>
              </div>
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center ring-2 ring-dark-700">
                  <span className="text-sm font-semibold text-white">AU</span>
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-accent-green rounded-full ring-2 ring-dark-900"></span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
