import type { Kpi, RevenueData, LeadSource, Connector, Workflow, User, ApiKey } from './types';
import { ChartBarIcon, UsersIcon, CurrencyDollarIcon, ChatBubbleBottomCenterTextIcon, ClockIcon, TableCellsIcon, DocumentChartBarIcon, PaperAirplaneIcon, UserPlusIcon, EnvelopeIcon, TicketIcon, MegaphoneIcon } from '@heroicons/react/24/outline';

export const KPI_DATA: Kpi[] = [
  {
    title: 'Total Revenue',
    value: '$4.2M',
    change: '+12.5%',
    trend: 'up',
    icon: CurrencyDollarIcon,
  },
  {
    title: 'New Customers',
    value: '1,250',
    change: '+8.2%',
    trend: 'up',
    icon: UsersIcon,
  },
  {
    title: 'Conversion Rate',
    value: '8.9%',
    change: '-1.8%',
    trend: 'down',
    icon: ChartBarIcon,
  },
  {
    title: 'Monthly Growth',
    value: '23.4%',
    change: '+5.2%',
    trend: 'up',
    icon: ChatBubbleBottomCenterTextIcon,
  },
];

export const REVENUE_DATA: RevenueData[] = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
];

export const LEAD_SOURCE_DATA: LeadSource[] = [
  { name: 'Organic Search', value: 400, fill: '#8884d8' },
  { name: 'Direct', value: 300, fill: '#82ca9d' },
  { name: 'Referral', value: 200, fill: '#ffc658' },
  { name: 'Paid Ads', value: 278, fill: '#00F5D4' },
];

export const CONNECTORS_DATA: Connector[] = [
  { name: 'Google Drive', status: 'Connected', iconUrl: 'https://cdn.worldvectorlogo.com/logos/google-drive-2.svg' },
  { name: 'Slack', status: 'Connected', iconUrl: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg' },
  { name: 'PostgreSQL', status: 'Connected', iconUrl: 'https://cdn.worldvectorlogo.com/logos/postgresql.svg' },
  { name: 'REST API', status: 'Syncing', iconUrl: 'https://www.svgrepo.com/show/475653/api-interface.svg' },
  { name: 'CSV/Excel Upload', status: 'Connected', iconUrl: 'https://www.svgrepo.com/show/452148/excel.svg' },
];

export const WORKFLOWS_DATA: Workflow[] = [
  {
    id: 1,
    title: 'Monthly Sales Report to Slack',
    description: 'Automatically generates a summary of the last month\'s sales performance and posts it to the #sales channel.',
    trigger: {
      name: 'Scheduled: 1st of month',
      icon: ClockIcon,
    },
    steps: [
      { name: 'Query Sales Data', description: 'From PostgreSQL', icon: TableCellsIcon },
      { name: 'Generate Summary', description: 'Using AI Engine', icon: DocumentChartBarIcon },
      { name: 'Post to Slack', description: 'Channel: #sales', icon: PaperAirplaneIcon },
    ],
    enabled: true,
  },
  {
    id: 2,
    title: 'New High-Value Lead Alert',
    description: 'When a new lead with a value over $10,000 is added via an external tool, notify the senior sales team via email.',
    trigger: {
      name: 'REST API: New Lead',
      icon: UserPlusIcon,
    },
    steps: [
      { name: 'Get Contact Details', description: 'From API Payload', icon: UserPlusIcon },
      { name: 'Send Email', description: 'To sales-leads@43v3r.tech', icon: EnvelopeIcon },
      { name: 'Create Task', description: 'In internal CRM', icon: TicketIcon },
    ],
    enabled: true,
  },
    {
    id: 3,
    title: 'CSAT Score Drop Notification',
    description: 'If the average CSAT score for the week drops below 90%, create a high-priority ticket for the support manager.',
    trigger: {
      name: 'KPI Threshold Alert',
      icon: MegaphoneIcon,
    },
    steps: [
      { name: 'Monitor CSAT KPI', description: 'Real-time dashboard data', icon: ChatBubbleBottomCenterTextIcon },
      { name: 'Create Support Ticket', description: 'Assign to Support Lead', icon: TicketIcon },
      { name: 'Send Slack Alert', description: 'Channel: #support-alerts', icon: PaperAirplaneIcon },
    ],
    enabled: false,
  },
];

export const USERS_DATA: User[] = [
    { id: 1, name: 'Alex Johnson', email: 'alex.j@43v3r.tech', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', role: 'Admin', lastActive: '2 hours ago' },
    { id: 2, name: 'Maria Garcia', email: 'maria.g@43v3r.tech', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', role: 'Editor', lastActive: '1 day ago' },
    { id: 3, name: 'James Smith', email: 'james.s@43v3r.tech', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', role: 'Viewer', lastActive: '5 minutes ago' },
    { id: 4, name: 'Patricia Williams', email: 'patricia.w@43v3r.tech', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026707d', role: 'Editor', lastActive: '3 days ago' },
];

export const API_KEYS_DATA: ApiKey[] = [
    { id: 'sk_live_abc...xyz', name: 'Default Production Key', key: 'sk_live_abc...xyz', created: '2023-01-15' },
    { id: 'sk_test_123...789', name: 'Staging Environment Key', key: 'sk_test_123...789', created: '2023-02-01' },
    { id: 'sk_live_def...uvw', name: 'Marketing Automation Hook', key: 'sk_live_def...uvw', created: '2023-03-20' },
];