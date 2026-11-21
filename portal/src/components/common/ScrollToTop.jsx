import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Centralized, reliable scroll-to-top mechanism for PharmaPredict Portal.
 * 
 * Automatically resets page scroll position to (0, 0) whenever:
 * 1. User navigates to any new route, module or submodule (pathname change).
 * 2. User switches role perspective (currentRole change).
 * 
 * Preserves scroll during in-page interactions (modals, tabs, pagination, filters).
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const { currentRole } = useAuth();
  const prevPathRef = useRef(pathname);
  const prevRoleRef = useRef(currentRole);

  useEffect(() => {
    // Configure browser to not retain old scroll on SPA transitions
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const isPathChanged = prevPathRef.current !== pathname;
    const isRoleChanged = prevRoleRef.current !== currentRole;

    if (isPathChanged || isRoleChanged) {
      // Immediate instant scroll reset across all potential scrolling viewports
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }

      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.scrollTop = 0;
      }

      prevPathRef.current = pathname;
      prevRoleRef.current = currentRole;
    }
  }, [pathname, currentRole]);

  return null;
}
