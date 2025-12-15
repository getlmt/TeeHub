import React, { useRef, useEffect, useState } from 'react';
import { Camera, Settings, ZoomIn, Upload, ShoppingBag, ShoppingCart } from 'lucide-react';
import './VirtualTryOn.css';
import { productService } from '../../../services/productService';
import CartService from "../../../services/cart_service.js";


const FRONTEND_BASE_URL = 'http://localhost:5173';

const VirtualTryOn = () => {
  const videoRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [scale, setScale] = useState(0.6);
  const [error, setError] = useState('');

  
  const [clothPath, setClothPath] = useState('./ao3.png');
  const [customPath, setCustomPath] = useState('');

  
  const [shopProducts, setShopProducts] = useState([]);

  
  const [cartItems, setCartItems] = useState([]);
  const [activeTab, setActiveTab] = useState('shop'); 

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const shopResponse = await productService.getAllProducts(1, 6);
        const products = shopResponse.content || shopResponse || [];
        setShopProducts(products);

        
        const cartData = await CartService.getCart();
        console.log("📦 Cart data received:", cartData);

        if (cartData && cartData.items) {
          
          const normalizedItems = cartData.items.map(item => {
            
            console.log("🔍 Processing cart item:", item);

            return {
              id: item.id || item.originalId || item.itemId,
              productName: item.productName || item.name || 'Sản phẩm không tên',
              productImage: item.productImage || item.image,
              productCode: item.productCode || item.sku || item.productItemId,
              qty: item.qty || 1,
              
              raw: item
            };
          });

          console.log("✅ Normalized cart items:", normalizedItems);
          setCartItems(normalizedItems);
        }
      } catch (err) {
        console.error("❌ Lỗi lấy dữ liệu:", err);
      }
    };

    fetchData();

    
    initializeBackend(clothPath);
  }, []);

  
  const initializeBackend = async (path) => {
    try {
      const response = await fetch('http://localhost:5000/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cloth_path: path })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setIsInitialized(true);
        setError('');
        setClothPath(path);
        return true;
      } else {
        setError(data.message);
        return false;
      }
    } catch (err) {
      setError('Không thể kết nối đến server Python (Flask). Hãy chạy app.py!');
      return false;
    }
  };

  
  const handleSelectShopProduct = (product) => {
    const imageName = product.productMainImage;

    if (!imageName) {
      alert("Sản phẩm này không có ảnh!");
      return;
    }

    let fullUrlForBackend = imageName;
    if (!imageName.startsWith('http')) {
      fullUrlForBackend = `${FRONTEND_BASE_URL}/Product/${imageName}`;
    }

    setCustomPath(fullUrlForBackend);
    changeCloth(fullUrlForBackend);
  };

  
  const handleSelectCartProduct = (cartItem) => {
    console.log("🎯 Selected cart item:", cartItem);

    
    const imageName = cartItem.productImage;

    if (!imageName) {
      alert("Sản phẩm này không có ảnh!");
      return;
    }

    let fullUrlForBackend = imageName;
    if (!imageName.startsWith('http')) {
      fullUrlForBackend = `${FRONTEND_BASE_URL}/Product/${imageName}`;
    }

    console.log("📸 Image URL for backend:", fullUrlForBackend);
    setCustomPath(fullUrlForBackend);
    changeCloth(fullUrlForBackend);
  };

  
  const changeCloth = async (pathOverride = null) => {
    const path = pathOverride || customPath;

    if (!path) {
      setError('Vui lòng chọn áo hoặc nhập đường dẫn!');
      return;
    }

    if (isStreaming) {
      await stopStreaming();
    }

    const success = await initializeBackend(path);
    if (success) {
      setError('');
    }
  };

  
  const startStreaming = async () => {
    if (!isInitialized) {
      setError('Vui lòng khởi tạo áo trước!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/start_stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();

      if (data.status === 'success') {
        setIsStreaming(true);
        setError('');

        if (videoRef.current) {
          videoRef.current.src = `http://localhost:5000/video_feed?t=${Date.now()}`;
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Lỗi start stream: ' + err.message);
    }
  };

  
  const stopStreaming = async () => {
    try {
      await fetch('http://localhost:5000/stop_stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      setIsStreaming(false);
      if (videoRef.current) {
        videoRef.current.src = '';
      }
    } catch (err) {
      setError('Lỗi stop stream: ' + err.message);
    }
  };

  const toggleStreaming = () => {
    if (isStreaming) {
      stopStreaming();
    } else {
      startStreaming();
    }
  };

  const updateSettings = async (newScale) => {
    try {
      await fetch('http://localhost:5000/update_settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scale: newScale })
      });
    } catch (err) {
      console.error('Error updating settings:', err);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      updateSettings(scale);
    }
  }, [scale]);

  
  const renderProductList = () => {
    const products = activeTab === 'shop' ? shopProducts : cartItems;

    if (products.length === 0) {
      return (
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', fontStyle: 'italic' }}>
          {activeTab === 'shop'
            ? 'Đang tải danh sách sản phẩm...'
            : 'Giỏ hàng trống'}
        </p>
      );
    }

    return (
      <div className="quick-select-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {products.map((item) => {
          let displayUrl, productName, imageName, itemKey;

          if (activeTab === 'cart') {
            
            itemKey = item.id;
            imageName = item.productImage;
            productName = item.productName;

            
            displayUrl = '/placeholder.png';
            if (imageName) {
              if (imageName.startsWith('http')) {
                displayUrl = imageName;
              } else {
                displayUrl = `/Product/${imageName}`;
              }
            }
          } else {
            
            itemKey = item.productId;
            imageName = item.productMainImage;
            productName = item.productName;

            displayUrl = '/placeholder.png';
            if (imageName) {
              if (imageName.startsWith('http')) {
                displayUrl = imageName;
              } else {
                displayUrl = `/Product/${imageName}`;
              }
            }
          }

          const isSelected = clothPath.includes(imageName || '');

          return (
            <div
              key={itemKey}
              className="product-item"
              onClick={() => activeTab === 'cart'
                ? handleSelectCartProduct(item)
                : handleSelectShopProduct(item)
              }
              style={{
                cursor: 'pointer',
                textAlign: 'center',
                opacity: isStreaming ? 0.5 : 1
              }}
              title={productName}
            >
              <div style={{
                width: '100%',
                height: '90px',
                overflow: 'hidden',
                borderRadius: '8px',
                border: isSelected ? '3px solid #3b82f6' : '1px solid #374151',
                background: '#1f2937',
                transition: 'all 0.2s'
              }}>
                <img
                  src={displayUrl}
                  alt={productName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target;
                    const currentSrc = target.src;

                    
                    if (currentSrc.includes('/Product/') && imageName) {
                      target.src = `/CustomProduct/${imageName}`;
                    } else {
                      
                      target.onerror = null;
                      target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }
                  }}
                />
              </div>
              <p style={{
                fontSize: '0.75rem',
                marginTop: '6px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: isSelected ? '#60a5fa' : '#e5e7eb',
                fontWeight: isSelected ? 'bold' : 'normal'
              }}>
                {productName}
              </p>
              {activeTab === 'cart' && (
                <p style={{
                  fontSize: '0.7rem',
                  color: '#9ca3af',
                  marginTop: '2px'
                }}>
                  x{item.qty}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="virtual-tryon-container">
      <div className="virtual-tryon-wrapper">
        {}
        <div className="header">
          <h1 className="header-title">
            <Camera className="w-12 h-12" />
            Virtual Try-On AI
          </h1>
          <p className="header-subtitle">Thử đồ trực tuyến với AI</p>
        </div>

        {}
        {error && (
          <div className="error-message">
            <p className="error-title">⚠️ Thông báo:</p>
            <p>{error}</p>
          </div>
        )}

        {}
        <div className="main-grid">
          {}
          <div>
            <div className="video-panel">
              <div className="video-container">
                <img
                  ref={videoRef}
                  alt="Video Stream"
                  className="video-stream"
                  style={{ minHeight: '480px', background: '#000' }}
                />

                <div className={`status-badge ${isInitialized ? 'status-ready' : 'status-connecting'}`}>
                  {isInitialized ? '✓ Áo đã sẵn sàng' : '⏳ Đang tải áo...'}
                </div>

                {isStreaming && (
                  <div className="streaming-badge">
                    <div className="pulse-dot"></div>
                    LIVE
                  </div>
                )}
              </div>

              <div className="control-button-container">
                <button
                  onClick={toggleStreaming}
                  disabled={!isInitialized}
                  className={`control-button ${isStreaming ? 'streaming' : 'ready'}`}
                >
                  {isStreaming ? '⏸ Dừng Thử Đồ' : '▶ Bắt Đầu Thử Đồ'}
                </button>
              </div>
            </div>
          </div>

          {}
          <div className="settings-container">

            {}
            <div className="panel">
              <div className="panel-header">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
                  {}
                  <button
                    onClick={() => setActiveTab('shop')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: activeTab === 'shop' ? '#3b82f6' : '#374151',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: activeTab === 'shop' ? 'bold' : 'normal',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Shop ({shopProducts.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('cart')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: activeTab === 'cart' ? '#3b82f6' : '#374151',
                      color: '#fff',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: activeTab === 'cart' ? 'bold' : 'normal',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Giỏ hàng ({cartItems.length})
                  </button>
                </div>
              </div>

              <div>
                <div className="input-group">
                  <label className="input-label">
                    {activeTab === 'shop'
                      ? 'Chọn sản phẩm từ Shop:'
                      : 'Chọn sản phẩm từ Giỏ hàng:'}
                  </label>

                  {renderProductList()}
                </div>

                {}
                <div className="input-group" style={{ marginTop: '1.5rem', borderTop: '1px solid #374151', paddingTop: '1rem' }}>
                  <label className="input-label">Hoặc nhập link ảnh khác:</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={customPath}
                      onChange={(e) => setCustomPath(e.target.value)}
                      placeholder="https://example.com/ao.png"
                      className="text-input"
                    />
                    <button
                      onClick={() => changeCloth(customPath)}
                      disabled={!customPath || isStreaming}
                      className={`change-button ${customPath && !isStreaming ? 'enabled' : 'disabled'}`}
                      style={{ width: 'auto', padding: '0 12px' }}
                    >
                      🔄
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {}
            <div className="panel">
              <div className="panel-header">
                <Settings className="w-6 h-6 text-blue-300" />
                <h3 className="panel-title">Điều chỉnh kích thước</h3>
              </div>

              <div className="slider-container">
                <div className="slider-header">
                  <label className="slider-label">
                    <ZoomIn className="w-5 h-5" />
                    Size áo:
                  </label>
                  <span className="slider-value">{Math.round(scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.2"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>Nhỏ</span>
                  <span>Vừa</span>
                  <span>Lớn</span>
                </div>
              </div>
            </div>

            {}
            <div className="panel">
              <h3 className="panel-title">📝 Hướng dẫn</h3>
              <ul className="instruction-list">
                <li>• Chọn áo từ Shop hoặc Giỏ hàng.</li>
                <li>• Bấm "Bắt Đầu Thử Đồ".</li>
                <li>• Đứng cách xa camera khoảng 1.5m - 2m.</li>
                <li>• Điều chỉnh thanh trượt để áo vừa vặn hơn.</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;