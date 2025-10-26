// src/components/Dashboard.tsx
import React from 'react';
import { useMetrics } from '../hooks/useMetrics';
import { KpiCard } from './KpiCard';
import { AIChatPanel } from './AIChatPanel';

export function Dashboard() {
  const metrics = useMetrics();
  const { revenue, customers, api_calls, uptime, mqls, loading, error, refetch } = metrics;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00b4d8] mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-semibold text-white text-lg">Error loading dashboard</p>
          <p className="text-sm mt-2 text-gray-400">{error}</p>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-[#00b4d8] text-white rounded-lg hover:bg-[#0090a8] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare dashboard data for AI context
  const dashboardData = {
    revenue,
    customers,
    api_calls,
    uptime,
    mqls
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Unified Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Real-time insights powered by AI
          </p>
        </div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-[#1e2a35] text-gray-300 rounded-lg hover:bg-[#2a3845] transition-colors flex items-center space-x-2"
          title="Refresh metrics"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Revenue"
          value={`$${(revenue.value / 1000000).toFixed(1)}M`}
          change={`${revenue.growth_rate && revenue.growth_rate > 0 ? '+' : ''}${revenue.growth_rate?.toFixed(1) || 0}%`}
          isPositive={revenue.growth_rate ? revenue.growth_rate > 0 : false}
        />
        <KpiCard
          title="Total Customers"
          value={customers.value.toLocaleString()}
          change={`${customers.growth_rate && customers.growth_rate > 0 ? '+' : ''}${customers.growth_rate?.toFixed(1) || 0}% (${customers.new_this_month || 0} new)`}
          isPositive={customers.growth_rate ? customers.growth_rate > 0 : false}
        />
        <KpiCard
          title="API Calls"
          value={(api_calls.value / 1000000).toFixed(2) + 'M'}
          change={`${api_calls.change_percent && api_calls.change_percent > 0 ? '+' : ''}${api_calls.change_percent?.toFixed(1) || 0}%`}
          isPositive={api_calls.change_percent ? api_calls.change_percent > 0 : false}
        />
        <KpiCard
          title="System Uptime"
          value={`${uptime.value?.toFixed(1) || 0}%`}
          change={`${uptime.change_percent && uptime.change_percent > 0 ? '+' : ''}${uptime.change_percent?.toFixed(1) || 0}%`}
          isPositive={uptime.change_percent ? uptime.change_percent > 0 : false}
        />
      </div>

      {/* Marketing Qualified Leads Card */}
      <div className="bg-[#0f1419] border border-[#1e2a35] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Marketing Qualified Leads</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-400">Total MQLs</p>
            <p className="text-2xl font-bold text-white">{mqls.value || 0}</p>
            <p className={`text-sm ${mqls.change_percent && mqls.change_percent > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {mqls.change_percent && mqls.change_percent > 0 ? '+' : ''}{mqls.change_percent?.toFixed(1) || 0}%
            </p>
          </div>
          {mqls.channels && (
            <>
              <div>
                <p className="text-sm text-gray-400">Organic</p>
                <p className="text-2xl font-bold text-white">{mqls.channels.organic || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Paid</p>
                <p className="text-2xl font-bold text-white">{mqls.channels.paid || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Referral</p>
                <p className="text-2xl font-bold text-white">{mqls.channels.referral || 0}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* AI Chat Panel */}
      <div className="h-[600px]">
        <AIChatPanel dashboardData={dashboardData} />
      </div>
    </div>
  );
}
