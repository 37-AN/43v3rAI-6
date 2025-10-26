import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { KpiCard } from './components/KpiCard';
import { RevenueChart } from './components/RevenueChart';
import { LeadSourceChart } from './components/LeadSourceChart';
import { AiInsight } from './components/AiInsight';
import { Workflows } from './components/Workflows';
import { Architecture } from './components/Architecture';
import { Settings } from './components/Settings';
import { sendChatMessage } from './services/geminiService';
import { KPI_DATA, REVENUE_DATA, LEAD_SOURCE_DATA, CONNECTORS_DATA } from './constants';
import type { Kpi, RevenueData, LeadSource, Connector, ChatMessage, ActiveView } from './types';
import { SparklesIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [kpis, setKpis] = useState<Kpi[]>(KPI_DATA);
  const [revenueData, setRevenueData] = useState<RevenueData[]>(REVENUE_DATA);
  const [leadSourceData, setLeadSourceData] = useState<LeadSource[]>(LEAD_SOURCE_DATA);
  const [connectors, setConnectors] = useState<Connector[]>(CONNECTORS_DATA);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const hasFetchedInitialInsight = useRef(false);

  const getDashboardData = useCallback(() => {
    return { kpis, revenueData, leadSourceData };
  }, [kpis, revenueData, leadSourceData]);

  useEffect(() => {
    if (hasFetchedInitialInsight.current) return;
    hasFetchedInitialInsight.current = true;

    const fetchInitialInsight = async () => {
      setError(null);
      try {
        const initialMessage = 'Provide a summary of the current business performance.';
        const dashboardData = getDashboardData();
        const firstInsight = await sendChatMessage(dashboardData, initialMessage);
        setMessages([{ sender: 'ai', text: firstInsight }]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        console.error(err);
      } finally {
        setIsAiTyping(false);
      }
    };
    
    fetchInitialInsight();
  }, [getDashboardData]);

  const handleSendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isAiTyping) return;

    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: userMessage }];
    setMessages(newMessages);
    setIsAiTyping(true);
    setError(null);

    try {
        const dashboardData = getDashboardData();
        const aiResponse = await sendChatMessage(dashboardData, userMessage);
        setMessages([...newMessages, { sender: 'ai', text: aiResponse }]);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        console.error(err);
    } finally {
        setIsAiTyping(false);
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-dark-400">Real-time analytics and insights for your business</p>
              </div>
              <div className="flex items-center space-x-2">
                <select className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi) => (
                <KpiCard key={kpi.title} {...kpi} />
              ))}
            </div>

            {/* Charts and Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Charts Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-dark-900 border border-dark-800 rounded-xl p-6 hover:border-dark-700 transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Revenue Trend</h2>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-dark-400">Compare:</span>
                      <button className="px-3 py-1 bg-dark-800 rounded-lg text-white hover:bg-dark-700 transition">Week</button>
                      <button className="px-3 py-1 text-dark-400 hover:text-white transition">Month</button>
                    </div>
                  </div>
                  <div className="h-80">
                    <RevenueChart data={revenueData} />
                  </div>
                </div>

                <div className="bg-dark-900 border border-dark-800 rounded-xl p-6 hover:border-dark-700 transition-all duration-300">
                  <h2 className="text-xl font-semibold text-white mb-6">Lead Sources Distribution</h2>
                  <div className="h-80">
                    <LeadSourceChart data={leadSourceData} />
                  </div>
                </div>
              </div>

              {/* AI Insights Column */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 bg-dark-900 border border-dark-800 rounded-xl p-6 hover:border-dark-700 transition-all duration-300 h-[calc(100vh-120px)]">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="p-2 bg-gradient-to-br from-brand-500 to-accent-purple rounded-lg">
                      <SparklesIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
                      <p className="text-xs text-dark-400">Powered by Gemini</p>
                    </div>
                  </div>
                  <AiInsight
                    messages={messages}
                    isTyping={isAiTyping}
                    error={error}
                    onSendMessage={handleSendMessage}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'workflows':
        return <Workflows />;
      case 'architecture':
        return <Architecture />;
      case 'settings':
        return <Settings connectors={connectors} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex h-screen bg-dark-950 font-sans overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;