import React, { createContext, useContext, useMemo, useState } from 'react';

// The brief asks for actionable outputs for supply-chain, sales and management teams,
// plus the distributors/stockists in the network. Each role sees the same data, ordered for its job.
export const ROLES = [
  { id: 'supply', name: 'Supply chain planner', home: '/', nav: ['overview', 'alerts', 'replenishment', 'inventory', 'expiry', 'demand', 'network', 'medicines', 'performance', 'data', 'settings'] },
  { id: 'management', name: 'Management', home: '/', nav: ['overview', 'performance', 'demand', 'inventory', 'expiry', 'alerts', 'network'] },
  { id: 'sales', name: 'Sales', home: '/demand', nav: ['demand', 'inventory', 'alerts', 'overview', 'medicines', 'network'] },
  { id: 'depot', name: 'Depot / distributor', home: '/replenishment', nav: ['replenishment', 'inventory', 'expiry', 'alerts', 'demand'], scoped: true },
];

const KEY = 'grd_role_v1';
const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(KEY) || 'null');
      if (saved && ROLES.some((r) => r.id === saved.id)) return saved;
    } catch {
      /* ignore */
    }
    return { id: 'supply', depot: 'GHY' };
  });
  const value = useMemo(() => {
    const role = ROLES.find((r) => r.id === state.id) || ROLES[0];
    const save = (next) => {
      setState(next);
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    };
    return {
      role,
      depot: role.scoped ? state.depot : null,
      homeDepot: state.depot,
      setRole: (id) => save({ ...state, id }),
      setDepot: (depot) => save({ ...state, depot }),
    };
  }, [state]);
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used inside <RoleProvider>');
  return ctx;
}
