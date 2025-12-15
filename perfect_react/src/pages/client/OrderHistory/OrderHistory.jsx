
import React, { useState, useEffect } from 'react';
import {
  Package, Calendar, DollarSign, Truck,
  CheckCircle, Clock, XCircle, Eye
} from 'lucide-react';
import OrderHistoryService from '../../../services/orderHistory.js';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('PENDING');
  const [cancellingIds, setCancellingIds] = useState(new Set());

  

  const parseNumber = (v) => {
    if (v === null || v === undefined || v === '') return 0;
    if (typeof v === 'number') return v;
    let str = String(v).trim();
    str = str.replace(/[^\d.,-]/g, '');
    if (str.indexOf(',') !== -1 && str.indexOf('.') !== -1) {
      str = str.replace(/,/g, '');
    } else if (str.indexOf(',') !== -1 && str.indexOf('.') === -1) {
      str = str.replace(/,/g, '');
    }
    str = str.replace(/[^\d.-]/g, '');
    const n = parseFloat(str);
    return Number.isFinite(n) ? n : 0;
  };

  const normalizeStatus = (raw) => {
    if (raw === null || raw === undefined) return 'PENDING';
    const sRaw = String(raw).trim();
    const sNoDiacritics = sRaw
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();

    const map = {
      PENDING: ['PENDING', 'WAITING', 'PREPARING', 'AWAITING CONFIRMATION', 'NEW', 'CHO', 'CHO XAC NHAN', 'CHO_XAC_NHAN'],
      PROCESSING: ['PROCESSING', 'PROCESS', 'IN_PROGRESS', 'XU LY', 'DANG XU LY', 'DANG_XU_LY'],
      SHIPPING: ['SHIPPING', 'IN_TRANSIT', 'DELIVERING', 'ON_DELIVERY', 'OUT_FOR_DELIVERY', 'GIAO HANG', 'GIAO', 'DANG GIAO', 'SHIPPED'],
      DELIVERED: ['DELIVERED', 'SUCCESS', 'COMPLETED', 'DELIVERED_SUCCESS', 'DA GIAO', 'HOAN THANH'],
      CANCELLED: ['CANCELLED', 'CANCELED', 'VOID', 'REFUNDED', 'DA HUY', 'DA_HUY']
    };

    for (const key of Object.keys(map)) {
      if (map[key].some(val => val === sNoDiacritics || sNoDiacritics.includes(val))) return key;
    }

    if (sNoDiacritics.includes('GIAO')) return 'SHIPPING';
    if (sNoDiacritics.includes('DA GIAO') || sNoDiacritics.includes('HOAN')) return 'DELIVERED';
    if (sNoDiacritics.includes('HUY') || sNoDiacritics.includes('CANCEL')) return 'CANCELLED';
    if (sNoDiacritics.includes('XU LY') || sNoDiacritics.includes('PROCESS')) return 'PROCESSING';
    if (sNoDiacritics.includes('CHO') || sNoDiacritics.includes('PEND')) return 'PENDING';

    if (!isNaN(Number(sNoDiacritics))) {
      const n = Number(sNoDiacritics);
      if (n === 0 || n === 1) return 'PENDING';
      if (n === 2) return 'PROCESSING';
      if (n === 3 || n === 4) return 'SHIPPING';
      if (n === 5) return 'DELIVERED';
      if (n === 6 || n === -1) return 'CANCELLED';
    }

    console.warn('OrderHistory: unknown status value (normalized):', sRaw, '->', sNoDiacritics);
    return 'PENDING';
  };

  
  const fetchProductItemsByIds = async (ids) => {
    if (!ids || ids.length === 0) return {};
    const map = {};
    const uniq = Array.from(new Set(ids.map(id => (typeof id === 'string' && id.trim() !== '' ? id.trim() : id))));

    
    try {
      
 

      if (res.ok) {
        const arr = await res.json();
        if (Array.isArray(arr)) {
          arr.forEach(pi => {
            const possibleIds = [
              pi.id, pi.productItemId, pi.product_item_id,
              (pi.product && (pi.product.id || pi.product.productItemId)) || undefined
            ].filter(v => v !== undefined && v !== null);
            possibleIds.forEach(k => {
              map[String(k)] = pi;
              if (typeof k === 'number') map[k] = pi;
            });
          });
          return map;
        }
      } else {
        console.info('Batch /api/product-items returned non-ok status', res.status);
      }
    } catch (e) {
      console.info('Batch fetch product-items failed, fallback to single fetch:', e);
    }

    
    await Promise.all(uniq.map(async (id) => {
      try {
        const endpoints = [
          `/api/products/${id}`,
          `/api/product/${id}`,
          `/api/products/item/${id}`
        ];
        let got = null;
        for (const ep of endpoints) {
          try {
            const r = await fetch(ep);
            if (r.ok) {
              const pi = await r.json();
              if (pi) { got = pi; break; }
            }
          } catch (_) {  }
        }
        if (got) {
          const possibleIds = [
            got.id, got.productItemId, got.product_item_id,
            (got.product && (got.product.id || got.product.productItemId)) || undefined
          ].filter(v => v !== undefined && v !== null);
          possibleIds.forEach(k => {
            map[String(k)] = got;
            if (typeof k === 'number') map[k] = got;
          });
        }
      } catch (err) {
        console.debug('single fetch failed for product-item', id, err);
      }
    }));

    return map;
  };

  
  const fetchNamesForMissingIds = async (missingIds) => {
    if (!missingIds || missingIds.length === 0) return {};
    const resultMap = {};
    await Promise.all(missingIds.map(async (id) => {
      try {
        const endpoints = [

          `/api/products/${id}`,
          `/api/product/${id}`,
          `/api/products/item/${id}`,
          `/api/items/${id}`
        ];
        for (const ep of endpoints) {
          try {
            const r = await fetch(ep);
            if (!r.ok) continue;
            const body = await r.json();
            
            const candidates = [
              body?.name, body?.productName, body?.title,
              body?.product?.name, body?.product?.title,
              body?.productDto?.name, body?.productDto?.title,
              body?.data?.name, body?.data?.productName
            ];
            const found = candidates.find(x => x !== undefined && x !== null && String(x).trim() !== '');
            if (found) {
              resultMap[id] = String(found).trim();
              break;
            }
            
            const nested = body?.item || body?.data || body?.product;
            if (nested) {
              const nestedCandidates = [
                nested?.name, nested?.productName, nested?.title, nested?.product?.name
              ];
              const f2 = nestedCandidates.find(x => x !== undefined && x !== null && String(x).trim() !== '');
              if (f2) {
                resultMap[id] = String(f2).trim();
                break;
              }
            }
          } catch (e) {
            
          }
        }
      } catch (err) {
        
      }
    }));
    return resultMap;
  };

  const cancelOrderWithService = async (orderId) => {
    const candidates = [
      'cancelOrder', 'cancel', 'cancelById', 'cancelOrderById', 'deleteOrder', 'updateOrderStatus'
    ];
    for (const name of candidates) {
      const fn = OrderHistoryService?.[name];
      if (typeof fn === 'function') {
        try {
          return await fn.call(OrderHistoryService, orderId);
        } catch (err) {
          try { return await fn.call(OrderHistoryService, { orderId }); } catch (_) {  }
        }
      }
    }
    if (typeof OrderHistoryService === 'object' && typeof OrderHistoryService.api === 'object' && typeof OrderHistoryService.api.delete === 'function') {
      try { return await OrderHistoryService.api.delete(`/orders/${orderId}`); } catch (e) {}
      try { return await OrderHistoryService.api.delete(`/order/${orderId}`); } catch (e) {}
    }
    throw new Error('Không thể huỷ đơn: backend/service không hỗ trợ API huỷ (check OrderHistoryService).');
  };

  const handleCancelOrder = async (order) => {
    const orderId = order.orderId ?? order.id ?? (order.raw && (order.raw.id ?? order.raw.orderId));
    if (!orderId) {
      alert('Không xác định được mã đơn hàng để huỷ.');
      return;
    }
    const ok = window.confirm(`Bạn có chắc muốn huỷ đơn #${orderId}? Hành động này không thể hoàn tác.`);
    if (!ok) return;

    setCancellingIds(prev => new Set(prev).add(orderId));
    try {
      await cancelOrderWithService(orderId);
      setOrders(prev => prev.map(o => {
        const oId = o.orderId ?? o.id ?? (o.raw && (o.raw.id ?? o.raw.orderId));
        if (oId === orderId) {
          return { ...o, status: 'CANCELLED', raw: { ...(o.raw || {}), cancelledAt: new Date().toISOString() } };
        }
        return o;
      }));
      if (selectedOrder) {
        const sId = selectedOrder.orderId ?? selectedOrder.id;
        if (sId === orderId) {
          setSelectedOrder(prev => prev ? ({ ...prev, status: 'CANCELLED' }) : prev);
        }
      }
      alert(`Đã huỷ đơn #${orderId} thành công.`);
    } catch (err) {
      console.error('Huỷ đơn lỗi:', err);
      const msg = err?.response?.data?.message || err?.message || 'Huỷ đơn thất bại. Vui lòng thử lại.';
      alert(msg);
    } finally {
      setCancellingIds(prev => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  };

  
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const data = await OrderHistoryService.getOrdersByUser();
        console.debug('OrderHistory - raw data:', data);

        if (!Array.isArray(data)) {
          setOrders([]);
          return;
        }

        
        const idSet = new Set();
        data.forEach(o => {
          const itemsRaw = Array.isArray(o.items)
            ? o.items
            : Array.isArray(o.orderLines)
              ? o.orderLines
              : Array.isArray(o.order_lines)
                ? o.order_lines
                : [];

          itemsRaw.forEach(it => {
            const pid = it.productItemId ?? it.product_item_id ?? it.productId ?? it.product_id ?? it.id ?? it.sku ?? null;
            if (pid != null) idSet.add(pid);
          });
        });
        const productItemIds = Array.from(idSet);

        
        const productItemMap = await fetchProductItemsByIds(productItemIds);

        
        let normalized = data.map(rawOrder => {
          try {
            const orderId = rawOrder.id ?? rawOrder.order_id ?? rawOrder.orderId ?? rawOrder._id;
            const status = normalizeStatus(rawOrder.orderStatus ?? rawOrder.order_status ?? rawOrder.status ?? rawOrder.state);
            const orderDate = rawOrder.orderDate ?? rawOrder.order_date ?? rawOrder.createdAt ?? rawOrder.date;

            const itemsRaw = Array.isArray(rawOrder.items)
              ? rawOrder.items
              : Array.isArray(rawOrder.orderLines)
                ? rawOrder.orderLines
                : Array.isArray(rawOrder.order_lines)
                  ? rawOrder.order_lines
                  : [];

            const items = itemsRaw.map((it, idx) => {
              const pid = it.productItemId ?? it.product_item_id ?? it.productId ?? it.product_id ?? it.id ?? null;
              let pi = null;
              if (pid != null) {
                pi = productItemMap[pid] || productItemMap[String(pid)] || productItemMap[Number(pid)] || null;
              }

              const customProduct = it.customProduct ?? it.custom_product ?? null;
              const nestedProduct = (pi && (pi.product ?? pi.productDto)) ?? (it.product || it.productDto || it.productInfo) ?? null;

              const nameCandidates = [
                customProduct?.name,
                customProduct?.title,
                nestedProduct?.name,
                nestedProduct?.title,
                pi?.productName,
                pi?.name,
                it.productName,
                it.product_name,
                it.name,
                it.title
              ];
              const foundName = nameCandidates.find(n => n !== undefined && n !== null && String(n).trim() !== '');
              const productName = foundName ? String(foundName).trim() : (pid != null ? `Sản phẩm #${pid}` : `Sản phẩm ${idx + 1}`);

              const quantity = Number(it.qty ?? it.quantity ?? it.count ?? 1);
              const price = parseNumber(it.price ?? pi?.price ?? pi?.unitPrice ?? nestedProduct?.price ?? 0);

              if (!foundName) {
                
                console.debug('OrderHistory: missing human-readable name for item (will attempt fallback). item raw:', it, 'lookup pi:', pi);
              }

              return {
                productName,
                quantity: Number.isFinite(Number(quantity)) ? Number(quantity) : 1,
                price,
                raw: it
              };
            });

            let totalAmount = parseNumber(rawOrder.orderTotal ?? rawOrder.order_total ?? rawOrder.total ?? rawOrder.amount ?? 0);
            if (!totalAmount || totalAmount === 0) {
              totalAmount = items.reduce((s, it) => s + (Number(it.price) * Number(it.quantity || 1)), 0);
            }

            return {
              orderId,
              orderDate,
              status,
              items,
              totalAmount,
              raw: rawOrder
            };
          } catch (err) {
            console.error('normalizeOrder (with map) failed:', err, rawOrder);
            return {
              orderId: rawOrder.id ?? rawOrder.orderId,
              orderDate: rawOrder.orderDate ?? rawOrder.order_date,
              status: 'PENDING',
              items: [],
              totalAmount: 0,
              raw: rawOrder
            };
          }
        });

        setOrders(normalized);

        
        
        const missingIds = new Set();
        normalized.forEach(o => {
          (o.items || []).forEach(it => {
            const m = (it.productName || '').match(/^Sản phẩm #(.+)$/);
            if (m && m[1]) {
              missingIds.add(m[1]);
            }
          });
        });

        if (missingIds.size > 0) {
          const missingArr = Array.from(missingIds);
          console.info('OrderHistory: attempting fallback name fetch for ids:', missingArr);

          const fallbackMap = await fetchNamesForMissingIds(missingArr);
          if (Object.keys(fallbackMap).length > 0) {
            
            setOrders(prevOrders => {
              return prevOrders.map(o => {
                const newItems = (o.items || []).map(it => {
                  const m = (it.productName || '').match(/^Sản phẩm #(.+)$/);
                  if (m && m[1]) {
                    const key = m[1];
                    const foundName = fallbackMap[key] || fallbackMap[Number(key)] || fallbackMap[String(key)];
                    if (foundName) {
                      return { ...it, productName: foundName };
                    }
                  }
                  return it;
                });
                return { ...o, items: newItems };
              });
            });
            console.info('OrderHistory: patched missing product names from fallbackMap.');
          } else {
            console.info('OrderHistory: fallback name fetch did not find names. Check console.debug outputs for raw item shapes.');
          }
        }

      } catch (error) {
        console.error('❌ Lỗi khi tải lịch sử đơn hàng:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    
  }, []);

  
  const adjustMoneyScale = (ordersArr) => {
    if (!Array.isArray(ordersArr) || ordersArr.length === 0) return ordersArr;
    const totals = ordersArr.map(o => parseNumber(o.totalAmount || 0));
    const itemsPrices = [];
    ordersArr.forEach(o => (o.items || []).forEach(it => itemsPrices.push(parseNumber(it.price || 0))));

    const avgTotal = totals.reduce((s, x) => s + x, 0) / Math.max(1, totals.length);
    const avgItem = itemsPrices.length ? itemsPrices.reduce((s, x) => s + x, 0) / itemsPrices.length : 0;

    let scale = 1;
    if (avgItem > 0 && avgItem < 1000 && avgTotal > 100000) scale = 1000;
    else if (avgItem > 0 && avgItem < 100 && avgTotal < 1000) scale = 100;

    if (scale !== 1) {
      console.info(`OrderHistory: applying money scale x${scale} (heuristic). avgItem=${avgItem}, avgTotal=${avgTotal}`);
      return ordersArr.map(o => {
        const newItems = (o.items || []).map(it => ({ ...it, price: parseNumber(it.price) * scale }));
        const newTotal = parseNumber(o.totalAmount || 0) * scale;
        return { ...o, items: newItems, totalAmount: newTotal };
      });
    }
    return ordersArr;
  };

  const formatPrice = (price) => {
    const n = parseNumber(price);
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
  };

  const displayedOrders = React.useMemo(() => {
    const scaled = adjustMoneyScale(orders.map(o => ({ ...o })));
    return scaled.filter(o => o.status === filter);
  }, [orders, filter]);

  

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Đang tải lịch sử đơn hàng...</p>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: { label: 'Chờ xác nhận', color: 'status-pending', icon: Clock },
      PROCESSING: { label: 'Đang xử lý', color: 'status-processing', icon: Package },
      SHIPPING: { label: 'Đang giao hàng', color: 'status-shipping', icon: Truck },
      DELIVERED: { label: 'Đã giao hàng', color: 'status-delivered', icon: CheckCircle },
      CANCELLED: { label: 'Đã hủy', color: 'status-cancelled', icon: XCircle },
    };
    return configs[status] || configs.PENDING;
  };

  return (
    <div className="order-history-container">
      <div className="main-content">
        <div className="filter-tabs">
          {[
            { value: 'PENDING', label: 'Chờ xác nhận' },
            { value: 'PROCESSING', label: 'Đang xử lý' },
            { value: 'SHIPPING', label: 'Đang giao' },
            { value: 'DELIVERED', label: 'Đã giao' },
            { value: 'CANCELLED', label: 'Đã hủy' }
          ].map(tab => (
            <button key={tab.value} onClick={() => setFilter(tab.value)} className={`filter-tab ${filter === tab.value ? 'active' : ''}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {displayedOrders.length === 0 ? (
          <div className="empty-state">
            <Package className="empty-icon" />
            <h3 className="empty-title">Không có đơn hàng nào</h3>
            <p className="empty-text">Không tìm thấy đơn hàng ở trạng thái này</p>
          </div>
        ) : (
          <div className="orders-list">
            {displayedOrders.map(order => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              const orderId = order.orderId ?? order.id ?? (order.raw && (order.raw.id ?? order.raw.orderId));
              const isCancelling = cancellingIds.has(orderId);

              return (
                <div key={order.orderId || order.id} className="order-card">
                  <div className="order-card-header">
                    <div className="order-info-section">
                      <div className="order-icon-box">
                        <Package className="order-icon" />
                      </div>
                      <div>
                        <p className="order-label">Mã đơn hàng</p>
                        <p className="order-id">#{order.orderId || order.id}</p>
                      </div>
                    </div>

                    <div className="order-meta-section">
                      <div className="order-meta">
                        <p className="order-date">
                          <Calendar className="meta-icon" />
                          {order.orderDate ? new Date(order.orderDate).toLocaleString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                        </p>
                        <p className="order-total">
                          <DollarSign className="meta-icon" />
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>

                      <div className={`order-status ${statusConfig.color}`}>
                        <StatusIcon className="status-icon" />
                        {statusConfig.label}
                      </div>
                    </div>
                  </div>

                  <div className="order-items-section">
                    <h4 className="items-title">Sản phẩm đã đặt:</h4>
                    <div className="items-list">
                      {order.items && order.items.map((item, idx) => (
                        <div key={idx} className="item-row">
                          <div className="item-info">
                            <p className="item-name">{item.productName || '—'}</p>
                            <p className="item-quantity">Số lượng: {item.quantity}</p>
                          </div>
                          <p className="item-price">{formatPrice(Number(item.price) * Number(item.quantity || 1))}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-actions">
                    <button onClick={() => setSelectedOrder(order)} className="detail-button">
                      <Eye className="button-icon" />
                      Chi tiết
                    </button>

                    {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
                      <button
                        onClick={() => handleCancelOrder(order)}
                        className="cancel-button"
                        disabled={isCancelling}
                        style={{
                          marginLeft: 8,
                          background: isCancelling ? '#f3f4f6' : '#ef4444',
                          color: isCancelling ? '#6b7280' : 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: 8,
                          cursor: isCancelling ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isCancelling ? 'Đang huỷ...' : 'Huỷ đơn'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Chi tiết đơn hàng #{selectedOrder.orderId}</h2>
              <button onClick={() => setSelectedOrder(null)} className="modal-close">
                <XCircle className="close-icon" />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-grid">
                <div className="info-box info-box-blue">
                  <p className="info-label">Ngày đặt hàng</p>
                  <p className="info-value">{selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleString('vi-VN') : '-'}</p>
                </div>
                <div className="info-box info-box-cyan">
                  <p className="info-label">Tổng tiền</p>
                  <p className="info-price">{formatPrice(selectedOrder.totalAmount)}</p>
                </div>
              </div>

              <div className="modal-section">
                <h3 className="section-title">Danh sách sản phẩm</h3>
                <div className="modal-items-list">
                  {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="modal-item">
                      <div>
                        <p className="modal-item-name">{item.productName || '—'}</p>
                        <p className="modal-item-detail">Đơn giá: {formatPrice(item.price)} × {item.quantity}</p>
                      </div>
                      <p className="modal-item-total">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-status-box">
                <span className="modal-status-label">Trạng thái:</span>
                <span className={`modal-status-badge ${getStatusConfig(selectedOrder.status).color}`}>
                  {getStatusConfig(selectedOrder.status).label}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
