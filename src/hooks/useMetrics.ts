// src/hooks/useMetrics.ts
import { useState, useEffect, useCallback } from 'react';

interface MetricValue {
  value: number;
  growth_rate?: number;
  change_percent?: number;
  new_this_month?: number;
  retention_rate?: number;
  churn_rate?: number;
  previous_value?: number;
  chart_data?: any[];
  [key: string]: any;
}

interface Metrics {
  revenue: MetricValue;
  customers: MetricValue;
  api_calls: MetricValue;
  uptime: MetricValue;
  mqls: MetricValue;
  loading: boolean;
  error: string | null;
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    revenue: { value: 0, growth_rate: 0 },
    customers: { value: 0, new_this_month: 0, growth_rate: 0 },
    api_calls: { value: 0, change_percent: 0 },
    uptime: { value: 0, change_percent: 0 },
    mqls: { value: 0, change_percent: 0 },
    loading: true,
    error: null
  });

  const fetchMetrics = useCallback(async () => {
    try {
      setMetrics(prev => ({ ...prev, loading: true, error: null }));

      // Get backend URL from environment or use default
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

      // Fetch from real API
      const response = await fetch(`${backendUrl}/api/v1/metrics/dashboard`, {
        headers: {
          'Content-Type': 'application/json',
          // Add auth token if available
          ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      setMetrics({
        revenue: data.revenue || { value: 0, growth_rate: 0 },
        customers: data.customers || { value: 0, new_this_month: 0, growth_rate: 0 },
        api_calls: data.api_calls || { value: 0, change_percent: 0 },
        uptime: data.uptime || { value: 0, change_percent: 0 },
        mqls: data.mqls || { value: 0, change_percent: 0 },
        loading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Error fetching metrics:', error);
      setMetrics(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch metrics'
      }));
    }
  }, []);

  useEffect(() => {
    fetchMetrics();

    // Refresh every 5 minutes
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchMetrics]);

  return { ...metrics, refetch: fetchMetrics };
}

// Hook for fetching specific metric history
export function useMetricHistory(metricId: string, period: string = '30d') {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

        const response = await fetch(
          `${backendUrl}/api/v1/metrics/${metricId}/history?period=${period}`,
          {
            headers: {
              'Content-Type': 'application/json',
              ...(localStorage.getItem('token') && {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              })
            }
          }
        );

        if (!response.ok) throw new Error('Failed to fetch metric history');

        const result = await response.json();
        setData(result.history || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching metric history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (metricId) {
      fetchHistory();
    }
  }, [metricId, period]);

  return { data, loading, error };
}
