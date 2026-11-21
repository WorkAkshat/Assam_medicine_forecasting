// mockUsers.js - Role-Based User Management & Permissions
export const USER_ROLES = [
  { id: 'super-admin', name: 'Super Admin', label: 'IT & System Admin', badge: 'bg-purple-100 text-purple-800' },
  { id: 'management', name: 'Management / Executive', label: 'GR Dhanuka Group Board', badge: 'bg-navy-100 text-navy-900' },
  { id: 'sales-manager', name: 'Sales Director', label: 'Northeast Regional Sales', badge: 'bg-amber-100 text-amber-800' },
  { id: 'supply-chain-manager', name: 'Supply Chain Manager', label: 'Guwahati Operations', badge: 'bg-blue-100 text-blue-800' },
  { id: 'warehouse-staff', name: 'Warehouse Controller', label: 'Rani cGMP Plant WH', badge: 'bg-emerald-100 text-emerald-800' },
  { id: 'distributor', name: 'Distributor Partner', label: 'Pragjyotish Medico', badge: 'bg-cyan-100 text-cyan-800' },
  { id: 'stockist', name: 'Stockist Partner', label: 'Dispur Valley Pharma', badge: 'bg-slate-100 text-slate-800' },
  { id: 'field-staff', name: 'Field Medical Rep', label: 'Assam Valley Field Force', badge: 'bg-rose-100 text-rose-800' }
];

export const MOCK_USERS = [
  {
    id: 'USR-006',
    name: 'Debojit Choudhury',
    roleId: 'super-admin',
    roleName: 'Super Admin',
    email: 'admin.tech@grdpharma.in',
    department: 'Information Technology',
    location: 'Guwahati Corporate HQ',
    phone: '+91 98641 00999',
    status: 'Active',
    lastActive: 'Active Now',
    avatar: 'DC',
    permissions: ['all_access', 'audit_logs', 'system_config', 'api_keys', 'database_backup']
  },
  {
    id: 'USR-002',
    name: 'Gautam R. Dhanuka',
    roleId: 'management',
    roleName: 'Management / Executive',
    email: 'gautam.dhanuka@grdpharma.in',
    department: 'Executive Leadership',
    location: 'Guwahati Corporate HQ',
    phone: '+91 98640 01000',
    status: 'Active',
    lastActive: '25m ago',
    avatar: 'GD',
    permissions: ['view_all', 'view_financials', 'view_reports', 'manage_users', 'pilot_governance', 'export_data']
  },
  {
    id: 'USR-004',
    name: 'Rupjyoti Bhattacharya',
    roleId: 'sales-manager',
    roleName: 'Sales Director',
    email: 'rupjyoti@grdpharma.in',
    department: 'Commercial & Trade Desk',
    location: 'Guwahati HQ',
    phone: '+91 97060 22001',
    status: 'Active',
    lastActive: '12m ago',
    avatar: 'RB',
    permissions: ['view_sales', 'manage_orders', 'view_customers', 'approve_credit', 'view_forecasts']
  },
  {
    id: 'USR-001',
    name: 'Dr. Abhijit Sarma',
    roleId: 'supply-chain-manager',
    roleName: 'Supply Chain Manager',
    email: 'abhijit.sarma@grdpharma.in',
    department: 'Supply Chain & Logistics',
    location: 'Guwahati Central Depot',
    phone: '+91 97060 11002',
    status: 'Active',
    lastActive: 'Active Now',
    avatar: 'AS',
    permissions: ['view_all', 'edit_inventory', 'approve_replenishment', 'manage_forecasts', 'view_reports', 'export_data']
  },
  {
    id: 'USR-003',
    name: 'Pranabesh Bora',
    roleId: 'warehouse-staff',
    roleName: 'Warehouse Controller',
    email: 'pranabesh.bora@grdpharma.in',
    department: 'Plant Operations & cGMP Formulation',
    location: 'Rani cGMP Formulation Plant',
    phone: '+91 94357 32217',
    status: 'Active',
    lastActive: 'Active Now',
    avatar: 'PB',
    permissions: ['view_inventory', 'edit_stock', 'manage_batches', 'scan_barcode', 'create_dispatch']
  },
  {
    id: 'USR-005',
    name: 'Bipul Goswami',
    roleId: 'distributor',
    roleName: 'Distributor Partner',
    email: 'bipul@pragjyotishmedico.in',
    department: 'Distribution Partner',
    location: 'Pragjyotish Medico (Guwahati)',
    phone: '+91 98640 12845',
    status: 'Active',
    lastActive: '5m ago',
    avatar: 'BG',
    permissions: ['view_assigned_stock', 'place_orders', 'view_invoices', 'report_stockist_sales']
  }
];
