import type { ElementType } from 'react';

export interface Kpi {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: ElementType;
}

export interface RevenueData {
  name: string;
  revenue: number;
}

export interface LeadSource {
  name: string;
  value: number;
  fill: string;
}

export interface Connector {
  name: string;
  status: 'Connected' | 'Syncing' | 'Error';
  iconUrl: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface WorkflowStep {
  name: string;
  description: string;
  icon: ElementType;
}

export interface Workflow {
  id: number;
  title: string;
  description: string;
  trigger: {
    name: string;
    icon: ElementType;
  };
  steps: WorkflowStep[];
  enabled: boolean;
}

export type Role = 'Admin' | 'Editor' | 'Viewer';

export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  lastActive: string;
}

export interface ApiKey {
  id: string;
  name:string;
  key: string;
  created: string;
}

export type ActiveView = 'dashboard' | 'workflows' | 'architecture' | 'settings';