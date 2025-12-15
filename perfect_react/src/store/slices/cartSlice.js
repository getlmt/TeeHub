
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateId } from '../../utils/helpers';
import CartService from '@/services/cart_service'; 


const normalizeServerItems = (serverItems = []) => {
  if (!Array.isArray(serverItems)) return [];
  return serverItems.map((it) => ({
    id: it.id ?? it.cartItemId ?? generateId(),
    productId: it.productId ?? it.sku ?? it.product?.id ?? null,
    name: it.name ?? it.productName ?? it.product?.name ?? '',
    price: Number(it.price ?? it.unitPrice ?? 0) || 0,
    image: it.image ?? it.productImage ?? it.product?.image ?? null,
    quantity: Number(it.qty ?? it.quantity ?? 0) || 0,
    size: it.size ?? null,
    color: it.color ?? null,
    design: it.design ?? null,
    customizations: it.customizations ?? {},
    addedAt: it.addedAt ?? it.createdAt ?? new Date().toISOString(),
    product: it.product ?? null,
    _serverRaw: it
  }));
};


export const fetchCartFromServer = createAsyncThunk(
  'cart/fetchFromServer',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CartService.getCart();
      const serverItems = Array.isArray(res) ? res : (res?.items ?? []);
      return normalizeServerItems(serverItems);
    } catch (err) {
      return rejectWithValue(err?.message ?? 'Fetch cart failed');
    }
  }
);

export const addItemToServer = createAsyncThunk(
  'cart/addItemToServer',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await CartService.addToCart(payload);
      const serverItems = Array.isArray(res) ? res : (res?.items ?? (res?.item ? [res.item] : null));
      return normalizeServerItems(serverItems ?? []);
    } catch (err) {
      return rejectWithValue(err?.message ?? 'Add item failed');
    }
  }
);

export const removeItemFromServer = createAsyncThunk(
  'cart/removeItemFromServer',
  async (itemId, { rejectWithValue }) => {
    try {
      const res = await CartService.removeCartItem(itemId);
      if (!res) return itemId;
      const serverItems = Array.isArray(res) ? res : (res?.items ?? null);
      if (serverItems) return normalizeServerItems(serverItems);
      return itemId;
    } catch (err) {
      return rejectWithValue(err?.message ?? 'Remove failed');
    }
  }
);

export const updateItemOnServer = createAsyncThunk(
  'cart/updateItemOnServer',
  async ({ itemId, qty }, { rejectWithValue }) => {
    try {
      const res = await CartService.updateCartItem(itemId, qty);
      const serverItems = Array.isArray(res) ? res : (res?.items ?? (res?.item ? [res.item] : null));
      return normalizeServerItems(serverItems ?? []);
    } catch (err) {
      return rejectWithValue(err?.message ?? 'Update failed');
    }
  }
);


const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
  error: null,
  lastSyncedAt: null
};

const computeTotals = (items) => {
  const total = items.reduce((s, it) => {
    const q = Number(it.quantity ?? 0) || 0;
    const price = Number(it.price ?? 0) || 0;
    return s + price * q;
  }, 0);
  const itemCount = items.reduce((s, it) => s + (Number(it.quantity ?? 0) || 0), 0);
  return { total, itemCount };
};


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.isLoading = false;
      state.error = null;
    },
    setCart: (state, action) => {
      const items = Array.isArray(action.payload) ? action.payload : (action.payload?.items ?? []);
      state.items = items;
      const t = computeTotals(state.items);
      state.total = t.total;
      state.itemCount = t.itemCount;
      state.lastSyncedAt = new Date().toISOString();
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchCartFromServer.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(fetchCartFromServer.fulfilled, (s, a) => {
        s.isLoading = false;
        s.items = a.payload ?? [];
        const t = computeTotals(s.items);
        s.total = t.total; s.itemCount = t.itemCount; s.lastSyncedAt = new Date().toISOString();
      })
      .addCase(fetchCartFromServer.rejected, (s, a) => { s.isLoading = false; s.error = a.payload ?? a.error?.message; })

      
      .addCase(addItemToServer.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(addItemToServer.fulfilled, (s, a) => {
        s.isLoading = false;
        const payload = a.payload ?? [];
        if (Array.isArray(payload) && payload.length > 0) s.items = payload;
        const t = computeTotals(s.items);
        s.total = t.total; s.itemCount = t.itemCount; s.lastSyncedAt = new Date().toISOString();
      })
      .addCase(addItemToServer.rejected, (s, a) => { s.isLoading = false; s.error = a.payload ?? a.error?.message; })

      
      .addCase(removeItemFromServer.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(removeItemFromServer.fulfilled, (s, a) => {
        s.isLoading = false;
        const payload = a.payload;
        if (Array.isArray(payload)) s.items = payload;
        else if (payload) s.items = s.items.filter(i => i.id !== payload);
        const t = computeTotals(s.items);
        s.total = t.total; s.itemCount = t.itemCount; s.lastSyncedAt = new Date().toISOString();
      })
      .addCase(removeItemFromServer.rejected, (s, a) => { s.isLoading = false; s.error = a.payload ?? a.error?.message; })

      
      .addCase(updateItemOnServer.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(updateItemOnServer.fulfilled, (s, a) => {
        s.isLoading = false;
        const payload = a.payload;
        if (Array.isArray(payload) && payload.length) s.items = payload;
        const t = computeTotals(s.items);
        s.total = t.total; s.itemCount = t.itemCount; s.lastSyncedAt = new Date().toISOString();
      })
      .addCase(updateItemOnServer.rejected, (s, a) => { s.isLoading = false; s.error = a.payload ?? a.error?.message; });
  }
});


export const { clearCart, setCart } = cartSlice.actions;


export default cartSlice.reducer;
