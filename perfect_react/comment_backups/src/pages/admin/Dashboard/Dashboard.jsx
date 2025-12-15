import React, { useState, useMemo } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DollarSign, Package, ShoppingCart, Users, AlertCircle, Calendar, TrendingUp } from "lucide-react";
import OrderService from "../../../services/orderService.js";
import { productService } from "../../../services/productService.js";
import adminUserService from "../../../services/userService.js";

// === CSS THUẦN (toàn bộ giao diện) ===
const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f6f9; color: #333; }

  .dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
  }

  .dashboard-header {
    margin-bottom: 24px;
  }

  .dashboard-header h1 {
    font-size: 28px;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 4px;
  }

  .dashboard-header p {
    color: #666;
    font-size: 14px;
  }

  .filter-section {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 24px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }

  .filter-label {
    font-weight: 600;
    color: #444;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .filter-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .filter-btn {
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    color: #333;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
  }

  .filter-btn:hover {
    background: #f0f0f0;
  }

  .filter-btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .stats-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    margin-bottom: 32px;
  }

  .stat-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .stat-header {
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
  }

  .stat-header h3 {
    font-size: 14px;
    font-weight: 600;
    color: #444;
  }

  .stat-content {
    padding: 20px;
  }

  .stat-value {
    font-size: 28px;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 8px;
  }

  .stat-unit {
    font-size: 14px;
    color: #666;
    margin-left: 4px;
  }

  .content-grid {
    display: grid;
    gap: 24px;
    grid-template-columns: 1fr;
  }

  @media (min-width: 1024px) {
    .content-grid {
      grid-template-columns: 2fr 1fr;
    }
  }

  .section-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .card-header {
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .card-content {
    padding: 20px;
  }

  .order-item, .product-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f5f5f5;
  }

  .order-item:last-child, .product-item:last-child {
    border-bottom: none;
  }

  .order-info, .product-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
  }

  .order-name {
    font-weight: 600;
    font-size: 14px;
  }

  .order-date {
    font-size: 12px;
    color: #666;
  }

  .badge {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .badge-pending { background: #fef9c3; color: #ca8a04; }
  .badge-shipped { background: #dbeafe; color: #1d4ed8; }
  .badge-delivered { background: #d1fae5; color: #065f46; }
  .badge-cancelled { background: #fee2e2; color: #991b1b; }

  .rank {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    color: white;
  }

  .rank.gold { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
  .rank.silver { background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%); }
  .rank.bronze { background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); }

  .empty-state {
    text-align: center;
    padding: 40px 0;
    color: #666;
  }

  .empty-state svg {
    width: 48px;
    height: 48px;
    color: #9ca3af;
    margin-bottom: 16px;
  }

  .empty-state p {
    font-size: 14px;
    font-weight: 500;
  }

  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 8px;
  }

  @keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .error-alert {
    background: #fee2e2;
    color: #991b1b;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  .product-link {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
  }

  .product-link:hover {
    text-decoration: underline;
  }

  .sold-count {
    background: #fef3c7;
    color: #d97706;
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
  }

  .price {
    font-weight: 600;
    color: #16a34a;
  }
`;

// === Helper Functions ===
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const formatCurrency = (amount) => {
  if (amount == null) return "0";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

const getDateRange = (filter) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (filter) {
    case 'today': return { start: today, end: new Date() };
    case 'week':
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - 7);
      return { start: weekStart, end: new Date() };
    case 'month':
      const monthStart = new Date(today);
      monthStart.setMonth(today.getMonth() - 1);
      return { start: monthStart, end: new Date() };
    default:
      return { start: new Date(2000, 0, 1), end: new Date() };
  }
};

const filterByDateRange = (items, dateField, { start, end }) => {
  return items.filter(item => {
    const itemDate = new Date(item[dateField]);
    return itemDate >= start && itemDate <= end;
  });
};

const getStatusConfig = (status) => {
  const map = {
    'pending': { label: "Chờ xử lý", class: "badge-pending" },
    'đang xử lý': { label: "Chờ xử lý", class: "badge-pending" },
    'shipped': { label: "Đang giao", class: "badge-shipped" },
    'đang giao': { label: "Đang giao", class: "badge-shipped" },
    'completed': { label: "Đã giao", class: "badge-delivered" },
    'đã giao': { label: "Đã giao", class: "badge-delivered" },
    'hoàn thành': { label: "Đã giao", class: "badge-delivered" },
    'cancelled': { label: "Đã hủy", class: "badge-cancelled" },
    'đã hủy': { label: "Đã hủy", class: "badge-cancelled" },
  };
  return map[(status || '').toLowerCase()] || { label: status || "N/A", class: "badge" };
};

// === Components ===
const StatCard = ({ title, value, unit, icon: Icon, iconColor }) => (
  <div className="stat-card">
    <div className="stat-header">
      <h3>{title}</h3>
      {Icon && <Icon style={{ width: 20, height: 20, color: iconColor || "#888" }} />}
    </div>
    <div className="stat-content">
      <div className="stat-value">
        {value} <span className="stat-unit">{unit}</span>
      </div>
    </div>
  </div>
);

const RecentOrders = ({ orders = [] }) => {
  if (!orders.length) {
    return (
      <div className="section-card">
        <div className="card-header">
          <ShoppingCart style={{ width: 18, height: 18 }} /> Đơn hàng gần đây
        </div>
        <div className="card-content">
          <div className="empty-state">
            <ShoppingCart style={{ width: 48, height: 48, color: '#9ca3af' }} />
            <p>Không có đơn hàng nào</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-card">
      <div className="card-header">
        <ShoppingCart style={{ width: 18, height: 18 }} /> Đơn hàng gần đây
      </div>
      <div className="card-content">
        {orders.map(order => {
          const status = getStatusConfig(order.orderStatus);
          const totalItems = order.items?.reduce((s, i) => s + (i.qty || 0), 0) || 0;

          return (
            <div key={order.id} className="order-item">
              <div className="order-info">
                <div className="avatar">
                  <ShoppingCart style={{ width: 20, height: 20 }} />
                </div>
                <div>
                  <div className="order-name">Đơn hàng #{order.id}</div>
                  <div className="order-date">
                    {formatDate(order.orderDate)} • {totalItems} sản phẩm
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  {formatCurrency(order.orderTotal)}₫
                </div>
                <span className={`badge ${status.class}`}>{status.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TopProducts = ({ products = [] }) => {
  if (!products.length) {
    return (
      <div className="section-card">
        <div className="card-header">
          <TrendingUp style={{ width: 18, height: 18, color: '#f97316' }} /> Sản phẩm bán chạy
        </div>
        <div className="card-content">
          <div className="empty-state">
            <Package style={{ width: 48, height: 48, color: '#9ca3af' }} />
            <p>Chưa có dữ liệu</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-card">
      <div className="card-header">
        <TrendingUp style={{ width: 18, height: 18, color: '#f97316' }} /> Sản phẩm bán chạy
      </div>
      <div className="card-content">
        {products.map((p, i) => {
          let rankClass = "rank";
          if (i === 0) rankClass += " gold";
          else if (i === 1) rankClass += " silver";
          else if (i === 2) rankClass += " bronze";

          return (
            <div key={p.id} className="product-item">
              <div className="product-info">
                <div className={rankClass}>{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    <span className="sold-count">{p.sold}</span> đã bán
                  </div>
                </div>
              </div>
              <div className="price">{formatCurrency(p.revenue)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="dashboard-container">
    <div style={{ marginBottom: 24 }}>
      <div className="skeleton" style={{ height: 32, width: 200, marginBottom: 8 }}></div>
      <div className="skeleton" style={{ height: 20, width: 300 }}></div>
    </div>
    <div className="skeleton" style={{ height: 80, marginBottom: 24 }}></div>
    <div className="stats-grid">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 140 }}></div>
      ))}
    </div>
    <div className="content-grid">
      <div className="skeleton" style={{ height: 400 }}></div>
      <div className="skeleton" style={{ height: 400 }}></div>
    </div>
  </div>
);

// === Query Client ===
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

// === Main Dashboard ===
const DashboardWithProvider = () => {
  const [dateFilter, setDateFilter] = useState('all');

  const { data: rawData, isLoading, error } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        OrderService.getAllOrders(),
        productService.getAllProducts(0, 1000),
        adminUserService.adminFetchUsers(),
      ]);

      return {
        orders: Array.isArray(ordersRes) ? ordersRes : [],
        products: productsRes.content || [],
        totalProducts: productsRes.totalElements || 0,
        users: Array.isArray(usersRes) ? usersRes : [],
      };
    },
  });

  const processedData = useMemo(() => {
    if (!rawData) return null;

    const { orders, products, users, totalProducts } = rawData;
    const dateRange = getDateRange(dateFilter);
    const filteredOrders = filterByDateRange(orders, 'orderDate', dateRange);

    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.orderTotal || 0), 0);

    const recentOrders = filteredOrders
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      .slice(0, 5);

    const productSales = {};
    filteredOrders.forEach(order => {
      order.items?.forEach(item => {
        if (item.productItemId) {
          const pid = item.productItemId;
          productSales[pid] = productSales[pid] || { sold: 0, revenue: 0 };
          productSales[pid].sold += item.qty;
          productSales[pid].revenue += item.qty * item.price;
        }
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([id, data]) => {
        const product = products.find(p => p.id === parseInt(id));
        return {
          id: parseInt(id),
          name: product?.name || `Sản phẩm #${id}`,
          sold: data.sold,
          revenue: data.revenue,
        };
      })
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders: filteredOrders.length,
      totalUsers: users.length,
      totalProducts,
      recentOrders,
      topProducts,
    };
  }, [rawData, dateFilter]);

  const stats = useMemo(() => {
    if (!processedData) return [];
    return [
      { title: "Tổng doanh thu", value: formatCurrency(processedData.totalRevenue), unit: "", icon: DollarSign, iconColor: "#16a34a" },
      { title: "Đơn hàng", value: processedData.totalOrders, unit: "đơn", icon: ShoppingCart, iconColor: "#3b82f6" },
      { title: "Khách hàng", value: processedData.totalUsers, unit: "người", icon: Users, iconColor: "#8b5cf6" },
      { title: "Sản phẩm", value: processedData.totalProducts, unit: "loại", icon: Package, iconColor: "#f97316" },
    ];
  }, [processedData]);

  if (isLoading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-alert">
          <AlertCircle style={{ width: 20, height: 20 }} />
          <div>
            <strong>Lỗi tải dữ liệu</strong>
            <p style={{ fontSize: 14, marginTop: 4 }}>{error.message || "Không thể kết nối đến server"}</p>
          </div>
        </div>
      </div>
    );
  }

  const filterLabels = { all: 'Tất cả', today: 'Hôm nay', week: '7 ngày qua', month: '30 ngày qua' };

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Tổng quan hoạt động kinh doanh của bạn</p>
        </div>

        <div className="filter-section">
          <div className="filter-label">
            <Calendar style={{ width: 18, height: 18 }} />
            <span>Thống kê theo:</span>
          </div>
          <div className="filter-buttons">
            {Object.keys(filterLabels).map(filter => (
              <button
                key={filter}
                className={`filter-btn ${dateFilter === filter ? 'active' : ''}`}
                onClick={() => setDateFilter(filter)}
              >
                {filterLabels[filter]}
              </button>
            ))}
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
        </div>

        <div className="content-grid">
          <RecentOrders orders={processedData?.recentOrders || []} />
          <TopProducts products={processedData?.topProducts || []} />
        </div>
      </div>
    </>
  );
};

const Dashboard = () => (
  <QueryClientProvider client={queryClient}>
    <DashboardWithProvider />
  </QueryClientProvider>
);

export default Dashboard;