// src/services/dashboardService.js
import api from './httpClient.js';
import OrderService from './orderService.js';
import { productService } from './productService.js';
import adminUserService from './userService.js';

/**
 * DashboardService – Tổng hợp dữ liệu cho Dashboard
 * Gọi nhiều service nhỏ để lấy dữ liệu cần thiết
 */
const DashboardService = {
    /**
     * Lấy toàn bộ dữ liệu tóm tắt cho Dashboard
     * @returns {Promise<{
     *   totalRevenue: number,
     *   totalOrders: number,
     *   totalUsers: number,
     *   totalProducts: number,
     *   recentOrders: Array,
     *   topProducts: Array
     * }>}
     */
    getDashboardSummary: async () => {
        try {
            // Gọi song song các API để tối ưu hiệu suất
            const [
                ordersResponse,
                allOrdersResponse,
                productsResponse,
                usersResponse,
            ] = await Promise.all([
                OrderService.getAllOrders(), // Lấy tất cả đơn hàng (admin)
                OrderService.getAllOrders(), // Dùng lại hoặc tách nếu cần
                productService.getAllProducts(0, 1000), // Lấy đủ sản phẩm để tính top
                adminUserService.adminFetchUsers(),
            ]);

            // Tính tổng doanh thu
            const totalRevenue = allOrdersResponse.reduce(
                (sum, order) => sum + (order.totalAmount || 0),
                0
            );

            // Lấy 5 đơn hàng gần nhất
            const recentOrders = allOrdersResponse
                .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                .slice(0, 5)
                .map(order => ({
                    id: order.id,
                    customerName: order.fullName || 'Khách lẻ',
                    totalAmount: order.totalAmount,
                    status: order.status,
                    orderDate: order.orderDate,
                }));

            // Top 5 sản phẩm bán chạy (giả sử backend trả về quantitySold hoặc orderCount)
            const topProducts = productsResponse.content
                .map(product => ({
                    id: product.id,
                    name: product.name,
                    sold: product.quantitySold || 0, // hoặc product.orderCount
                    revenue: product.price * (product.quantitySold || 0),
                    image: product.images?.[0]?.imageUrl || null,
                }))
                .sort((a, b) => b.sold - a.sold)
                .slice(0, 5);

            return {
                totalRevenue,
                totalOrders: allOrdersResponse.length,
                totalUsers: usersResponse.length,
                totalProducts: productsResponse.totalElements,
                recentOrders,
                topProducts,
            };
        } catch (error) {
            console.error('Error in getDashboardSummary:', error);
            throw error; // Để React Query xử lý lỗi
        }
    },
};

export default DashboardService;