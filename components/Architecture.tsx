import React from 'react';
import {
  CircleStackIcon,
  CpuChipIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';

const unifiedAiPillars = [
  {
    name: 'Unified Data Engine',
    description: 'Connects, cleans, and structures all enterprise data. Features multi-source ingestion, auto-ETL, and semantic unification for AI training.',
    icon: CircleStackIcon,
  },
  {
    name: 'Model Orchestrator',
    description: 'Fine-tunes foundation models (Gemini, Llama, Claude) and routes queries to the best open or closed-source model for the task.',
    icon: CpuChipIcon,
  },
  {
    name: 'Agentic Workspace',
    description: 'Builds domain-specific AI copilots and agents that continuously learn from user interactions, automating workflows across business tools.',
    icon: SparklesIcon,
  },
  {
    name: 'Evaluation Layer (SEAL)',
    description: 'Ensures model safety, accuracy, and alignment for enterprise use cases through rigorous RLHF and in-house evaluation labs.',
    icon: ShieldCheckIcon,
  },
];

const roadmapData = [
    { phase: 1, title: 'MVP Build', duration: '0-3 Months', deliverables: ['Core Backend & Auth', 'Integrations: GDrive, SQL, Slack', 'Dashboard UI & AI Chat', 'Basic Data Unification'] },
    { phase: 2, title: 'AI Knowledge Graph', duration: '3-6 Months', deliverables: ['Data Embedding & Semantic Search', 'Custom AI Summarization', 'Predictive Analytics (Sales Forecast)', 'Dashboard Reporting Engine'] },
    { phase: 3, title: 'Workflow Automation', duration: '6-12 Months', deliverables: ['AI Workflow Engine (Triggers)', 'Marketplace for Connectors', 'API for Custom Integrations', 'Infrastructure Scaling'] },
    { phase: 4, title: 'Enterprise Expansion', duration: '12-18 Months', deliverables: ['Private LLM Deployment', 'Data Governance & Compliance Suite', 'Enterprise Onboarding Module', 'Global Partner Integrations'] },
];

const techStackData = [
    { category: 'Frontend', techs: ['Next.js', 'React', 'Tailwind CSS', 'Recharts'] },
    { category: 'Backend', techs: ['FastAPI (Python)', 'NestJS (Node.js)', 'SQLAlchemy'] },
    { category: 'Data Storage', techs: ['PostgreSQL', 'Elasticsearch', 'MinIO (S3)', 'Redis'] },
    { category: 'AI & Knowledge', techs: ['LangChain', 'HuggingFace Transformers', 'Gemini API', 'Milvus'] },
    { category: 'ETL & Data Sync', techs: ['Apache Airflow', 'Pandas', 'dbt', 'PySpark'] },
    { category: 'Infrastructure & DevOps', techs: ['Docker', 'Kubernetes (EKS)', 'Terraform', 'GitHub Actions', 'Prometheus', 'Grafana'] },
];

const UnifiedAiPillarsDiagram: React.FC = () => (
  <div className="bg-brand-secondary p-6 rounded-xl shadow-lg">
    <h2 className="text-xl font-semibold text-brand-text mb-6">Core Architecture Pillars</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {unifiedAiPillars.map((pillar) => (
        <div key={pillar.name} className="bg-brand-primary p-5 rounded-lg flex items-start space-x-4">
          <div className="bg-brand-accent p-3 rounded-full shrink-0">
            <pillar.icon className="h-7 w-7 text-brand-cyan" />
          </div>
          <div>
            <h3 className="font-bold text-brand-text text-lg">{pillar.name}</h3>
            <p className="text-sm text-brand-light mt-1">{pillar.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Roadmap: React.FC = () => (
    <div className="bg-brand-secondary p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-brand-text mb-6">Execution Roadmap</h2>
        <div className="relative border-l-2 border-brand-accent/50 ml-4 pl-8 space-y-10">
            {roadmapData.map(item => (
                <div key={item.phase} className="relative">
                    <div className="absolute -left-[42px] top-1 h-6 w-6 bg-brand-cyan rounded-full flex items-center justify-center text-brand-primary font-bold">{item.phase}</div>
                    <p className="text-xs text-brand-light">{item.duration}</p>
                    <h3 className="text-lg font-bold text-brand-text mb-2">{item.title}</h3>
                    <ul className="space-y-1.5">
                        {item.deliverables.map(d => (
                           <li key={d} className="flex items-start">
                               <CheckBadgeIcon className="h-5 w-5 text-brand-green mr-2 shrink-0 mt-0.5" />
                               <span className="text-sm text-brand-light">{d}</span>
                           </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </div>
);


const TechStack: React.FC = () => (
    <div className="bg-brand-secondary p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-brand-text mb-6">Technology Stack</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStackData.map(stack => (
                <div key={stack.category} className="bg-brand-primary p-4 rounded-lg">
                    <h3 className="font-bold text-brand-text mb-2">{stack.category}</h3>
                    <div className="flex flex-wrap gap-2">
                        {stack.techs.map(tech => (
                            <span key={tech} className="text-xs bg-brand-accent text-brand-text px-2 py-1 rounded-full">{tech}</span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);


export const Architecture: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-brand-text mb-6">System Architecture & Roadmap</h1>
      <p className="text-brand-light mb-8 max-w-3xl">Inspired by Scale AI's full-stack enterprise platform, this outlines the core architecture for UnifiedAI. Our system is designed around four key pillars to create a universal, self-learning layer that unifies all company data and drives intelligent action.</p>
      <div className="space-y-8">
        <UnifiedAiPillarsDiagram />
        <Roadmap />
        <TechStack />
      </div>
    </div>
  );
};
