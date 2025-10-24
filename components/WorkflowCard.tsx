
import React from 'react';
import type { Workflow } from '../types';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { ToggleSwitch } from './ToggleSwitch';

interface WorkflowCardProps {
  workflow: Workflow;
  onToggle: (id: number, enabled: boolean) => void;
}

export const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, onToggle }) => {
  return (
    <div className="bg-brand-secondary p-6 rounded-xl shadow-lg flex flex-col h-full transition-transform hover:scale-105 duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-brand-text pr-4">{workflow.title}</h3>
        <ToggleSwitch enabled={workflow.enabled} onChange={(enabled) => onToggle(workflow.id, enabled)} />
      </div>
      <p className="text-sm text-brand-light mb-6 flex-grow">{workflow.description}</p>
      
      <div className="space-y-6">
        <div>
            <p className="text-xs text-brand-light uppercase font-semibold mb-2">Trigger</p>
            <div className="flex items-center space-x-2 bg-brand-primary/50 p-2 rounded-lg">
                <workflow.trigger.icon className="h-5 w-5 text-brand-cyan" />
                <span className="text-sm text-brand-text font-medium">{workflow.trigger.name}</span>
            </div>
        </div>

        <div>
            <p className="text-xs text-brand-light uppercase font-semibold mb-2">Actions</p>
            <div className="space-y-3">
                {workflow.steps.map((step, index) => (
                    <div key={index} className="flex items-center">
                        <div className="flex items-center space-x-3 flex-1">
                            <div className="bg-brand-accent rounded-full p-1.5">
                               <step.icon className="h-5 w-5 text-brand-text" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-brand-text">{step.name}</p>
                                <p className="text-xs text-brand-light">{step.description}</p>
                            </div>
                        </div>
                        {index < workflow.steps.length - 1 && (
                            <ChevronRightIcon className="h-5 w-5 text-brand-accent shrink-0 mx-2"/>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
