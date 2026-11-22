import React, { useState } from 'react';
import {
  Users as UsersIcon,
  ShieldCheck,
  UserPlus,
  Search,
  Filter,
  MapPin,
  CheckCircle2,
  Lock,
  Check,
  X,
  Edit2
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import { useToast } from '../hooks/useToast';
import { usePersistentState } from '../hooks/usePersistentState';
import { MOCK_USERS, USER_ROLES } from '../data/mockUsers';

const PERMISSION_MODULES = [
  { id: 'dashboard', name: 'Dashboard & Pilot KPIs' },
  { id: 'forecasting', name: 'Demand Forecasting' },
  { id: 'inventory', name: 'Multi-State Inventory' },
  { id: 'replenishment', name: 'Replenishment Approval' },
  { id: 'expiry', name: 'FEFO & Expiry Control' },
  { id: 'logistics', name: 'Logistics & Transit' },
  { id: 'orders', name: 'Orders & Deliveries' },
  { id: 'reports', name: 'Reports & Downloads' },
  { id: 'data_import', name: 'Data Import (Tally/Excel)' }
];

export default function Users() {
  const { toast } = useToast();
  const [users, setUsers] = usePersistentState('grd_users_master', MOCK_USERS);
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' or 'permissions'
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  
  // Add User Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState(USER_ROLES[2].id);
  const [newDept, setNewDept] = useState('Supply Chain & Logistics');
  const [newLoc, setNewLoc] = useState('Guwahati Central Depot');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.roleId === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    const roleObj = USER_ROLES.find(r => r.id === newRole) || USER_ROLES[0];
    const created = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      roleId: roleObj.id,
      roleName: roleObj.name,
      email: newEmail,
      department: newDept,
      location: newLoc,
      phone: '+91 98000 00000',
      status: 'Active',
      lastActive: 'Just Invited',
      avatar: newName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      permissions: ['view_all']
    };

    setUsers([...users, created]);
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setIsAddModalOpen(false);
      setNewName('');
      setNewEmail('');
    }, 1200);
  };

  const columns = [
    {
      header: 'User & Profile',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-navy-900 text-white font-bold flex items-center justify-center text-xs">
            {row.avatar}
          </div>
          <div>
            <div className="font-semibold text-navy-950 text-xs">{row.name}</div>
            <div className="text-2xs text-navy-700/60">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Assigned Role',
      className: 'whitespace-nowrap min-w-[150px]',
      render: (row) => {
        const roleObj = USER_ROLES.find(r => r.id === row.roleId);
        return (
          <span className={`inline-block whitespace-nowrap text-2xs font-semibold px-2.5 py-0.5 rounded-full ${roleObj?.badge || 'bg-navy-100 text-navy-800'}`}>
            {row.roleName}
          </span>
        );
      }
    },
    {
      header: 'Department',
      render: (row) => (
        <span className="text-xs text-navy-800">{row.department}</span>
      )
    },
    {
      header: 'Location / Base',
      render: (row) => (
        <div className="flex items-center gap-1 text-xs text-navy-800">
          <MapPin className="w-3.5 h-3.5 text-navy-700/50" />
          <span>{row.location}</span>
        </div>
      )
    },
    {
      header: 'Status & Session',
      render: (row) => (
        <div>
          <Badge variant={row.status === 'Active' ? 'success' : 'neutral'}>
            {row.status}
          </Badge>
          <div className="text-2xs text-navy-700/60 mt-0.5">{row.lastActive}</div>
        </div>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => toast.info(`Managing RBAC permissions for ${row.name} (${row.roleName})`)}
          className="p-1 rounded text-navy-700/60 hover:text-navy-900 hover:bg-navy-100 cursor-pointer"
          title="Edit User Permissions"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-sans text-navy-950">
              Users &amp; Permissions
            </h1>
            <span className="text-xs bg-navy-100 text-navy-800 font-medium px-2 py-0.5 rounded-full">
              Role Access
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
            Manage team accounts, supply chain manager roles, warehouse controllers, and distributor access.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            icon={UserPlus}
          >
            Invite User
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard 
          title="Total Users" 
          value={users.length}
          subtitle="Across HQ, plant & depots"
          icon={UsersIcon}
        />
        <StatCard 
          title="Active Sessions" 
          value="4 Online"
          subtitle="Live operational staff"
          icon={CheckCircle2}
        />
        <StatCard 
          title="Role Archetypes" 
          value={USER_ROLES.length}
          subtitle="Tailored persona views"
          icon={ShieldCheck}
        />
        <StatCard 
          title="Security Standard" 
          value="ISO 27001"
          subtitle="Multi-tenant encryption"
          icon={Lock}
        />
      </div>

      {/* View Tabs */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-navy-100 pb-3">
          <div className="flex items-center gap-1.5 p-1 bg-navy-50 rounded-lg">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'directory' 
                  ? 'bg-white text-navy-900 shadow-sm font-semibold' 
                  : 'text-navy-700/70 hover:text-navy-900'
              }`}
            >
              User Directory ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'permissions' 
                  ? 'bg-white text-navy-900 shadow-sm font-semibold' 
                  : 'text-navy-700/70 hover:text-navy-900'
              }`}
            >
              Role Permissions Matrix
            </button>
          </div>

          {activeTab === 'directory' && (
            <div className="flex items-center gap-2">
              <Select
                value={roleFilter}
                onChange={(val) => setRoleFilter(val)}
                options={[
                  { value: 'All', label: 'All Roles' },
                  ...USER_ROLES.map(r => ({ value: r.id, label: r.name }))
                ]}
                icon={Filter}
              />

              <div className="relative w-48 sm:w-60">
                <Search className="w-4 h-4 text-navy-700/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-9 py-1.5 text-xs w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content based on tab */}
      {activeTab === 'directory' ? (
        <Table 
          title="Team Members Directory"
          subtitle="System users, assigned operational facilities, and role access levels"
          columns={columns}
          data={filteredUsers}
          keyExtractor={(row) => row.id}
          emptyMessage="No users found matching criteria."
        />
      ) : (
        <div className="card p-5 space-y-4">
          <div className="border-b border-navy-100 pb-3">
            <h3 className="font-sans font-bold text-navy-950 text-base">Module Access by Role Type</h3>
            <p className="text-2xs text-navy-700/60">Comprehensive granular authorization matrix governing data views and approval actions</p>
          </div>

          <div className="border border-navy-100 rounded-lg overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-navy-50 text-navy-700/80 border-b border-navy-100">
                <tr>
                  <th className="p-3 font-semibold">Functional Module</th>
                  <th className="p-3 font-semibold text-center">Executive</th>
                  <th className="p-3 font-semibold text-center">Supply Chain</th>
                  <th className="p-3 font-semibold text-center">Sales</th>
                  <th className="p-3 font-semibold text-center">Warehouse</th>
                  <th className="p-3 font-semibold text-center">Distributor</th>
                  <th className="p-3 font-semibold text-center">Field Rep</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {PERMISSION_MODULES.map((mod, idx) => (
                  <tr key={idx} className="hover:bg-navy-50/50">
                    <td className="p-3 font-medium text-navy-950">{mod.name}</td>
                    <td className="p-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center">
                      {mod.id === 'replenishment' || mod.id === 'data_import' ? (
                        <X className="w-4 h-4 text-navy-700/30 mx-auto" />
                      ) : (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {mod.id === 'inventory' || mod.id === 'expiry' || mod.id === 'logistics' ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-navy-700/30 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {mod.id === 'orders' || mod.id === 'inventory' ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-navy-700/30 mx-auto" />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {mod.id === 'forecasting' || mod.id === 'orders' ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-navy-700/30 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Invite New Team Member / Partner"
        size="md"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          {addSuccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-semibold text-emerald-900">User Invitation Dispatched</h4>
              <p className="text-xs text-emerald-700">Activation link sent to the user's corporate email address.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-navy-900 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhaskar Hazarika"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-navy-900 mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@grdpharma.in"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="input w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-navy-900 mb-1">Functional Department *</label>
                <Select
                  value={newDept}
                  onChange={(val) => setNewDept(val)}
                  options={[
                    { value: 'Supply Chain & Logistics', label: 'Supply Chain & Logistics' },
                    { value: 'Manufacturing & QC', label: 'Manufacturing & QC' },
                    { value: 'Commercial Sales', label: 'Commercial Sales' },
                    { value: 'Executive Board', label: 'Executive Board' },
                    { value: 'Distribution Network', label: 'Distribution Network' },
                    { value: 'IT & Administration', label: 'IT & Administration' }
                  ]}
                  className="w-full justify-between"
                  dropdownClassName="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-navy-900 mb-1">Role Permission Level *</label>
                  <Select
                    value={newRole}
                    onChange={(val) => {
                      setNewRole(val);
                      if (val === 'warehouse-staff') setNewDept('Manufacturing & QC');
                      else if (val === 'sales-manager') setNewDept('Commercial Sales');
                      else if (val === 'management') setNewDept('Executive Board');
                      else if (val === 'distributor') setNewDept('Distribution Network');
                      else setNewDept('Supply Chain & Logistics');
                    }}
                    options={USER_ROLES.map(r => ({ value: r.id, label: r.name }))}
                    className="w-full justify-between"
                    dropdownClassName="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-navy-900 mb-1">Operating Location *</label>
                  <Select
                    value={newLoc}
                    onChange={(val) => setNewLoc(val)}
                    options={[
                      { value: 'Guwahati Central Depot', label: 'Guwahati Central Depot' },
                      { value: 'Rani cGMP Formulation Plant', label: 'Rani cGMP Formulation Plant' },
                      { value: 'Dibrugarh Upper Assam Depot', label: 'Dibrugarh Upper Assam Depot' },
                      { value: 'Silchar Barak Valley Depot', label: 'Silchar Barak Valley Depot' },
                      { value: 'Guwahati Corporate HQ', label: 'Guwahati Corporate HQ' }
                    ]}
                    className="w-full justify-between"
                    dropdownClassName="w-full"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-navy-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Send Activation Invite
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
}
