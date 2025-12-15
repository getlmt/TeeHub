import React, { useEffect, useMemo, useState } from 'react';
import styles from './Orders.module.css';
import OrderService from '../../../services/orderService.js';
import { adminFetchUsers } from '../../../services/userService.js';



const Orders = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [userMap, setUserMap] = useState({});

  
  const normalizeStatus = (statusRaw) => {
    if (!statusRaw) return 'pending';
    const s = String(statusRaw).trim().toLowerCase();
    if (['pending', 'chờ thanh toán', 'đang chờ', 'p'].includes(s)) return 'pending';
    if (['processing', 'đang xử lý'].includes(s)) return 'processing';
    if (['shipped', 'đang giao', 'đã giao hàng', 'đã gửi'].includes(s)) return 'shipped';
    if (['completed', 'hoàn thành', 'thành công'].includes(s)) return 'completed';
    if (['cancelled', 'canceled', 'đã hủy', 'hủy'].includes(s)) return 'cancelled';
    
    if (['pending', 'processing', 'shipped', 'completed', 'cancelled'].includes(s)) return s;
    return 'pending';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      processing: '#8b5cf6',
      shipped: '#3b82f6',
      completed: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipped: 'Đã giao',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };
    return texts[status] || status;
  };

  const formatOrderId = (id) => `ORD${String(id).padStart(3, '0')}`;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      
      const [ordersData, usersData] = await Promise.all([
        OrderService.getAllOrders(),
        adminFetchUsers()
      ]);

      setOrders(Array.isArray(ordersData) ? ordersData : []);

      
      const mapping = {};
      (usersData || []).forEach(user => {
        const uid = user.id ?? user.userId;
        if (uid) {
          mapping[uid] = {
            fullName: user.full_name ?? user.fullName ?? '',
            emailAddress: user.email_address ?? user.emailAddress ?? '',
          };
        }
      });
      setUserMap(mapping);

    } catch (e) {
      setError(e?.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  
  const statusOptions = useMemo(() => {
    const set = new Set();
    orders.forEach(o => set.add(normalizeStatus(o.orderStatus)));
    const list = Array.from(set).filter(Boolean);
    const mapped = list.map(v => ({ value: v, label: getStatusText(v) }));
    const all = { value: 'all', label: 'Tất cả' };
    
    const ensure = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
    ensure.forEach(v => {
      if (!list.includes(v)) mapped.push({ value: v, label: getStatusText(v) });
    });
    return [all, ...mapped];
  }, [orders]);

  const dateFilterOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'yesterday', label: 'Hôm qua' },
    { value: 'last7days', label: '7 ngày qua' },
    { value: 'last30days', label: '30 ngày qua' },
    { value: 'thisMonth', label: 'Tháng này' },
    { value: 'lastMonth', label: 'Tháng trước' },
    { value: 'custom', label: 'Tùy chỉnh' }
  ];

  
  const isDateInRange = (orderDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orderDateTime = new Date(orderDate);
    orderDateTime.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case 'all':
        return true;

      case 'today':
        return orderDateTime.getTime() === today.getTime();

      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return orderDateTime.getTime() === yesterday.getTime();

      case 'last7days':
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        return orderDateTime >= last7Days && orderDateTime <= today;

      case 'last30days':
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        return orderDateTime >= last30Days && orderDateTime <= today;

      case 'thisMonth':
        return orderDateTime.getMonth() === today.getMonth() &&
          orderDateTime.getFullYear() === today.getFullYear();

      case 'lastMonth':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        return orderDateTime >= lastMonth && orderDateTime <= lastMonthEnd;

      case 'custom':
        if (!customDateRange.startDate || !customDateRange.endDate) {
          return true;
        }
        const startDate = new Date(customDateRange.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(customDateRange.endDate);
        endDate.setHours(23, 59, 59, 999);
        return orderDateTime >= startDate && orderDateTime <= endDate;

      default:
        return true;
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const internalStatus = normalizeStatus(order.orderStatus);
      const matchesStatus = selectedStatus === 'all' || internalStatus === selectedStatus;
      const idStr = String(order.id || '').toLowerCase();
      const ordStr = formatOrderId(order.id || '').toLowerCase();
      const userStr = String(order.userId || '').toLowerCase();
      const providerStr = String(order.paymentProvider || '').toLowerCase();
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = !term ||
        idStr.includes(term) ||
        ordStr.includes(term) ||
        userStr.includes(term) ||
        providerStr.includes(term);
      const matchesDate = isDateInRange(order.orderDate);
      return matchesStatus && matchesSearch && matchesDate;
    });
  }, [orders, selectedStatus, searchTerm, dateFilter, customDateRange]);

  const handleStatusChange = (orderId, newStatus) => {
    
    const apiStatus = normalizeStatus(newStatus);
    
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, orderStatus: apiStatus } : o))
    );
    OrderService.updateOrderStatus(orderId, apiStatus).catch(() => {
      
      fetchOrders();
    });
  };

  const handleDateFilterChange = (value) => {
    setDateFilter(value);
    
    if (value !== 'custom') {
      setCustomDateRange({ startDate: '', endDate: '' });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const resetFilters = () => {
    setSelectedStatus('all');
    setSearchTerm('');
    setDateFilter('all');
    setCustomDateRange({ startDate: '', endDate: '' });
    setPage(1);
  };

  
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.orderTotal || 0), 0);

  
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage, pageSize]);

  const exportCSV = () => {
    const rows = filteredOrders.map(o => ({
      id: o.id,
      userId: o.userId,
      paymentTypeName: o.paymentTypeName,
      paymentProvider: o.paymentProvider,
      orderStatus: normalizeStatus(o.orderStatus),
      orderDate: o.orderDate,
      orderTotal: o.orderTotal,
      itemsCount: Array.isArray(o.items) ? o.items.length : 0
    }));
    const header = Object.keys(rows[0] || {
      id: '', userId: '', paymentTypeName: '', paymentProvider: '', orderStatus: '', orderDate: '', orderTotal: '', itemsCount: ''
    });
    const csv = [
      header.join(','),
      ...rows.map(r => header.map(k => `"${String(r[k] ?? '').replaceAll('"', '""') }"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.orders}>
      {}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý đơn hàng</h1>
        <p className={styles.pageSubtitle}>Theo dõi và xử lý tất cả đơn hàng</p>
      </div>

      {}
      {loading && (
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Đang tải dữ liệu...</span>
          </div>
        </div>
      )}
      {error && (
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statLabel} style={{ color: '#ef4444' }}>{error}</span>
          </div>
        </div>
      )}

      {}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Tổng đơn hàng:</span>
          <span className={styles.statValue}>{filteredOrders.length}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Tổng doanh thu:</span>
          <span className={styles.statValue}>{formatCurrency(totalRevenue)}</span>
        </div>
      </div>

      {}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, tên khách hàng, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.statusFilter}>
            <label className={styles.filterLabel}>Trạng thái:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={styles.statusSelect}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.dateFilter}>
            <label className={styles.filterLabel}>Thời gian:</label>
            <select
              value={dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value)}
              className={styles.dateSelect}
            >
              {dateFilterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {dateFilter === 'custom' && (
            <div className={styles.customDateRange}>
              <input
                type="date"
                value={customDateRange.startDate}
                onChange={(e) => setCustomDateRange({
                  ...customDateRange,
                  startDate: e.target.value
                })}
                className={styles.dateInput}
                placeholder="Từ ngày"
              />
              <span className={styles.dateSeparator}>đến</span>
              <input
                type="date"
                value={customDateRange.endDate}
                onChange={(e) => setCustomDateRange({
                  ...customDateRange,
                  endDate: e.target.value
                })}
                className={styles.dateInput}
                placeholder="Đến ngày"
              />
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.resetBtn}
            onClick={resetFilters}
            title="Reset tất cả bộ lọc"
          >
            🔄 Reset
          </button>
          <button className={styles.exportBtn} onClick={exportCSV}>
            📊 Xuất báo cáo
          </button>
          <button className={styles.refreshBtn} onClick={fetchOrders} disabled={loading}>
            🔄 Làm mới
          </button>
        </div>
      </div>

      {}
      <div className={styles.ordersTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableCell}>Mã đơn</div>
          <div className={styles.tableCell}>Khách hàng</div>
          <div className={styles.tableCell}>Sản phẩm</div>
          <div className={styles.tableCell}>Tổng tiền</div>
          <div className={styles.tableCell}>Trạng thái</div>
          <div className={styles.tableCell}>Ngày đặt</div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <p>📭 Không tìm thấy đơn hàng nào</p>
            <button onClick={resetFilters} className={styles.resetFiltersBtn}>
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          paginatedOrders.map((order, index) => (
            <div key={index} className={styles.tableRow}>
              <div className={styles.tableCell}>
                <span className={styles.orderId}>{formatOrderId(order.id)}</span>
              </div>
              <div className={styles.tableCell}>
                <div className={styles.customerInfo}>
                  <div className={styles.customerName}>
                    {userMap[order.userId]?.fullName || `Khách hàng #${order.userId}`}
                  </div>
                  <div className={styles.customerContact}>{order.paymentProvider || order.paymentTypeName || '—'}</div>
                </div>
              </div>
              <div className={styles.tableCell}>
                <div className={styles.productsList}>
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((it, idx) => (
                      <div key={idx} className={styles.productItem}>
                        <span className={styles.productName}>
                          {it.productName || `Item #${it.productItemId ?? it.id}`}
                        </span>
                        <span className={styles.productQuantity}>x{it.qty}</span>
                      </div>
                    ))
                  ) : (
                    <div className={styles.productItem}>—</div>
                  )}
                </div>
              </div>
              <div className={styles.tableCell}>
                <span className={styles.totalAmount}>
                  {formatCurrency(order.orderTotal || 0)}
                </span>
              </div>
              <div className={styles.tableCell}>
                <select
                  value={normalizeStatus(order.orderStatus)}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className={styles.statusSelect}
                  style={{
                    backgroundColor: getStatusColor(normalizeStatus(order.orderStatus)),
                    color: 'white',
                    border: 'none'
                  }}
                >
                  {statusOptions.slice(1).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.tableCell}>
                <span className={styles.orderDate}>
                  {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : '—'}
                </span>
              </div>

            </div>
          ))
        )}
      </div>

      {}
      <div className={styles.pagination}>
        <div className={styles.paginationNumbers}>
          <select
            className={styles.paginationBtn}
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            title="Số dòng / trang"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <button
          className={styles.paginationBtn}
          disabled={currentPage === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          ← Trước
        </button>
        <div className={styles.paginationNumbers}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`${styles.paginationBtn} ${currentPage === i + 1 ? styles.active : ''}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          className={styles.paginationBtn}
          disabled={currentPage === totalPages}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        >
          Sau →
        </button>
      </div>
    </div>
  );
};

export default Orders;