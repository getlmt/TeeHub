
import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useMemo, useEffect, useRef } from 'react';
import {
  fetchCartFromServer,
  addItemToServer,
  removeItemFromServer,
  updateItemOnServer,
  clearCart as clearCartAction,
  setCart
} from '@/store/slices/cartSlice';
import { isAuthenticated } from '@/utils/auth';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items = [], total = 0, itemCount = 0, isLoading = false, error = null } = useSelector((s) => s.cart || {});

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const totalQty = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) return 0;
    return items.reduce((sum, it) => sum + (Number(it.quantity ?? 0) || 0), 0);
  }, [items]);

  
  const refreshCart = useCallback(async () => {
    try {
      await dispatch(fetchCartFromServer()).unwrap();
    } catch (err) {
      
      console.error('refreshCart failed', err);
    }
  }, [dispatch]);

  
  const emitCartUpdated = useCallback(() => {
    try { window.dispatchEvent(new Event('cartUpdated')); } catch (e) {  }
  }, []);

  const addItem = useCallback(async (serverPayload) => {
    if (!isAuthenticated()) throw new Error('User not authenticated');
    try {
      await dispatch(addItemToServer(serverPayload)).unwrap();
      
      await refreshCart();
      emitCartUpdated();
    } catch (err) {
      console.error('addItem failed', err);
      throw err;
    }
  }, [dispatch, refreshCart, emitCartUpdated]);

  const removeItem = useCallback(async (itemId) => {
    if (!isAuthenticated()) throw new Error('User not authenticated');
    try {
      await dispatch(removeItemFromServer(itemId)).unwrap();
      await refreshCart();
      emitCartUpdated();
    } catch (err) {
      console.error('removeItem failed', err);
      throw err;
    }
  }, [dispatch, refreshCart, emitCartUpdated]);

  const updateItemQuantity = useCallback(async (itemId, qty) => {
    if (!isAuthenticated()) throw new Error('User not authenticated');
    try {
      await dispatch(updateItemOnServer({ itemId, qty })).unwrap();
      await refreshCart();
      emitCartUpdated();
    } catch (err) {
      console.error('updateItemQuantity failed', err);
      throw err;
    }
  }, [dispatch, refreshCart, emitCartUpdated]);

  const clearAllItems = useCallback(() => dispatch(clearCartAction()), [dispatch]);
  const setCartFromServer = useCallback((items) => dispatch(setCart(items)), [dispatch]);

  
  useEffect(() => {
    let debounceTimer = null;
    const onCartUpdated = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        
        if (mountedRef.current) refreshCart().catch(() => {});
      }, 80);
    };

    const onStorage = (ev) => {
      if (!ev) return;
      if (ev.key === 'cart' || ev.key === 'shopping_cart') {
        onCartUpdated();
      }
    };

    window.addEventListener('cartUpdated', onCartUpdated);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('cartUpdated', onCartUpdated);
      window.removeEventListener('storage', onStorage);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [refreshCart]);

  
  useEffect(() => {
    if (isAuthenticated()) {
      refreshCart().catch(() => {});
    }
    
  }, []); 

  return {
    items,
    total,
    itemCount,
    totalQty,
    isLoading,
    error,
    refreshCart,
    addItem,
    removeItem,
    updateItemQuantity,
    clearAllItems,
    setCartFromServer
  };
};
