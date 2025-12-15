
import React, { useEffect } from 'react';
import { isAuthenticated } from '@/utils/auth';
import { useCart } from '@/hooks/useCart';


export default function CartAuthSync() {
  const { refreshCart  } = useCart();

  useEffect(() => {
    const run = async () => {
      try {
        if (isAuthenticated()) {
          await refreshCart();
        }
      } catch (err) {
        
        if (process.env.NODE_ENV === 'development') {
          console.warn('CartAuthSync refreshCart failed', err);
        }
      }
    };

    run();
    
    
  }, []);

  return null;
}
