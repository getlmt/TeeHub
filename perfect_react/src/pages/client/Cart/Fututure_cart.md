import React, { useEffect, useState } from "react";

// Giả lập CartService
const CartService = {
  getCart: async (userId) => {
    // Mock data theo JSON mới
    return {
      id: 7,
      userId: 9,
      items: [
        {
          id: 7,
          cartId: 7,
          productItemId: 10,
          qty: 2,
          price: 260000,
          productImage: "10a.png",
          is_customed: false,
          custom_id: null,
          selectedOptions: []
        },
        {
          id: 94,
          cartId: 7,
          productItemId: 5,
          qty: 5,
          price: 185000,
          productImage: "5a.png",
          is_customed: false,
          custom_id: null,
          selectedOptions: [
            { id: 1, variationId: 1, value: "Trắng" },
            { id: 14, variationId: 2, value: "XXL" }
          ]
        },
        {
          id: 95,
          cartId: 7,
          productItemId: 5,
          qty: 5,
          price: 185000,
          productImage: "5a.png",
          is_customed: false,
          custom_id: null,
          selectedOptions: [
            { id: 1, variationId: 1, value: "Trắng" },
            { id: 14, variationId: 2, value: "XXL" }
          ]
        }
      ]
    };
  },
  updateItem: async (cartItemId, data) => {
    return { success: true };
  },
  removeItem: async (cartItemId) => {
    return { success: true };
  }
};

const getUserId = () => 9;

const CartCheckout = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const userId = getUserId();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    if (!userId) {
      setError("Vui lòng đăng nhập để xem giỏ hàng.");
      return;
    }

    try {
      setIsLoading(true);
      const data = await CartService.getCart(userId);
      setItems(data.items || []);
      // Tự động chọn tất cả items
      setSelectedItems(new Set(data.items.map(item => item.id)));
    } catch (err) {
      console.error("❌ Lỗi tải giỏ hàng:", err);
      setError("Không thể tải giỏ hàng.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) =>
    price ? `${price.toLocaleString("vi-VN")}₫` : "0₫";

  // Toggle chọn item
  const toggleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Chọn tất cả
  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  // Tăng số lượng
  const handleIncrease = async (item) => {
    try {
      setIsLoading(true);
      const newQty = item.qty + 1;
      await CartService.updateItem(item.id, { qty: newQty });
      setItems(prev =>
        prev.map(i => (i.id === item.id ? { ...i, qty: newQty } : i))
      );
    } catch (err) {
      console.error("❌ Lỗi cập nhật số lượng:", err);
      setError("Không thể cập nhật số lượng");
    } finally {
      setIsLoading(false);
    }
  };

  // Giảm số lượng
  const handleDecrease = async (item) => {
    if (item.qty <= 1) return;
    try {
      setIsLoading(true);
      const newQty = item.qty - 1;
      await CartService.updateItem(item.id, { qty: newQty });
      setItems(prev =>
        prev.map(i => (i.id === item.id ? { ...i, qty: newQty } : i))
      );
    } catch (err) {
      console.error("❌ Lỗi cập nhật số lượng:", err);
      setError("Không thể cập nhật số lượng");
    } finally {
      setIsLoading(false);
    }
  };

  // Xóa item
  const handleRemove = async (cartItemId) => {
    if (!window.confirm("🗑️ Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) return;
    try {
      setIsLoading(true);
      await CartService.removeItem(cartItemId);
      setItems(prev => prev.filter(i => i.id !== cartItemId));
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    } catch (err) {
      console.error("❌ Lỗi xóa sản phẩm:", err);
      setError("Không thể xóa sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  // Xóa items đã chọn
  const handleRemoveSelected = async () => {
    if (selectedItems.size === 0) {
      alert("⚠️ Vui lòng chọn ít nhất một sản phẩm để xóa");
      return;
    }
    if (!window.confirm(`🗑️ Bạn có chắc muốn xóa ${selectedItems.size} sản phẩm đã chọn?`)) return;
    
    try {
      setIsLoading(true);
      for (const itemId of selectedItems) {
        await CartService.removeItem(itemId);
      }
      setItems(prev => prev.filter(i => !selectedItems.has(i.id)));
      setSelectedItems(new Set());
    } catch (err) {
      console.error("❌ Lỗi xóa sản phẩm:", err);
      setError("Không thể xóa các sản phẩm đã chọn");
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy options display
  const getOptionsDisplay = (selectedOptions) => {
    if (!selectedOptions || selectedOptions.length === 0) return null;
    return selectedOptions.map(opt => opt.value).join(" - ");
  };

  // Tính tổng tiền các items đã chọn
  const selectedTotal = items
    .filter(item => selectedItems.has(item.id))
    .reduce((sum, item) => sum + item.price * item.qty, 0);

  const selectedCount = selectedItems.size;

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      alert("⚠️ Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleConfirmCheckout = () => {
    alert(`✅ Đặt hàng thành công ${selectedCount} sản phẩm!\nTổng tiền: ${formatPrice(selectedTotal)}`);
    setShowCheckoutModal(false);
    // Xóa các items đã thanh toán
    setItems(prev => prev.filter(i => !selectedItems.has(i.id)));
    setSelectedItems(new Set());
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="fixed inset-0 bg-white/90 flex flex-col items-center justify-center z-50">
        <div className="text-4xl mb-4 animate-spin">⏳</div>
        <p className="text-gray-700">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">🛒 Giỏ hàng của bạn</h1>
        <button
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg font-medium transition"
          onClick={() => window.history.back()}
        >
          ← Quay lại
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between bg-red-100 border border-red-300 rounded-lg p-4 mb-4 text-red-700">
          {error}
          <button
            onClick={() => setError(null)}
            className="text-red-700 hover:bg-red-200 px-2 py-1 rounded"
          >
            ✖
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛍️</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-6">Hãy thêm vài sản phẩm yêu thích của bạn nhé!</p>
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            onClick={() => (window.location.href = "/shop")}
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Cart Header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === items.length && items.length > 0}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Sản phẩm ({items.length})
                  </h2>
                </div>
                <button
                  onClick={handleRemoveSelected}
                  disabled={selectedItems.size === 0}
                  className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  🗑️ Xóa đã chọn
                </button>
              </div>

              {/* Items List */}
              <div>
                {items.map((item) => {
                  const isSelected = selectedItems.has(item.id);
                  const optionsDisplay = getOptionsDisplay(item.selectedOptions);
                  
                  return (
                    <div
                      key={item.id}
                      className={`grid grid-cols-[auto,1fr,auto] gap-4 p-4 border-b hover:bg-gray-50 transition ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <div className="flex items-start pt-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(item.id)}
                          className="w-5 h-5 cursor-pointer"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={`https://placehold.co/200x200/e2e8f0/64748b?text=Product+${item.productItemId}`}
                            alt="Product"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            Sản phẩm #{item.productItemId}
                          </h3>
                          
                          {optionsDisplay && (
                            <div className="mb-2">
                              <span className="inline-block text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                                {optionsDisplay}
                              </span>
                            </div>
                          )}

                          {item.is_customed && (
                            <span className="inline-block text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded mb-2">
                              🎨 Tùy chỉnh
                            </span>
                          )}

                          <p className="text-lg font-semibold text-blue-600">
                            {formatPrice(item.price)}
                          </p>

                          {/* Quantity Control - Mobile */}
                          <div className="flex items-center gap-3 mt-3 md:hidden">
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleDecrease(item)}
                                disabled={item.qty <= 1 || isLoading}
                                className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                              >
                                −
                              </button>
                              <span className="w-12 h-8 flex items-center justify-center border-x border-gray-300 font-medium">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => handleIncrease(item)}
                                disabled={isLoading}
                                className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 disabled:opacity-50 transition"
                              >
                                ＋
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleRemove(item.id)}
                              disabled={isLoading}
                              className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded transition"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Actions - Desktop */}
                      <div className="hidden md:flex flex-col items-end gap-3">
                        <div className="text-lg font-bold text-gray-800">
                          {formatPrice(item.price * item.qty)}
                        </div>

                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleDecrease(item)}
                            disabled={item.qty <= 1 || isLoading}
                            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            −
                          </button>
                          <span className="w-12 h-8 flex items-center justify-center border-x border-gray-300 font-medium">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => handleIncrease(item)}
                            disabled={isLoading}
                            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 disabled:opacity-50 transition"
                          >
                            ＋
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={isLoading}
                          className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Tóm tắt đơn hàng</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Đã chọn ({selectedCount} sản phẩm)</span>
                  <span className="font-medium">{formatPrice(selectedTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-green-600">Miễn phí 🚚</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-800 pt-4 border-t-2">
                <span>Tổng cộng</span>
                <span className="text-blue-600">{formatPrice(selectedTotal)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedItems.size === 0 || isLoading}
                className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Thanh toán ngay 💳
              </button>

              {selectedItems.size === 0 && (
                <p className="text-sm text-gray-500 text-center mt-3">
                  ⚠️ Vui lòng chọn sản phẩm để thanh toán
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Xác nhận đặt hàng</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 mb-2">
                Số sản phẩm: <span className="font-semibold">{selectedCount}</span>
              </p>
              <p className="text-gray-700 mb-2">
                Tạm tính: <span className="font-semibold">{formatPrice(selectedTotal)}</span>
              </p>
              <p className="text-gray-700 mb-2">
                Phí vận chuyển: <span className="font-semibold text-green-600">Miễn phí</span>
              </p>
              <div className="border-t-2 border-gray-300 pt-2 mt-2">
                <p className="text-lg font-bold text-blue-600">
                  Tổng cộng: {formatPrice(selectedTotal)}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn muốn đặt hàng {selectedCount} sản phẩm?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="flex-1 py-2.5 border-2 border-gray-300 hover:bg-gray-50 rounded-lg font-semibold transition"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmCheckout}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && items.length > 0 && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="text-4xl mb-2 animate-spin">⏳</div>
            <p className="text-gray-700">Đang xử lý...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartCheckout;