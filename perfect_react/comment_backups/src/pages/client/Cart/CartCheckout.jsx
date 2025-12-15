// src/pages/Cart/CartCheckout.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import CartService from "../../../services/cart_service.js";
import OrderService from "../../../services/orderService.js";
import PaymentQR from "../../../components/ui/cart/PaymentQR.jsx";
import { getUserId } from "../../../utils/auth";
import { getMyAddresses, getMyProfile } from "../../../services/user_profile_service.js";

// emit sự kiện để các hook / component khác (ví dụ useCart) bắt được và refresh
function broadcastCartChange() {
  try {
    // Event cho single-tab (useCart đang lắng nghe 'cartUpdated')
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (e) { /* ignore */ }

  try {
    // Trigger storage event trên tab khác (key có thể tuỳ chỉnh)
    localStorage.setItem('cart', String(Date.now()));
  } catch (e) { /* ignore */ }
}

// ===== Toast đơn giản =====
const toast = {
  success: (m) => { try { console.log(m); alert(m); } catch (_) { console.log(m); } },
  error: (m) => { try { console.error(m); alert(m); } catch (_) { console.error(m); } },
  warning: (m) => { try { console.warn(m); alert(m); } catch (_) { console.warn(m); } },
};

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* ------------------------------------------------------------------
   Compatibility helper for removing cart item
   Tránh lỗi khi service đặt tên hàm khác nhau.
   Thử các tên hàm thông dụng (đã ưu tiên tên trong service bạn gửi).
   ------------------------------------------------------------------ */
async function removeCartItemFromService(cartItemId) {
  const candidates = [
    'removeCartItem',
    'removeFromCart',
    'deleteCartItem',
    'removeItem',
    'deleteItem',
    'remove',
    'delete',
    'removeCart',
  ];

  for (const name of candidates) {
    const fn = CartService?.[name];
    if (typeof fn === 'function') {
      return await fn.call(CartService, cartItemId);
    }
  }

  if (typeof CartService === 'object' && typeof CartService.api === 'object' && typeof CartService.api.delete === 'function') {
    try { return await CartService.api.delete(`/cart/item/${cartItemId}`); } catch (_) { }
    try { return await CartService.api.delete(`/api/cart/item/${cartItemId}`); } catch (_) { }
    try { return await CartService.api.delete(`/cart/${cartItemId}`); } catch (_) { }
  }

  throw new Error('Cart service không cung cấp hàm xóa item. Kiểm tra src/services/cart_service.js');
}

/* ------------------------------------------------------------------
   Compatibility helper to update a single cart item qty
   Thử nhiều tên hàm/endpoint tương thích.
   ------------------------------------------------------------------ */
async function updateSingleSourceQuantity(sourceId, qty) {
  const attempts = [
    async () => { if (typeof CartService.updateCartItem === 'function') return await CartService.updateCartItem(sourceId, qty); },
    async () => { if (typeof CartService.updateCart === 'function') return await CartService.updateCart(sourceId, qty); },
    async () => { if (typeof CartService.setQuantity === 'function') return await CartService.setQuantity(sourceId, qty); },
    async () => { if (typeof CartService.api === 'object' && typeof CartService.api.patch === 'function') return await CartService.api.patch(`/cart/item/${sourceId}`, { qty }); },
    async () => { if (typeof CartService.api === 'object' && typeof CartService.api.put === 'function') return await CartService.api.put(`/cart/item/${sourceId}`, { qty }); },
  ];

  let lastErr = null;
  for (const fn of attempts) {
    try {
      const r = await fn();
      // nếu không lỗi => success
      return r;
    } catch (e) {
      lastErr = e;
    }
  }
  // none succeeded
  const err = lastErr || new Error('Không thể cập nhật số lượng cho item');
  throw err;
}

/* =========================================================================
   AddressSelector (sử dụng getMyAddresses)
   - Gọi getMyAddresses()
   - Hiển thị danh sách, auto chọn default
   ========================================================================= */
function AddressSelector({ selectedAddressId, onSelectAddress }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [raw, setRaw] = useState(null);
  const mountedRef = useRef(true);

  const AddressLine = ({ a }) => {
    const parts = [
      a?.unitNumber,
      a?.streetNumber,
      a?.addressLine,
      a?.fullAddress,
      a?.address,
      a?.wardName,
      a?.districtName,
      a?.provinceName,
    ].filter(Boolean);
    return <span>{parts.join(", ") || "(Chưa có mô tả chi tiết)"}</span>;
  };

  const load = async () => {
    mountedRef.current = true;
    setLoading(true);
    try {
      const list = await getMyAddresses();
      if (!mountedRef.current) return;
      setRaw(list);
      const safeList = Array.isArray(list) ? list : [];
      setAddresses(safeList);

      if (!selectedAddressId && safeList.length > 0) {
        const def = safeList.find(a => a?.isDefault);
        const fallback = safeList[0];
        const idToPick = def?.addressId ?? fallback?.addressId ?? null;
        if (idToPick) onSelectAddress?.(idToPick);
      }
    } catch (e) {
      console.error("[AddressSelector] load error:", e);
      toast.error(e?.message || "Không thể tải địa chỉ.");
      setAddresses([]);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => { mountedRef.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={addr_wrap}>
      <div style={addr_headerRow}>
        <div style={addr_title}>Địa chỉ giao hàng</div>
        <div>
          <button type="button" onClick={load} style={addr_reloadBtn}>Tải lại</button>
        </div>
      </div>

      {loading ? (
        <div style={{ opacity: .7 }}>Đang tải địa chỉ…</div>
      ) : addresses.length === 0 ? (
        <div style={{ opacity: .8 }}>
          Bạn chưa có địa chỉ giao hàng.

        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {addresses.map((a) => {
            const id = a?.addressId ?? a?.id ?? String(a);
            const receiver = a?.__raw?.receiverName ?? a?.__raw?.name ?? null;
            const phone = a?.__raw?.phoneNumber ?? a?.__raw?.phone ?? null;

            return (
              <label
                key={String(id)}
                style={{
                  ...addr_item,
                  background: (selectedAddressId === id) ? "rgba(59,130,246,0.06)" : "white"
                }}
              >
                <input
                  type="radio"
                  name="shipping_address"
                  checked={selectedAddressId === id}
                  onChange={() => onSelectAddress?.(id)}
                  style={{ marginTop: 2 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <AddressLine a={a} />
                    {a.isDefault && <span style={addr_badge}>Mặc định</span>}
                    {receiver && <span style={addr_chip}>{receiver}</span>}
                    {phone && <span style={addr_chip}>{phone}</span>}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Styles cho AddressSelector
const addr_wrap = {
  background: "white",
  borderRadius: 12,
  boxShadow: "0 4px 6px rgba(0,0,0,0.06)",
  padding: 16,
  marginBottom: 16,
};
const addr_headerRow = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 };
const addr_title = { fontWeight: 700, fontSize: 16 };
const addr_item = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  cursor: "pointer",
};
const addr_badge = {
  padding: "2px 8px",
  fontSize: 12,
  borderRadius: 999,
  background: "rgba(16,185,129,.12)",
  color: "#065f46",
  border: "1px solid rgba(16,185,129,.2)",
};
const addr_chip = {
  padding: "2px 8px",
  fontSize: 12,
  borderRadius: 999,
  background: "rgba(59,130,246,.08)",
  color: "#1d4ed8",
  border: "1px solid rgba(59,130,246,.2)",
};
const addr_reloadBtn = { padding: '4px 8px', cursor: 'pointer', borderRadius: 6, border: '1px solid #e5e7eb', background: 'white' };

// ======================= CartCheckout =======================
const CartCheckout = () => {
  const mountedRef = useRef(true);
  const isLoadingRef = useRef(false); // guard để tránh gọi load liên tục
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [shippingMethod, setShippingMethod] = useState('express');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isActing, setIsActing] = useState(false);

  // NEW: set của item đang edit để disable nút +/- 
  const [editingItems, setEditingItems] = useState(new Set());

  const userId = getUserId();
  const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Lỗi tải thông tin user:", error);
      }
    };
    if (userId) fetchProfile();
  }, [userId]);
  useEffect(() => {
    mountedRef.current = true;
    loadCart();

    // listen to broadcast events so cart auto-refreshes
    const onCartUpdated = () => {
      if (isLoadingRef.current) return;
      loadCart();
    };
    const onStorage = (e) => {
      if (e.key === 'cart') {
        if (isLoadingRef.current) return;
        loadCart();
      }
    };

    window.addEventListener('cartUpdated', onCartUpdated);
    window.addEventListener('storage', onStorage);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('cartUpdated', onCartUpdated);
      window.removeEventListener('storage', onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCart = async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    try {
      if (mountedRef.current) {
        setIsLoading(true);
      }

      const data = await CartService.getCart();

      // normalize items (giữ logic cũ) but preserve *sources*
      const rawItems = Array.isArray(data?.items) ? data.items.map((i, idx) => ({
        originalId: i?.id ?? i?.cartItemId ?? i?.cart_item_id ?? `ci-${idx}`,
        qty: safeNumber(i?.qty) || 1,
        stock: safeNumber(i?.stock),
        price: safeNumber(i?.price) || 0,
        productItemId: i?.productItemId ?? i?.product_item_id ?? i?.productItem ?? i?.itemId ?? i?.item_id ?? null,
        sku: i?.sku ?? i?.SKU ?? null,
        productCode: i?.productCode ?? i?.product_code ?? null,
        productImage: i?.productImage ?? i?.image ?? null,
        productName: i?.productName ?? i?.name ?? null,
        raw: i,
      })) : [];

      // MERGE: for each logical product key keep sources array [{originalId, qty}]
      const map = new Map();
      for (const it of rawItems) {
        const key = it.productItemId ?? it.sku ?? it.productCode ?? it.originalId;
        if (!map.has(key)) {
          map.set(key, {
            // displayId: take the first originalId as representative id
            id: it.originalId,
            price: it.price,
            productItemId: it.productItemId,
            sku: it.sku,
            productCode: it.productCode,
            productImage: it.productImage,
            productName: it.productName,
            sources: [{ id: it.originalId, qty: it.qty }],
            qty: it.qty,
            raw: it.raw,
            stock: it.stock,
          });
        } else {
          const exist = map.get(key);
          exist.sources.push({ id: it.originalId, qty: it.qty });
          exist.qty = safeNumber(exist.qty) + safeNumber(it.qty);
          // keep price/productName if missing
          exist.price = exist.price || it.price;
          exist.productImage = exist.productImage || it.productImage;
          exist.productName = exist.productName || it.productName;
          map.set(key, exist);
        }
      }

      const mergedItems = Array.from(map.values());

      const normalized = {
        ...data,
        items: mergedItems,
      };

      if (!mountedRef.current) return;
      setCart(normalized);
      setError(null);
    } catch (err) {
      try {
        const status = err?.response?.status ?? (err?.status || null);
        const respData = err?.response?.data;
        console.error("Lỗi tải giỏ hàng:", status, respData || err?.message || err);
        if (status === 500) {
          if (mountedRef.current) {
            setCart({ items: [] });
            setError(null);
          }
        } else {
          if (mountedRef.current) {
            setError("Không thể tải giỏ hàng.");
            toast.error("Không thể tải giỏ hàng");
          }
        }
      } catch (loggingErr) {
        console.error("Error handling cart load error:", loggingErr);
        if (mountedRef.current) {
          setError("Không thể tải giỏ hàng.");
          toast.error("Không thể tải giỏ hàng");
        }
      }
    } finally {
      isLoadingRef.current = false;
      if (mountedRef.current) setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    const n = safeNumber(price);
    return `${n.toLocaleString("vi-VN")}₫`;
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      const next = new Set(prev);
      next.has(itemId) ? next.delete(itemId) : next.add(itemId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (!cart?.items) return;
    if (selectedItems.size === cart.items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.items.map(item => item.id)));
    }
  };

  // NEW improved quantity update:
  // we try to update the first source to newQty, and remove other sources
  const handleQuantityChange = async (item, newQty) => {
    newQty = Math.max(1, Math.floor(safeNumber(newQty)));
    if (!cart) return;
    const itemId = item.id;
    if ((item.qty || 0) === newQty) return;
    if (editingItems.has(itemId)) return; // already editing

    const prevCart = cart;
    // optimistic UI
    const nextCart = {
      ...cart,
      items: cart.items.map(i => (i.id === itemId ? { ...i, qty: newQty } : i))
    };
    setCart(nextCart);
    setEditingItems(prev => new Set(prev).add(itemId));

    try {
      // if item.sources exists (we stored sources in loadCart)
      const sources = Array.isArray(item.sources) && item.sources.length > 0 ? item.sources : [{ id: item.id, qty: item.qty || 1 }];
      // Strategy:
      // - update the first source to newQty
      // - delete all other sources (so backend will have one entry with correct qty)
      const primary = sources[0];
      await updateSingleSourceQuantity(primary.id, newQty);

      // remove other sources if exist
      if (sources.length > 1) {
        for (let k = 1; k < sources.length; k++) {
          try {
            await removeCartItemFromService(sources[k].id);
          } catch (e) {
            // nếu xóa 1 source fail, log và tiếp tục
            console.warn("Không xóa được source", sources[k].id, e);
          }
        }
      }

      // sau khi cập nhật -> broadcast và reload nhẹ (để đồng bộ)
      broadcastCartChange();
      // cập nhật local item.sources thành 1 source (primary)
      setCart((cur) => cur ? { ...cur, items: cur.items.map(it => it.id === itemId ? { ...it, qty: newQty, sources: [{ id: primary.id, qty: newQty }] } : it) } : cur);
      toast.success("Đã cập nhật số lượng");
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
      toast.error(err?.message || "Không thể cập nhật số lượng");
      if (mountedRef.current) setCart(prevCart); // revert
    } finally {
      setEditingItems(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  useEffect(() => {
    if (!cart?.items) {
      setSelectedItems(new Set());
      return;
    }
    setSelectedItems((prev) => {
      const ids = new Set(cart.items.map((i) => i.id));
      const next = new Set();
      prev.forEach((id) => { if (ids.has(id)) next.add(id); });
      return next;
    });
  }, [cart?.items]);

  const handleRemoveItem = async (cartItemId) => {
    setIsActing(true);
    try {
      await removeCartItemFromService(cartItemId);
      if (mountedRef.current && cart) {
        setCart({ ...cart, items: cart.items.filter(i => i.id !== cartItemId) });
        setSelectedItems(prev => {
          const next = new Set(prev);
          next.delete(cartItemId);
          return next;
        });
      }
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      broadcastCartChange();
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
      toast.error(err?.message || "Không thể xóa sản phẩm");
    } finally {
      if (mountedRef.current) setIsActing(false);
    }
  };

  const getOptionsDisplay = (selectedOptions) => {
    if (!selectedOptions || selectedOptions.length === 0) return null;
    return selectedOptions.map(opt => opt.value).join(" - ");
  };

  const handleRemoveSelected = async () => {
    if (!cart?.items || selectedItems.size === 0) return;
    setIsActing(true);
    try {
      for (const id of Array.from(selectedItems)) {
        try { await removeCartItemFromService(id); } catch (e) { console.warn('skip remove error', id, e); }
      }
      if (mountedRef.current) {
        setCart((current) => current ? { ...current, items: current.items.filter((i) => !selectedItems.has(i.id)) } : current);
        setSelectedItems(new Set());
        toast.success("Đã xóa các sản phẩm đã chọn");
        broadcastCartChange();
      }
    } catch (err) {
      console.error("Lỗi xóa đã chọn:", err);
      toast.error("Không thể xóa các sản phẩm đã chọn");
    } finally {
      if (mountedRef.current) setIsActing(false);
    }
  };

  // ------------------------
  // Tính lại totals: COUNT theo tổng số lượng (qty), TOTAL theo price * qty
  // Nếu không có selection nào => coi là chọn tất cả
  // ------------------------
  const { selectedTotal, selectedCount, shippingPrice } = useMemo(() => {
    if (!cart?.items) return { selectedTotal: 0, selectedCount: 0, shippingPrice: 0 };

    // nếu user chưa chọn item nào => coi như chọn tất cả item trong giỏ
    const idsToInclude = (selectedItems && selectedItems.size > 0)
      ? new Set(selectedItems)
      : new Set(cart.items.map(i => i.id));

    let total = 0;
    let countQty = 0; // tổng số lượng (qty)
    for (const item of cart.items) {
      if (idsToInclude.has(item.id)) {
        const qty = Math.max(1, safeNumber(item.qty));
        total += (safeNumber(item.price) || 0) * qty;
        countQty += qty;
      }
    }

    const shipping = shippingMethod === 'express' ? 35000 : 20000;
    return { selectedTotal: total, selectedCount: countQty, shippingPrice: shipping };
  }, [cart?.items, selectedItems, shippingMethod]);
  const hasInvalidItems = cart?.items?.some(i => i.qty > i.stock);
  // Nếu user chưa chọn item nào, khi bấm proceed thì chọn tất cả (và mở modal)
  const handleProceedToPayment = () => {
    if (!cart?.items || cart.items.length === 0) {
      toast.warning("Giỏ hàng đang trống");
      return;
    }
    if (userProfile) {
      const phone = userProfile.phoneNumber || userProfile.phone || userProfile.phone_number;
      if (!phone || phone.trim() === '') {
        toast.error("Bạn chưa có số điện thoại. Vui lòng cập nhật trong Hồ sơ cá nhân trước khi đặt hàng!");

        // (Tùy chọn) Chuyển hướng sang trang profile sau 1.5s
        // setTimeout(() => window.location.href = "/profile", 1500);

        return; // 🛑 Dừng lại, không cho mở modal
      }
    }
    // Nếu chưa chọn item nào -> coi như chọn tất cả (đồng bộ UI)
    if (!selectedItems || selectedItems.size === 0) {
      setSelectedItems(new Set(cart.items.map(i => i.id)));
      setTimeout(() => {
        if (!selectedAddressId) {
          toast.warning("Vui lòng chọn địa chỉ giao hàng");
        }
        setShowPaymentModal(true);
      }, 0);
      return;
    }

    if (!selectedAddressId) {
      toast.warning("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    setShowPaymentModal(true);
  };

  // Thay: gửi items kèm qty cho backend (không chỉ id)
  const handleConfirmOrder = async () => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập để đặt hàng");
      return;
    }
    if (!cart?.items || cart.items.length === 0) {
      toast.error("Giỏ hàng rỗng");
      return;
    }
    setIsProcessingOrder(true);
    try {
      const paymentProviderMap = { qr: 'VietQR', card: 'VISA', cod: 'Tiền mặt' };
      const paymentTypeMap = { qr: 'Chuyển khoản ngân hàng', card: 'Thẻ tín dụng', cod: 'Thanh toán khi nhận hàng' };

      // Nếu selectedItems rỗng -> dùng tất cả
      const idsSet = (selectedItems && selectedItems.size > 0)
        ? new Set(selectedItems)
        : new Set(cart.items.map(i => i.id));

      // Tạo danh sách items kèm qty để gửi lên backend
      const itemsPayload = (cart.items || [])
        .filter(i => idsSet.has(i.id))
        .map(i => ({
          itemId: i.id,
          productItemId: i.productItemId ?? null,
          qty: Math.max(1, safeNumber(i.qty)),
          price: safeNumber(i.price) || 0,
        }));

      if (itemsPayload.length === 0) {
        toast.error("Không có sản phẩm hợp lệ để thanh toán");
        setIsProcessingOrder(false);
        return;
      }

      const orderRequest = {
        userId,
        paymentTypeName: paymentTypeMap[paymentMethod],
        paymentProvider: paymentProviderMap[paymentMethod],
        paymentAccountNumber: paymentMethod === 'qr' ? '4605016865' : '',
        paymentStatus: paymentMethod === 'cod' ? 'Chưa thanh toán' : 'Đã thanh toán',
        shippingMethodName: shippingMethod === 'express' ? 'Giao nhanh' : 'Giao tiêu chuẩn',
        shippingPrice: shippingPrice,
        orderStatus: 'Đang xử lý',
        items: itemsPayload,              // <-- gửi items + qty
        selectedItemIds: itemsPayload.map(x => x.itemId), // giữ trường cũ nếu backend dùng
        shippingAddressId: selectedAddressId,
        totalAmount: selectedTotal + shippingPrice
      };

      await OrderService.createOrder(orderRequest);

      toast.success("Đặt hàng thành công!");
      broadcastCartChange();

      if (mountedRef.current && cart) {
        const removedIds = new Set(itemsPayload.map(x => x.itemId));
        setCart({ ...cart, items: cart.items.filter(i => !removedIds.has(i.id)) });
        setSelectedItems(new Set());
        setShowPaymentModal(false);
      }
    } catch (err) {
      console.error("Lỗi tạo đơn hàng:", err);
      toast.error("Không thể tạo đơn hàng. Vui lòng thử lại!");
    } finally {
      if (mountedRef.current) setIsProcessingOrder(false);
    }
  };

  // Loading skeleton
  if (isLoading && !cart) {
    return (
      <div className="loading-container">
        <style>{`
          .loading-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            display: flex; align-items: center; justify-content: center;
          }
          .loading-card {
            padding: 2rem; background: white; border-radius: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); text-align: center;
          }
          .spinner {
            width: 4rem; height: 4rem; border: 4px solid #e5e7eb; border-top-color: #3b82f6;
            border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          .loading-text { color: #6b7280; font-weight: 500; }
        `}</style>
        <div className="loading-card">
          <div className="spinner"></div>
          <p className="loading-text">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  // Render (full CSS and UI kept)
  return (
    <>
      <style>{`
        .cart-page { min-height: 100vh; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); font-family: system-ui, -apple-system, sans-serif; }
        .container { max-width: 1280px; margin: 0 auto; padding: 1rem; }
        @media (min-width: 768px) { .container { padding: 2rem; } }
        .card { background: white; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-bottom: 1.5rem; }
        .card-header { padding: 1.5rem; background: rgba(243, 244, 246, 0.5); border-radius: 1rem 1rem 0 0; }
        .card-content { padding: 1.5rem; }
        .header-content { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
        .header-left { display: flex; align-items: center; gap: 0.75rem; }
        .header-icon { width: 3rem; height: 3rem; background: #3b82f6; color: white; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
        .header-title { font-size: 1.5rem; font-weight: bold; color: #1f2937; }
        @media (min-width: 768px) { .header-title { font-size: 2.25rem; } }
        .header-subtitle { color: #6b7280; font-size: 0.875rem; margin-top: 0.25rem; }
        .back-button { padding: 0.5rem 1rem; background: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; font-size: 0.875rem; }
        .back-button:hover { background: #f9fafb; }
        .error-card { border-left: 4px solid #ef4444; margin-bottom: 1.5rem; }
        .error-content { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; padding: 1rem; }
        .error-text { color: #ef4444; font-weight: 500; display: flex; align-items: center; gap: 0.75rem; }
        .retry-button { padding: 0.25rem 0.75rem; background: #ef4444; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem; }
        .close-button { padding: 0.25rem 0.75rem; background: transparent; border: none; cursor: pointer; font-size: 0.875rem; }
        .empty-cart { padding: 4rem; text-align: center; }
        .empty-icon { width: 8rem; height: 8rem; background: #f3f4f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 4rem; }
        .empty-title { font-size: 1.875rem; font-weight: bold; color: #1f2937; margin-bottom: 0.75rem; }
        .empty-text { color: #6b7280; font-size: 1.125rem; margin-bottom: 2rem; }
        .continue-button { padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; font-size: 1.125rem; cursor: pointer; }
        .continue-button:hover { background: #2563eb; }
        .grid-container { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media (min-width: 1024px) { .grid-container { grid-template-columns: 2fr 1fr; } }
        .cart-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
        .cart-title { font-size: 1.125rem; font-weight: bold; }
        @media (min-width: 768px) { .cart-title { font-size: 1.25rem; } }
        .delete-selected { padding: 0.5rem 1rem; background: transparent; color: #ef4444; border: none; cursor: pointer; font-size: 0.875rem; }
        .delete-selected:disabled { opacity: 0.5; cursor: not-allowed; }
        .cart-item { padding: 1rem; transition: all 0.2s; border-bottom: 1px solid #e5e7eb; }
        @media (min-width: 768px) { .cart-item { padding: 1.25rem; } }
        .cart-item:hover { background: rgba(243, 244, 246, 0.3); }
        .cart-item.selected { background: rgba(243, 244, 246, 0.5); }
        .cart-item-content { display: flex; gap: 0.75rem; }
        @media (min-width: 768px) { .cart-item-content { gap: 1rem; } }
        .product-image { width: 5rem; height: 5rem; background: #f3f4f6; border-radius: 0.75rem; overflow: hidden; flex-shrink: 0; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
        @media (min-width: 768px) { .product-image { width: 7rem; height: 7rem; } }
        .product-image img { width: 100%; height: 100%; object-fit: cover; }
        .product-name { font-weight: bold; color: #1f2937; margin-bottom: 0.5rem; font-size: 1rem; }
        @media (min-width: 768px) { .product-name { font-size: 1.125rem; } }
        .options-badge { display: inline-block; font-size: 0.75rem; background: #f3f4f6; padding: 0.375rem 0.75rem; border-radius: 0.5rem; color: #6b7280; font-weight: 500; margin-bottom: 0.5rem; }
        @media (min-width: 768px) { .options-badge { font-size: 0.875rem; } }
        .custom-badge { display: inline-block; font-size: 0.75rem; background: rgba(59,130,246,0.1); color: #3b82f6; padding: 0.375rem 0.75rem; border-radius: 0.5rem; font-weight: 500; margin-bottom: 0.5rem; }
        .product-price { font-size: 1.125rem; font-weight: bold; color: #3b82f6; margin-bottom: 0.75rem; }
        @media (min-width: 768px) { .product-price { font-size: 1.25rem; } }
        .quantity-control { display: flex; align-items: center; border: 2px solid #e5e7eb; border-radius: 0.75rem; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .quantity-button { height: 2rem; width: 2rem; padding: 0; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .quantity-button:hover:not(:disabled) { background: #f3f4f6; }
        .quantity-button:disabled { opacity: 0.5; cursor: not-allowed; }
        .quantity-display { width: 2.5rem; height: 2rem; display: flex; align-items: center; justify-content: center; border-left: 2px solid #e5e7eb; border-right: 2px solid #e5e7eb; font-weight: bold; color: #1f2937; }
        .price-total { font-weight: bold; color: #1f2937; font-size: 0.875rem; }
        @media (min-width: 768px) { .price-total { font-size: 1rem; } }
        .remove-button { height: 2rem; padding: 0 0.5rem; background: transparent; border: none; color: #ef4444; cursor: pointer; transition: all 0.2s; }
        .remove-button:hover { background: rgba(239, 68, 68, 0.1); }
        .summary-card { position: sticky; top: 1rem; }
        .summary-title { font-size: 1.25rem; font-weight: bold; }
        @media (min-width: 768px) { .summary-title { font-size: 1.5rem; } }
        .summary-subtitle { color: #6b7280; font-size: 0.75rem; }
        @media (min-width: 768px) { .summary-subtitle { font-size: 0.875rem; } }
        .summary-row { display: flex; justify-content: space-between; align-items: center; color: #1f2937; }
        .summary-label { font-weight: 500; font-size: 0.875rem; }
        @media (min-width: 768px) { .summary-label { font-size: 1rem; } }
        .summary-value { font-weight: bold; font-size: 1rem; }
        @media (min-width: 768px) { .summary-value { font-size: 1.125rem; } }
        .separator { height: 1px; background: #e5e7eb; margin: 1rem 0; }
        .shipping-option { display: flex; align-items: center; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; margin-bottom: 0.5rem; }
        .shipping-option:hover { background: rgba(243, 244, 246, 0.5); }
        .total-box { background: rgba(243, 244, 246, 0.5); border-radius: 0.75rem; padding: 1rem; margin: 1.5rem 0; }
        .total-row { display: flex; justify-content: space-between; align-items: center; }
        .total-label { font-size: 1rem; font-weight: bold; color: #1f2937; }
        @media (min-width: 768px) { .total-label { font-size: 1.125rem; } }
        .total-amount { font-size: 1.25rem; font-weight: bold; color: #3b82f6; }
        @media (min-width: 768px) { .total-amount { font-size: 1.5rem; } }
        .checkout-button { width: 100%; padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .checkout-button:hover:not(:disabled) { background: #2563eb; transform: translateY(-1px); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .checkout-button:disabled { opacity: 0.5; cursor: not-allowed; }
        .warning-box { font-size: 0.75rem; color: #6b7280; text-align: center; background: rgba(251, 191, 36, 0.1); padding: 0.75rem; border-radius: 0.5rem; margin-top: 1rem; }
        @media (min-width: 768px) { .warning-box { font-size: 0.875rem; } }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 1rem; }
        .modal-card { max-width: 42rem; width: 100%; max-height: 90vh; overflow-y: auto; background: white; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .modal-header { text-align: center; padding: 1.5rem; }
        .modal-icon { width: 4rem; height: 4rem; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); font-size: 1.875rem; }
        @media (min-width: 768px) { .modal-icon { width: 5rem; height: 5rem; font-size: 2.25rem; } }
        .modal-title { font-size: 1.5rem; font-weight: bold; }
        @media (min-width: 768px) { .modal-title { font-size: 1.875rem; } }
        .order-summary-box { background: rgba(243, 244, 246, 0.5); border-radius: 0.75rem; padding: 1.25rem; margin-bottom: 1.5rem; }
        @media (min-width: 768px) { .order-summary-box { padding: 1.5rem; } }
        .summary-item-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .payment-option { display: flex; align-items: center; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; margin-bottom: 0.5rem; }
        .payment-option:hover { background: rgba(243, 244, 246, 0.5); }
        .input-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .input-label { font-weight: 500; font-size: 0.875rem; }
        .input { padding: 0.5rem 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; font-size: 1rem; transition: all 0.2s; }
        .input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        .cod-info { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); border-radius: 0.75rem; padding: 1rem; margin-bottom: 1.5rem; font-size: 0.875rem; color: #1f2937; }
        .modal-actions { display: flex; gap: 0.75rem; }
        @media (min-width: 768px) { .modal-actions { gap: 1rem; } }
        .cancel-button { flex: 1; padding: 0.75rem 1.5rem; background: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .cancel-button:hover { background: #f9fafb; }
        .confirm-button { flex: 1; padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .confirm-button:hover:not(:disabled) { background: #2563eb; }
        .confirm-button:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div className="cart-page">
        <div className="container">
          {/* Error */}
          {error && (
            <div className="error-card">
              <div className="error-content">
                <div className="error-text"><span>Lỗi</span><span>{error}</span></div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="retry-button" onClick={loadCart}>Thử lại</button>
                  <button className="close-button" onClick={() => setError(null)}>x</button>
                </div>
              </div>
            </div>
          )}

          {/* Empty Cart */}
          {!cart?.items || cart.items.length === 0 ? (
            <div className="card">
              <div className="empty-cart">
                <div className="empty-icon">🛍️</div>
                <h2 className="empty-title">Giỏ hàng trống</h2>
                <p className="empty-text">Hãy thêm vài sản phẩm yêu thích của bạn nhé!</p>
                <button className="continue-button" onClick={() => window.history.back()}>
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '1.5rem' }}>
              {/* AddressSelector lấy từ DB */}
              <AddressSelector
                selectedAddressId={selectedAddressId}
                onSelectAddress={setSelectedAddressId}
              />

              <div className="grid-container">
                {/* Cart Items */}
                <div>
                  <div className="card">
                    <div className="card-header">
                      <div className="cart-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <input
                            type="checkbox"
                            checked={selectedItems.size === cart.items.length && cart.items.length > 0}
                            onChange={toggleSelectAll}
                          />
                          <h3 className="cart-title">Sản phẩm ({cart.items.length})</h3>
                        </div>
                        <button
                          className="delete-selected"
                          disabled={selectedItems.size === 0 || isActing}
                          onClick={handleRemoveSelected}
                        >
                          Xóa đã chọn
                        </button>
                      </div>
                    </div>

                    <div className="card-content" style={{ padding: 0 }}>
                      {cart.items.map((item) => {
                        const isSelected = selectedItems.has(item.id);
                        const optionsDisplay = getOptionsDisplay(item.selectedOptions);
                        const isEditing = editingItems.has(item.id);
                        return (
                          <div key={item.id} className={`cart-item ${isSelected ? 'selected' : ''}`}>
                            <div className="cart-item-content">
                              <div style={{ paddingTop: '0.5rem' }}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectItem(item.id)}
                                />
                              </div>

                              <div className="product-image">
                                <img
                                  // 1. MẶC ĐỊNH: Luôn thử tìm ảnh trong folder Product trước
                                  src={item.productImage ? `/Product/${item.productImage}` : 'https://via.placeholder.com/100?text=No+Data'}

                                  alt={item.productName || 'Product'}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}

                                  // 2. XỬ LÝ KHI KHÔNG TÌM THẤY ẢNH
                                  onError={(e) => {
                                    const target = e.target;
                                    const currentSrc = target.src;

                                    // Kiểm tra: Nếu ảnh vừa bị lỗi là ảnh trong /Product/
                                    if (currentSrc.includes('/Product/')) {
                                      // -> Chuyển hướng sang tìm bên CustomProduct
                                      // (Lưu ý: Nếu bạn chưa cấu hình Proxy thì thay dòng dưới thành: `http://localhost:8080/CustomProduct/${item.productImage}`)
                                      target.src = `/CustomProduct/${item.productImage}`;
                                    }
                                    // Nếu ảnh bên CustomProduct cũng lỗi nốt (hoặc lỗi khác)
                                    else {
                                      target.onerror = null; // Ngắt vòng lặp để tránh treo trình duyệt
                                      target.src = 'https://via.placeholder.com/100?text=No+Image'; // Ảnh cuối cùng
                                    }
                                  }}
                                />
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <h3 className="product-name">
                                  Mã: <span style={{ color: '#0f172a', fontWeight: 800 }}>{item.productCode ?? item.sku ?? item.productItemId ?? item.id}</span>
                                </h3>
                                <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                                  {item.stock <= 0 ? (
                                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Hết hàng</span>
                                  ) : item.qty > item.stock ? (
                                    <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                                      Kho chỉ còn {item.stock} sản phẩm
                                    </span>
                                  ) : (
                                    <span style={{ color: '#6b7280' }}>
                                      Còn lại: {item?.stock ?? 0}
                                    </span>
                                  )}
                                </div>
                                {item.productName && (
                                  <div className="product-subname" style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: 4 }}>
                                    {item.productName}
                                  </div>
                                )}
                                {optionsDisplay && <span className="options-badge">{optionsDisplay}</span>}
                                {item.is_customed && <span className="custom-badge">Tùy chỉnh</span>}

                                <p className="product-price">{formatPrice(item.price)}</p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                  <div className="quantity-control">
                                    <button
                                      className="quantity-button"
                                      onClick={() => handleQuantityChange(item, (item.qty || 1) - 1)}
                                      disabled={(item.qty || 1) <= 1 || isEditing || isActing}
                                    >−</button>
                                    <span className="quantity-display">{item.qty || 1}</span>
                                    <button
                                      className="quantity-button"
                                      onClick={() => handleQuantityChange(item, (item.qty || 1) + 1)}
                                      disabled={isEditing || isActing || (item.qty >= item.stock)}
                                    >+</button>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className="price-total">
                                      {formatPrice((item.price || 0) * (item.qty || 1))}
                                    </span>
                                    <button className="remove-button" onClick={() => handleRemoveItem(item.id)}>🗑️</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <div className="card summary-card">
                    <div className="card-header">
                      <h3 className="summary-title">Tóm tắt đơn hàng</h3>
                      <p className="summary-subtitle">Kiểm tra thông tin trước khi thanh toán</p>
                    </div>
                    <div className="card-content" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="summary-row">
                          <span className="summary-label">Đã chọn</span>
                          <span className="summary-value">{selectedCount} sản phẩm</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Tạm tính</span>
                          <span className="summary-value">{formatPrice(selectedTotal)}</span>
                        </div>

                        <div className="separator"></div>

                        <div>
                          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem' }}>
                            Phương thức vận chuyển
                          </label>
                          <div className="shipping-option" onClick={() => setShippingMethod('express')}>
                            <input type="radio" checked={shippingMethod === 'express'} readOnly />
                            <div style={{ flex: 1, marginLeft: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                              <span>Giao nhanh</span>
                              <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>35.000₫</span>
                            </div>
                          </div>
                          <div className="shipping-option" onClick={() => setShippingMethod('standard')}>
                            <input type="radio" checked={shippingMethod === 'standard'} readOnly />
                            <div style={{ flex: 1, marginLeft: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                              <span>Giao tiêu chuẩn</span>
                              <span style={{ fontWeight: 'bold' }}>20.000₫</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="total-box">
                        <div className="total-row">
                          <span className="total-label">Tổng cộng</span>
                          <span className="total-amount">{formatPrice(selectedTotal + shippingPrice)}</span>
                        </div>
                      </div>

                      <button
                        className="checkout-button"
                        onClick={handleProceedToPayment}
                        disabled={!cart?.items || cart.items.length === 0 || !selectedAddressId || hasInvalidItems}
                      >
                        Thanh toán ngay
                      </button>
                      {hasInvalidItems && (
                        <p className="warning-box" style={{ color: '#ef4444', background: '#fee2e2' }}>
                          ⚠️ Một số sản phẩm đã hết hàng hoặc không đủ số lượng. Vui lòng kiểm tra lại.
                        </p>
                      )}
                      {selectedItems.size === 0 && (
                        <p className="warning-box">Bạn chưa chọn sản phẩm — khi thanh toán sẽ mặc định chọn tất cả.</p>
                      )}
                      {selectedItems.size > 0 && !selectedAddressId && (
                        <p className="warning-box">Vui lòng chọn địa chỉ giao hàng</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Modal */}
              {showPaymentModal && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowPaymentModal(false)}>
                  <div className="modal-card">
                    <div className="modal-header">
                      <div className="modal-icon">✅</div>
                      <h3 className="modal-title">Xác nhận thanh toán</h3>
                    </div>
                    <div className="card-content" style={{ padding: '0 1.5rem 1.5rem' }}>
                      <div className="order-summary-box">
                        <div className="summary-item-row">
                          <span style={{ color: '#6b7280', fontWeight: 500 }}>Số sản phẩm:</span>
                          <span style={{ fontWeight: 'bold' }}>{selectedCount}</span>
                        </div>
                        <div className="summary-item-row">
                          <span style={{ color: '#6b7280', fontWeight: 500 }}>Tạm tính:</span>
                          <span style={{ fontWeight: 'bold' }}>{formatPrice(selectedTotal)}</span>
                        </div>
                        <div className="summary-item-row">
                          <span style={{ color: '#6b7280', fontWeight: 500 }}>Phí vận chuyển:</span>
                          <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>{formatPrice(shippingPrice)}</span>
                        </div>
                        <div className="separator"></div>
                        <div className="summary-item-row">
                          <span style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Tổng cộng:</span>
                          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                            {formatPrice(selectedTotal + shippingPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Chọn phương thức thanh toán */}
                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem' }}>
                          Phương thức thanh toán
                        </label>

                        <div className="payment-option" onClick={() => setPaymentMethod('qr')}>
                          <input type="radio" checked={paymentMethod === 'qr'} readOnly />
                          <label style={{ flex: 1, marginLeft: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>Chuyển khoản QR (VietQR)</span>
                            <span>📱</span>
                          </label>
                        </div>

                        <div className="payment-option" onClick={() => setPaymentMethod('card')}>
                          <input type="radio" checked={paymentMethod === 'card'} readOnly />
                          <label style={{ flex: 1, marginLeft: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>Thẻ tín dụng/ghi nợ</span>
                            <span>💳</span>
                          </label>
                        </div>

                        <div className="payment-option" onClick={() => setPaymentMethod('cod')}>
                          <input type="radio" checked={paymentMethod === 'cod'} readOnly />
                          <label style={{ flex: 1, marginLeft: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>Thanh toán khi nhận hàng (COD)</span>
                            <span>💵</span>
                          </label>
                        </div>
                      </div>

                      {paymentMethod === 'qr' && (
                        <PaymentQR
                          bankCode="BIDV"
                          accountNumber="4605016865"
                          amount={selectedTotal + shippingPrice}
                          info={`Thanh toan don hang ${cart?.id || ''}`}
                        />
                      )}

                      {paymentMethod === 'cod' && (
                        <div className="cod-info">
                          Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng. Số tiền:{' '}
                          <b style={{ color: '#3b82f6' }}>{formatPrice(selectedTotal + shippingPrice)}</b>
                        </div>
                      )}

                      <div className="modal-actions">
                        <button className="cancel-button" onClick={() => setShowPaymentModal(false)}>Hủy</button>
                        <button className="confirm-button" onClick={handleConfirmOrder} disabled={isProcessingOrder}>
                          {isProcessingOrder ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartCheckout;
