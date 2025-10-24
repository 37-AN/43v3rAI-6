import React from 'react';
import {
  ComputerDesktopIcon,
  CodeBracketSquareIcon,
  ArrowsRightLeftIcon,
  CpuChipIcon,
  CircleStackIcon,
  LockClosedIcon,
  CloudIcon,
  ChevronRightIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';

const architectureData = {
  title: 'High-Level Architecture',
  layers: [
    { name: 'User Interface', tech: 'Next.js, React, Tailwind', icon: ComputerDesktopIcon },
    { name: 'API Gateway', tech: 'FastAPI / NestJS', icon: CodeBracketSquareIcon },
    { name: 'ETL & Sync', tech: 'Airflow, Pandas, dbt', icon: ArrowsRightLeftIcon },
    { name: 'AI & Knowledge Layer', tech: 'LangChain, Transformers', icon: CpuChipIcon },
    { name: 'Security & Auth', tech: 'OAuth2, Vault, RBAC', icon: LockClosedIcon },
    { name: 'Unified Data Store', tech: 'Postgres, Elastic, S3', icon: CircleStackIcon },
    { name: 'External Connectors', tech: 'Salesforce, GDrive, Slack', icon: CloudIcon },
  ],
};

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

const ArchitectureDiagram: React.FC = () => (
  <div className="bg-brand-secondary p-6 rounded-xl shadow-lg">
    <h2 className="text-xl font-semibold text-brand-text mb-6">{architectureData.title}</h2>
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 text-center">
        {architectureData.layers.map((layer, index) => (
          <div key={layer.name} className="flex flex-col items-center p-3 bg-brand-primary rounded-lg">
            <layer.icon className="h-8 w-8 text-brand-cyan mb-2" />
            <h3 className="font-semibold text-sm text-brand-text">{layer.name}</h3>
            <p className="text-xs text-brand-light">{layer.tech}</p>
          </div>
        ))}
      </div>
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
      <p className="text-brand-light mb-8 max-w-3xl">This outlines the technical architecture, data flow, and execution plan for building and scaling UnifiedAI, creating a universal, self-learning layer that understands and unifies all company data.</p>
      <div className="space-y-8">
        <ArchitectureDiagram />
        <Roadmap />
        <TechStack />
      </div>
    </div>
  );
};