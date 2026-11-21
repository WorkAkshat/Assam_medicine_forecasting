// useAuth.js - Simulated Role-Based Authentication Context & Hook
import React, { createContext, useContext, useState } from 'react';
import { MOCK_USERS, USER_ROLES } from '../data/mockUsers';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Read saved role from localStorage if present
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedRoleId = localStorage.getItem('grd_active_role_id');
      if (savedRoleId) {
        const found = MOCK_USERS.find(u => u.roleId === savedRoleId);
        if (found) return found;
      }
    } catch (e) {
      // localStorage may fail in some restricted environments
    }
    return MOCK_USERS[0];
  });

  const switchRole = (roleId) => {
    try {
      localStorage.setItem('grd_active_role_id', roleId);
    } catch (e) {
      // ignore
    }
    const matchedUser = MOCK_USERS.find(u => u.roleId === roleId) || {
      id: `USR-${roleId}`,
      name: `${USER_ROLES.find(r => r.id === roleId)?.name || 'Guest'} User`,
      roleId: roleId,
      roleName: USER_ROLES.find(r => r.id === roleId)?.name || 'Staff',
      email: `${roleId}@grdpharma.in`,
      department: 'Operations',
      location: 'Northeast Region',
      phone: '+91 97060 00000',
      status: 'Active',
      lastActive: 'Just Now',
      avatar: roleId.slice(0, 2).toUpperCase(),
      permissions: roleId === 'super-admin' ? ['all_access'] : ['view_all', 'view_reports']
    };
    setCurrentUser(matchedUser);
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    if (currentUser.permissions?.includes('all_access')) return true;
    return currentUser.permissions?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ currentUser, currentRole: currentUser.roleId, switchRole, hasPermission, roles: USER_ROLES }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
