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
import { SparklesIcon } from '@heroicons/react/24/outline';

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
          <div className="container mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-brand-text mb-6">Unified Dashboard</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
              {kpis.map((kpi) => (
                <KpiCard key={kpi.title} {...kpi} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-brand-secondary p-4 md:p-6 rounded-xl shadow-lg h-80">
                  <h2 className="text-xl font-semibold text-brand-text mb-4">Revenue Over Time</h2>
                  <RevenueChart data={revenueData} />
                </div>
                <div className="bg-brand-secondary p-4 md:p-6 rounded-xl shadow-lg h-80">
                  <h2 className="text-xl font-semibold text-brand-text mb-4">Lead Sources</h2>
                  <LeadSourceChart data={leadSourceData} />
                </div>
              </div>

              <div className="lg:col-span-1 flex flex-col">
                <div className="bg-brand-secondary p-4 md:p-6 rounded-xl shadow-lg flex-grow flex flex-col">
                  <h2 className="text-xl font-semibold text-brand-text mb-4 flex items-center shrink-0">
                    <SparklesIcon className="h-6 w-6 text-brand-cyan mr-2" />
                    AI-Powered Insight
                  </h2>
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
    <div className="flex h-screen bg-brand-primary font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-primary p-4 md:p-8">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default App;