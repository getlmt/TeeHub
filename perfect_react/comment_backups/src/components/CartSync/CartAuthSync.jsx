// src/components/CartSync/CartAuthSync.jsx
import React, { useEffect } from 'react';
import { isAuthenticated } from '@/utils/auth';
import { useCart } from '@/hooks/useCart';

/**
 * CartAuthSync
 * - Fetch server cart once on mount if user is authenticated.
 * - Default export so main.jsx can import it with `import CartAuthSync from '...'`
 */
export default function CartAuthSync() {
  const { refreshCart /*, mergeGuestCart if you use it */ } = useCart();

  useEffect(() => {
    const run = async () => {
      try {
        if (isAuthenticated()) {
          await refreshCart();
        }
      } catch (err) {
        // keep quiet in production; log useful info in dev
        if (process.env.NODE_ENV === 'development') {
          console.warn('CartAuthSync refreshCart failed', err);
        }
      }
    };

    run();
    // run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
