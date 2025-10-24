
import React, { useState } from 'react';
import { WORKFLOWS_DATA } from '../constants';
import { WorkflowCard } from './WorkflowCard';
import type { Workflow as WorkflowType } from '../types';

export const Workflows: React.FC = () => {
    const [workflows, setWorkflows] = useState<WorkflowType[]>(WORKFLOWS_DATA);

    const handleToggle = (id: number, enabled: boolean) => {
        setWorkflows(workflows.map(wf => wf.id === id ? { ...wf, enabled } : wf));
    };

    return (
        <div className="container mx-auto">
             <h1 className="text-2xl md:text-3xl font-bold text-brand-text mb-6">Automation Workflows</h1>
             <p className="text-brand-light mb-8 max-w-3xl">Automate your business processes by connecting triggers to actions across your integrated tools. Enable a workflow to have it run automatically based on its trigger.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {workflows.map(wf => (
                     <WorkflowCard key={wf.id} workflow={wf} onToggle={handleToggle} />
                 ))}
             </div>
        </div>
    );
};
