import React from 'react';
import { useCart } from '../../hooks/useCart';
import { 
  populateMockCartData, 
  clearMockCartData, 
  createMockCartWithProducts,
  MOCK_CART_ITEMS 
} from '../../services/cartMockData';

const CartMockHelper = ({ isVisible = false }) => {
  const { clearAllItems, items, itemCount } = useCart();

  const handleAddMockData = () => {
    const added = populateMockCartData();
    if (added) {
      window.location.reload(); 
    }
  };

  const handleClearCart = () => {
    clearAllItems();
  };

  const handleClearMockData = () => {
    clearMockCartData();
    window.location.reload();
  };

  const handleResetToMockData = () => {
    
    localStorage.removeItem('tshirt_store_cart');
    window.location.reload();
  };

  const handleAddRandomProducts = () => {
    const randomItems = createMockCartWithProducts(['demo-tee-001', 'demo-hoodie-001']);
    localStorage.setItem('tshirt_store_cart', JSON.stringify(randomItems));
    window.location.reload();
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f0f0f0',
      padding: '15px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      zIndex: 9999,
      minWidth: '250px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>
        🛒 Cart Mock Helper
      </h4>
      
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        Items in cart: <strong>{itemCount}</strong>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={handleResetToMockData}
          style={{
            padding: '8px 12px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🔄 Reset to Mock Data
        </button>

        <button
          onClick={handleAddRandomProducts}
          style={{
            padding: '8px 12px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🎲 Add Random Products
        </button>

        <button
          onClick={handleClearCart}
          style={{
            padding: '8px 12px',
            background: '#ffc107',
            color: '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🗑️ Clear Cart
        </button>

        <button
          onClick={handleClearMockData}
          style={{
            padding: '8px 12px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🧹 Clear Mock Data
        </button>
      </div>

      <div style={{ 
        marginTop: '10px', 
        fontSize: '10px', 
        color: '#999',
        borderTop: '1px solid #ddd',
        paddingTop: '8px'
      }}>
        <div>Mock items: {MOCK_CART_ITEMS.length}</div>
        <div>Current items: {items.length}</div>
      </div>
    </div>
  );
};

export default CartMockHelper;
