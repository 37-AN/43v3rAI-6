import React, { useState } from 'react';
import type { Connector, User, ApiKey, Role } from '../types';
import { USERS_DATA, API_KEYS_DATA } from '../constants';
import { ConnectorStatus } from './ConnectorStatus';
import { ToggleSwitch } from './ToggleSwitch';
import { ShieldCheckIcon, KeyIcon, UsersIcon, LinkIcon, PlusIcon, TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

type SettingsTab = 'Connectors' | 'Security' | 'API Keys' | 'Users';

interface SettingsProps {
    connectors: Connector[];
}

const TabButton: React.FC<{active: boolean, onClick: () => void, icon: React.ElementType, label: string}> = ({ active, onClick, icon: Icon, label }) => (
    <button onClick={onClick} className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${active ? 'bg-brand-accent text-brand-text' : 'text-brand-light hover:bg-brand-accent/50 hover:text-brand-text'}`}>
        <Icon className="h-5 w-5" />
        <span>{label}</span>
    </button>
);

const SecurityTab: React.FC = () => {
    const [mfaEnabled, setMfaEnabled] = useState(true);
    return (
        <div className="space-y-8">
            <div className="bg-brand-secondary p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-brand-text mb-4">Single Sign-On (SSO)</h3>
                <p className="text-sm text-brand-light mb-4">Integrate with your identity provider to streamline user authentication.</p>
                <div className="flex space-x-4">
                     <button className="bg-brand-primary hover:bg-brand-accent transition-colors px-4 py-2 rounded-lg text-sm font-medium">Connect with Okta</button>
                     <button className="bg-brand-primary hover:bg-brand-accent transition-colors px-4 py-2 rounded-lg text-sm font-medium">Connect with Azure AD</button>
                </div>
            </div>
            <div className="bg-brand-secondary p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-brand-text mb-4">Multi-Factor Authentication (MFA)</h3>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-brand-light">Require all users to use a second factor of authentication to log in.</p>
                    <ToggleSwitch enabled={mfaEnabled} onChange={setMfaEnabled} />
                </div>
            </div>
            <div className="bg-brand-secondary p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-brand-text mb-4">Role-Based Access Control (RBAC)</h3>
                <p className="text-sm text-brand-light mb-4">Define roles to control user access to data and features.</p>
                <div className="space-y-2">
                    {(['Admin', 'Editor', 'Viewer'] as Role[]).map(role => (
                        <div key={role} className="flex justify-between items-center bg-brand-primary p-3 rounded-lg">
                            <span className="font-medium text-brand-text">{role}</span>
                            <span className="text-xs text-brand-light">Default Permissions</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ApiKeysTab: React.FC = () => {
    const [keys, setKeys] = useState<ApiKey[]>(API_KEYS_DATA);
    return (
        <div className="bg-brand-secondary p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-bold text-brand-text">API Keys</h3>
                    <p className="text-sm text-brand-light">Manage API keys for external integrations and services.</p>
                </div>
                <button className="flex items-center space-x-2 bg-brand-cyan text-brand-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors">
                    <PlusIcon className="h-5 w-5" />
                    <span>Generate New Key</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-brand-accent/50 text-xs text-brand-light uppercase">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Key</th>
                            <th className="p-3">Created</th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-accent/50">
                        {keys.map(key => (
                            <tr key={key.id}>
                                <td className="p-3 font-medium text-brand-text">{key.name}</td>
                                <td className="p-3 font-mono text-sm text-brand-light">{key.key}</td>
                                <td className="p-3 text-sm text-brand-light">{key.created}</td>
                                <td className="p-3">
                                    <div className="flex items-center space-x-3">
                                        <button className="text-brand-light hover:text-brand-cyan"><DocumentDuplicateIcon className="h-5 w-5" /></button>
                                        <button className="text-brand-light hover:text-brand-red"><TrashIcon className="h-5 w-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const UsersTab: React.FC = () => {
    const [users, setUsers] = useState<User[]>(USERS_DATA);
    
    const roleColors: Record<Role, string> = {
        'Admin': 'bg-brand-red/20 text-brand-red',
        'Editor': 'bg-brand-yellow/20 text-brand-yellow',
        'Viewer': 'bg-brand-cyan/20 text-brand-cyan',
    };

    return (
        <div className="bg-brand-secondary p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-bold text-brand-text">User Management</h3>
                    <p className="text-sm text-brand-light">Invite and manage team members and their roles.</p>
                </div>
                 <button className="flex items-center space-x-2 bg-brand-cyan text-brand-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors">
                    <PlusIcon className="h-5 w-5" />
                    <span>Invite User</span>
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-brand-accent/50 text-xs text-brand-light uppercase">
                        <tr>
                            <th className="p-3">User</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Last Active</th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-accent/50">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="p-3">
                                    <div className="flex items-center space-x-3">
                                        <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full" />
                                        <div>
                                            <p className="font-medium text-brand-text">{user.name}</p>
                                            <p className="text-xs text-brand-light">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${roleColors[user.role]}`}>{user.role}</span>
                                </td>
                                <td className="p-3 text-sm text-brand-light">{user.lastActive}</td>
                                <td className="p-3"><button className="text-brand-light hover:text-brand-red"><TrashIcon className="h-5 w-5" /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const ConnectorsTab: React.FC<{connectors: Connector[]}> = ({ connectors }) => {
    return (
        <div className="bg-brand-secondary p-6 rounded-xl shadow-lg">
             <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-bold text-brand-text">Data Connectors</h3>
                    <p className="text-sm text-brand-light">Manage your connected data sources.</p>
                </div>
                 <button className="flex items-center space-x-2 bg-brand-cyan text-brand-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors">
                    <PlusIcon className="h-5 w-5" />
                    <span>Add New Connector</span>
                </button>
            </div>
            <div className="space-y-4">
                {connectors.map((connector) => (
                    <ConnectorStatus key={connector.name} {...connector} />
                ))}
            </div>
        </div>
    );
};


export const Settings: React.FC<SettingsProps> = ({ connectors }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('Security');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Security': return <SecurityTab />;
            case 'API Keys': return <ApiKeysTab />;
            case 'Users': return <UsersTab />;
            case 'Connectors': return <ConnectorsTab connectors={connectors} />;
            default: return null;
        }
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-brand-text mb-2">Settings</h1>
            <p className="text-brand-light mb-8">Manage your organization's settings, integrations, and security.</p>

            <div className="flex items-center space-x-2 border-b border-brand-accent/50 mb-8">
                <TabButton active={activeTab === 'Security'} onClick={() => setActiveTab('Security')} icon={ShieldCheckIcon} label="Security" />
                <TabButton active={activeTab === 'API Keys'} onClick={() => setActiveTab('API Keys')} icon={KeyIcon} label="API Keys" />
                <TabButton active={activeTab === 'Users'} onClick={() => setActiveTab('Users')} icon={UsersIcon} label="Users" />
                <TabButton active={activeTab === 'Connectors'} onClick={() => setActiveTab('Connectors')} icon={LinkIcon} label="Connectors" />
            </div>

            <div>{renderTabContent()}</div>
        </div>
    );
};