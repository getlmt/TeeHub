
import api from './httpClient.js';
import OrderService from './orderService.js';
import { productService } from './productService.js';
import adminUserService from './userService.js';


const DashboardService = {
    
    getDashboardSummary: async () => {
        try {
            
            const [
                ordersResponse,
                allOrdersResponse,
                productsResponse,
                usersResponse,
            ] = await Promise.all([
                OrderService.getAllOrders(), 
                OrderService.getAllOrders(), 
                productService.getAllProducts(0, 1000), 
                adminUserService.adminFetchUsers(),
            ]);

            
            const totalRevenue = allOrdersResponse.reduce(
                (sum, order) => sum + (order.totalAmount || 0),
                0
            );

            
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

            
            const topProducts = productsResponse.content
                .map(product => ({
                    id: product.id,
                    name: product.name,
                    sold: product.quantitySold || 0, 
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
            throw error; 
        }
    },
};

export default DashboardService;