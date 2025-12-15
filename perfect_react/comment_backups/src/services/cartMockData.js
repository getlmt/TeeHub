import { MOCK_PRODUCTS } from './mockProducts';

// Mock cart data với các sản phẩm đa dạng
export const MOCK_CART_ITEMS = [
  {
    id: 'cart-item-001',
    productId: 'demo-tee-001',
    name: 'Áo thun Perfect React',
    price: 199000,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
    quantity: 2,
    size: 'M',
    color: 'white',
    design: null,
    customizations: {},
    addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 ngày trước
  },
  {
    id: 'cart-item-002',
    productId: 'demo-tee-002',
    name: 'Áo thun Vintage Classic',
    price: 249000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
    quantity: 1,
    size: 'L',
    color: 'black',
    design: {
      type: 'text',
      content: 'VINTAGE',
      position: { x: 50, y: 50 },
      color: '#FFFFFF',
      fontSize: 24,
    },
    customizations: {
      textColor: '#FFFFFF',
      backgroundColor: 'transparent',
    },
    addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 ngày trước
  },
  {
    id: 'cart-item-003',
    productId: 'demo-hoodie-001',
    name: 'Hoodie Premium Cotton',
    price: 399000,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop',
    quantity: 1,
    size: 'XL',
    color: 'gray',
    design: {
      type: 'image',
      content: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop',
      position: { x: 100, y: 100 },
      size: { width: 200, height: 200 },
    },
    customizations: {
      opacity: 0.8,
      blendMode: 'multiply',
    },
    addedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 giờ trước
  },
];

// Function để lấy mock cart data
export const getMockCartData = () => {
  return MOCK_CART_ITEMS;
};

// Function để thêm mock data vào localStorage
export const populateMockCartData = () => {
  if (typeof window !== 'undefined') {
    const existingCart = localStorage.getItem('tshirt_store_cart');
    
    // Chỉ thêm mock data nếu giỏ hàng đang trống
    if (!existingCart || JSON.parse(existingCart).length === 0) {
      localStorage.setItem('tshirt_store_cart', JSON.stringify(MOCK_CART_ITEMS));
      console.log('✅ Mock cart data đã được thêm vào giỏ hàng!');
      return true;
    } else {
      console.log('ℹ️ Giỏ hàng đã có sản phẩm, không thêm mock data');
      return false;
    }
  }
  return false;
};

// Function để xóa mock data
export const clearMockCartData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('tshirt_store_cart');
    console.log('🗑️ Mock cart data đã được xóa!');
    return true;
  }
  return false;
};

// Function để tạo mock cart với số lượng sản phẩm tùy chỉnh
export const createMockCartWithProducts = (productIds = ['demo-tee-001', 'demo-tee-002']) => {
  const mockItems = productIds.map((productId, index) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId);
    if (!product) return null;

    return {
      id: `cart-item-${Date.now()}-${index}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: Math.floor(Math.random() * 3) + 1, // 1-3 items
      size: product.sizes[Math.floor(Math.random() * product.sizes.length)],
      color: product.colors[Math.floor(Math.random() * product.colors.length)].name,
      design: Math.random() > 0.5 ? {
        type: 'text',
        content: 'CUSTOM',
        position: { x: 50, y: 50 },
        color: '#000000',
        fontSize: 20,
      } : null,
      customizations: {},
      addedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random trong 7 ngày qua
    };
  }).filter(Boolean);

  return mockItems;
};

// Function để lấy thông tin sản phẩm từ cart item
export const getProductFromCartItem = (cartItem) => {
  return MOCK_PRODUCTS.find(p => p.id === cartItem.productId);
};

// Function để validate cart items
export const validateCartItems = (cartItems) => {
  return cartItems.map(item => {
    const product = getProductFromCartItem(item);
    return {
      ...item,
      isValid: !!product && product.stock >= item.quantity,
      product: product,
    };
  });
};

// Mock shipping info
export const MOCK_SHIPPING_INFO = {
  fullName: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  phone: '0123456789',
  address: '123 Đường ABC',
  city: 'Hồ Chí Minh',
  district: 'Quận 1',
  ward: 'Phường Bến Nghé',
  notes: 'Giao hàng vào giờ hành chính'
};

// Mock order data
export const MOCK_ORDER_DATA = {
  id: 'ORD-' + Date.now(),
  items: MOCK_CART_ITEMS,
  shippingInfo: MOCK_SHIPPING_INFO,
  paymentMethod: 'cod',
  status: 'pending',
  createdAt: new Date().toISOString(),
  total: MOCK_CART_ITEMS.reduce((sum, item) => sum + (item.price * item.quantity), 0),
  shippingFee: 30000,
};
