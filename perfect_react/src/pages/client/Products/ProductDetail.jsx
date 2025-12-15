
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../../../services/productService';
import styles from './ProductDetail.module.css';
import { reviewService } from '../../../services/userReviewService';
import CartService from '../../../services/cart_service';
import { getUserId } from '../../../utils/auth';


const Carousel = ({ children, itemsPerView = 3, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = React.Children.toArray(children);
  const totalSlides = Math.ceil(items.length / itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleItems = items.slice(
    currentIndex * itemsPerView,
    (currentIndex + 1) * itemsPerView
  );

  return (
    <div className={`${styles.carousel} ${className}`}>
      <button
        onClick={prevSlide}
        className={styles.carouselBtn}
        disabled={currentIndex === 0}
      >
        ◀
      </button>
      <div className={styles.carouselContent}>
        {visibleItems}
      </div>
      <button
        onClick={nextSlide}
        className={styles.carouselBtn}
        disabled={currentIndex >= totalSlides - 1}
      >
        ▶
      </button>
    </div>
  );
};


const ImageModal = ({ src, alt, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>
        <img src={src} alt={alt} className={styles.modalImage} />
      </div>
    </div>
  );
};


const mockFAQs = [
  {
    question: 'Sản phẩm này có bảo hành không?',
    answer: 'Có, sản phẩm được bảo hành 12 tháng kể từ ngày mua. Bảo hành bao gồm lỗi do nhà sản xuất và hỗ trợ kỹ thuật miễn phí.'
  },
  {
    question: 'Thời gian giao hàng bao lâu?',
    answer: 'Giao hàng trong 2-5 ngày làm việc tại khu vực nội thành và 5-7 ngày cho các tỉnh xa. Miễn phí giao hàng cho đơn hàng trên 500.000đ.'
  },
  {
    question: 'Có thể đổi trả sản phẩm không?',
    answer: 'Khách hàng có thể đổi trả trong vòng 7 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên vẹn, chưa sử dụng.'
  },
  {
    question: 'Làm sao để kiểm tra tình trạng đơn hàng?',
    answer: 'Bạn có thể kiểm tra tình trạng đơn hàng qua email xác nhận hoặc liên hệ hotline 1900-xxxx để được hỗ trợ.'
  },
  {
    question: 'Sản phẩm có được hoàn tiền không?',
    answer: 'Chúng tôi hỗ trợ hoàn tiền 100% trong trường hợp sản phẩm bị lỗi từ nhà sản xuất hoặc không đúng mô tả.'
  },
  {
    question: 'Có hỗ trợ trả góp không?',
    answer: 'Có, chúng tôi hỗ trợ trả góp 0% lãi suất qua các ngân hàng đối tác cho đơn hàng từ 3 triệu đồng trở lên.'
  }
];

const CURRENT_USER_ID = 1;


function broadcastCartChange() {
  try {
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (e) {  }

  try {
    localStorage.setItem('cart', String(Date.now()));
  } catch (e) {  }
}



const ProductDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  
  const [options, setOptions] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentItem, setCurrentItem] = useState(null);

  
  const [comments, setComments] = useState([]);
  const [ratingStats, setRatingStats] = useState({ averageRating: 0.0, reviewCount: 0 });
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  
  const [relatedProducts, setRelatedProducts] = useState([]); 
  const [loadingRelated, setLoadingRelated] = useState(true); 

  
  const [isAdding, setIsAdding] = useState(false);

  
  const formatCurrency = (amount) => {
    if (amount == null) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const [productData, reviewsData, statsData] = await Promise.all([
          productService.getProductById(id),
          reviewService.getReviews(id),
          reviewService.getRatingStats(id)
        ]);
        setProduct(productData);
        setComments(reviewsData);
        setRatingStats(statsData);
      } catch (err) {
        console.error(">>> Lỗi thực sự trong useEffect:", err);
        setError(err?.message || 'Không thể tải dữ liệu sản phẩm');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  
  useEffect(() => {
    if (product && product.items && product.items.length > 0) {
      const newOptions = {};
      const initialSelection = {};

      product.items.forEach(item => {
        if (item.configurations && Array.isArray(item.configurations)) {
          item.configurations.forEach(config => {
            if (!newOptions[config.variationName]) {
              newOptions[config.variationName] = new Set();
            }
            newOptions[config.variationName].add(config.value);
          });
        }
      });

      const finalOptions = {};
      Object.keys(newOptions).forEach(key => {
        finalOptions[key] = Array.from(newOptions[key]);
        initialSelection[key] = finalOptions[key][0];
      });

      setOptions(finalOptions);
      setSelectedOptions(initialSelection);
    }
  }, [product]);

  
  useEffect(() => {
    if (product && product.items && Object.keys(selectedOptions).length > 0) {
      const foundItem = product.items.find(item => {
        if (!item.configurations || !Array.isArray(item.configurations)) {
          return false;
        }
        if (item.configurations.length !== Object.keys(selectedOptions).length) {
          return false;
        }
        return item.configurations.every(config => {
          return config.value === selectedOptions[config.variationName];
        });
      });
      setCurrentItem(foundItem || null);
    }
  }, [product, selectedOptions]);

  
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product && product.category) {
        try {
          setLoadingRelated(true);
          const categoryId = product.category.categoryId;

          
          
          const data = await productService.getAllProducts(0, 5, categoryId, null, 'hot');

          
          const related = data.content.filter(
            p => p.productId !== product.productId
          );

          
          setRelatedProducts(related.slice(0, 4));

        } catch (err) {
          console.error("Lỗi khi tải sản phẩm liên quan:", err);
        } finally {
          setLoadingRelated(false);
        }
      }
    };
    fetchRelatedProducts();
  }, [product]);

  
  const findMatchingCartEntry = (cartData, itemToMatch, selectedOptionIds = []) => {
    if (!cartData || !Array.isArray(cartData.items)) return null;
    for (const it of cartData.items) {
      const pid1 = it?.productItemId ?? it?.product_item_id ?? it?.productItem ?? it?.itemId ?? it?.item_id ?? null;
      const sku1 = it?.sku ?? it?.SKU ?? null;
      const code1 = it?.productCode ?? it?.product_code ?? null;

      const pid2 = itemToMatch?.productItemId ?? itemToMatch?.product_item_id ?? null;
      const sku2 = itemToMatch?.sku ?? itemToMatch?.SKU ?? null;
      const code2 = itemToMatch?.productCode ?? itemToMatch?.product_code ?? null;

      if (pid1 != null && pid2 != null && String(pid1) === String(pid2)) {
        return {
          cartEntryId: it.id ?? it.cartItemId ?? it.cart_item_id ?? it?.itemId ?? it?.item_id,
          qty: Number(it.qty || it.quantity || it.count || 1),
          raw: it
        };
      }
      if (sku1 && sku2 && String(sku1) === String(sku2)) {
        return {
          cartEntryId: it.id ?? it.cartItemId ?? it.cart_item_id ?? it?.itemId ?? it?.item_id,
          qty: Number(it.qty || it.quantity || it.count || 1),
          raw: it
        };
      }
      if (code1 && code2 && String(code1) === String(code2)) {
        return {
          cartEntryId: it.id ?? it.cartItemId ?? it.cart_item_id ?? it?.itemId ?? it?.item_id,
          qty: Number(it.qty || it.quantity || it.count || 1),
          raw: it
        };
      }
    }
    return null;
  };

  
  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);

    try {
      const userId = getUserId();
      if (!userId) {
        alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
        return;
      }

      if (!currentItem) {
        alert("Vui lòng chọn đầy đủ các tùy chọn (màu sắc, kích thước...) trước khi thêm vào giỏ!");
        return;
      }

      if (!currentItem.qtyInStock || currentItem.qtyInStock <= 0) {
        alert("Sản phẩm hiện đã hết hàng. Vui lòng chọn biến thể khác hoặc quay lại sau!");
        return;
      }

      const selectedOptionIds = (currentItem.configurations || []).map(c => c.variationOptionId).filter(Boolean);
      let cartData = null;
      try {
        cartData = await CartService.getCart();
      } catch (e) {
        cartData = null;
      }

      const match = findMatchingCartEntry(cartData, currentItem, selectedOptionIds);

      if (match && match.cartEntryId) {
        const newQty = Math.max(1, (Number(match.qty) || 0) + 1);
        if (typeof CartService.updateCartItem === 'function') {
          await CartService.updateCartItem(match.cartEntryId, newQty);
        } else if (typeof CartService.api === 'object' && typeof CartService.api.put === 'function') {
          await CartService.api.put(`/api/cart/item/${match.cartEntryId}`, { qty: newQty });
        } else {
          await CartService.addToCart({
            productItemId: currentItem.productItemId,
            qty: 1,
            price: currentItem.price ?? currentItem.originalPrice ?? 0,
            isCustomed: false,
            selectedOptions: selectedOptionIds
          });
        }
        alert("Đã thêm sản phẩm vào giỏ hàng thành công!");
      } else {
        await CartService.addToCart({
          productItemId: currentItem.productItemId,
          qty: 1,
          price: currentItem.price ?? currentItem.originalPrice ?? 0,
          isCustomed: false,
          selectedOptions: selectedOptionIds
        });
        alert("Đã thêm sản phẩm vào giỏ hàng thành công!");
      }
      try { broadcastCartChange(); } catch (e) { console.warn('broadcastCartChange failed', e); }
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      const msg = err?.response?.data?.message || err?.message || 'Không thể thêm vào giỏ hàng.';
      alert(msg);
    } finally {
      setIsAdding(false);
    }
  };

  
  const handleBuyNow = async () => {
    if (isAdding) return;
    setIsAdding(true);

    try {
      const userId = getUserId();
      if (!userId) {
        alert("Bạn cần đăng nhập để thanh toán!");
        return;
      }

      if (!currentItem) {
        alert("Vui lòng chọn đầy đủ các tùy chọn trước khi mua!");
        return;
      }

      if (!currentItem.qtyInStock || currentItem.qtyInStock <= 0) {
        alert("Sản phẩm hiện đã hết hàng. Vui lòng chọn biến thể khác hoặc quay lại sau!");
        return;
      }

      const selectedOptionIds = (currentItem.configurations || []).map(c => c.variationOptionId).filter(Boolean);
      let cartData = null;
      try {
        cartData = await CartService.getCart();
      } catch (e) {
        cartData = null;
      }

      const match = findMatchingCartEntry(cartData, currentItem, selectedOptionIds);

      if (match && match.cartEntryId) {
        const newQty = Math.max(1, (Number(match.qty) || 0) + 1);
        if (typeof CartService.updateCartItem === 'function') {
          await CartService.updateCartItem(match.cartEntryId, newQty);
        } else if (typeof CartService.api === 'object' && typeof CartService.api.put === 'function') {
          await CartService.api.put(`/api/cart/item/${match.cartEntryId}`, { qty: newQty });
        } else {
          await CartService.addToCart({
            productItemId: currentItem.productItemId,
            qty: 1,
            price: currentItem.price ?? currentItem.originalPrice ?? 0,
            isCustomed: false,
            selectedOptions: selectedOptionIds
          });
        }
      } else {
        await CartService.addToCart({
          productItemId: currentItem.productItemId,
          qty: 1,
          price: currentItem.price ?? currentItem.originalPrice ?? 0,
          isCustomed: false,
          selectedOptions: selectedOptionIds
        });
      }

      try { broadcastCartChange(); } catch (_) { }
      try {
        localStorage.setItem('cart_selected', JSON.stringify([String(currentItem.productItemId)]));
      } catch (e) {
        console.warn('Could not set cart_selected in localStorage', e);
      }
      const encoded = encodeURIComponent(String(currentItem.productItemId));
      navigate(`/cart?select=${encoded}`);
    } catch (err) {
      console.error("Lỗi khi mua ngay:", err);
      const msg = err?.response?.data?.message || err?.message || 'Không thể thực hiện mua ngay.';
      alert(msg);
    } finally {
      setIsAdding(false);
    }
  };

  
  const handleOptionClick = (optionName, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleImageDoubleClick = () => {
    setIsImageModalOpen(true);
  };

  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!currentItem || !currentItem.productItemId) {
      alert('Vui lòng chọn một phân loại sản phẩm (size/màu) để đánh giá.');
      setIsSubmitting(false);
      return;
    }

    if (newComment.trim() && userRating > 0) {
      try {
        const reviewData = {
          productItemId: currentItem.productItemId,
          ratingValue: userRating,
          comment: newComment
        };
        console.log("Đang gửi reviewData:", reviewData);

        
        const newReview = await reviewService.postReview(reviewData);

        
        setComments(prevComments => [newReview, ...prevComments]);
        const statsData = await reviewService.getRatingStats(id);
        setRatingStats(statsData);
        setNewComment('');
        setUserRating(0);
        alert('Cảm ơn bạn đã đánh giá sản phẩm!');

      } catch (error) {
        if (error.response) {
          const status = error.response.status;
          
          if (status === 401 || (status === 500 && error.config?._retry)) {
            alert('Vui lòng đăng nhập để đánh giá.');
            navigate('/login');
            return;
          }
          switch (status) {
            case 403:
              alert('Bạn cần mua sản phẩm này để được đánh giá.');
              break;
            case 409:
              alert('Bạn đã đánh giá sản phẩm này rồi.');
              break;
            default:
              alert(error.response.data?.message || 'Gửi đánh giá thất bại: Lỗi máy chủ.');
          }
        } else {
          
          alert('Gửi đánh giá thất bại: ' + error.message);
        }
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('Vui lòng nhập bình luận và chọn đánh giá sao.');
      setIsSubmitting(false);
    }
  };

  const hasSale = currentItem && currentItem.discountRate > 0;

  
  if (isLoading) {
    return (
      <div className={styles.productDetail}>
        <div className={styles.container}>
          <div className={`${styles.breadcrumbs} ${styles.loading}`}>
            <div style={{ width: '200px', height: '16px', background: '#e2e8f0', borderRadius: '4px' }}></div>
          </div>
          <div className={styles.content}>
            <div className={`${styles.imageWrapper} ${styles.loading}`}>
              <div>Đang tải hình ảnh...</div>
            </div>
            <div className={`${styles.info} ${styles.loading}`}>
              <div style={{ width: '80%', height: '32px', background: '#e2e8f0', borderRadius: '8px', marginBottom: '16px' }}></div>
              <div style={{ width: '60%', height: '20px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '16px' }}></div>
              <div style={{ width: '40%', height: '28px', background: '#e2e8f0', borderRadius: '6px', marginBottom: '16px' }}></div>
              <div style={{ width: '100%', height: '80px', background: '#e2e8f0', borderRadius: '8px' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className={styles.productDetail}>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>⚠ Có lỗi xảy ra</h2>
            <p>{error}</p>
          </div>
          <Link to="/products" className={styles.backLink}>
            ← Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  
  return (
    <div className={styles.productDetail}>
      <div className={styles.container}>
        {}
        <nav className={styles.breadcrumbs}>
          <Link to="/">🏠 Trang chủ</Link>
          <span>/</span>
          <Link to="/products">📦 Sản phẩm</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to="/products">{product.category.categoryName}</Link>
            </>
          )}
          <span>/</span>
          <span>{product.productName}</span>
        </nav>

        {}
        <div className={styles.content}>
          {}
          <div className={styles.imageWrapper}>
            <img
              src={`/Product/${currentItem?.itemImage || product.productMainImage}`}
              alt={product.productName}
              className={styles.image}
              onDoubleClick={handleImageDoubleClick}
              title="Double-click để phóng to"
            />
          </div>

          {}
          <div className={styles.info}>
            <h1 className={styles.title}>{product.productName}</h1>

            {}
            <div className={styles.ratingInfo}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#f59e0b', fontSize: '16px' }}>
                  ⭐ {ratingStats?.averageRating?.toFixed(1) ?? '0.0'}
                </span>
                <span style={{ color: '#64748b' }}>
                  {Math.round(ratingStats.averageRating)}/5
                </span>
                <span style={{ color: '#94a3b8' }}>|</span>
                <span style={{ color: '#64748b' }}>
                  {ratingStats.reviewCount} đánh giá
                </span>
                <span>
                  {product.totalSold >= 0 && (
                    <div className={styles.soldCount}>
                      Đã bán {product.totalSold}
                    </div>
                  )}
                </span>
              </div>
            </div>

            {}
            <div className={styles.priceContainer}>
              {!currentItem ? (
                <span className={styles.price} style={{ color: '#6b7280' }}>Vui lòng chọn biến thể</span>
              ) : hasSale ? (
                <>
                  <span className={styles.newPrice}>
                    {formatCurrency(currentItem.price)}
                  </span>
                  <span className={styles.originalPrice}>
                    {formatCurrency(currentItem.originalPrice)}
                  </span>
                  <span className={styles.saleBadgeDetail}>
                    -{Math.round(currentItem.discountRate)}%
                  </span>
                </>
              ) : (
                <span className={styles.price} style={{ color: '#1e293b' }}>
                  {formatCurrency(currentItem.originalPrice)}
                </span>
              )}
            </div>

            {}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentItem && (
                <>
                  <div className={styles.metaRow}>
                    <span>📦 Mã SKU:</span>
                    <span className={styles.metaValue}>{currentItem.sku}</span>
                  </div>
                  <div className={styles.metaRow}>
                    <span>📊 Tồn kho:</span>
                    <span className={styles.metaValue}>
                      {currentItem.qtyInStock > 0 ? `${currentItem.qtyInStock} sản phẩm` : 'Hết hàng'}
                      {currentItem.qtyInStock > 0 && (
                        <span style={{
                          marginLeft: '8px',
                          color: currentItem.qtyInStock > 10 ? '#10b981' : '#f59e0b',
                          fontSize: '12px'
                        }}>
                          {currentItem.qtyInStock > 10 ? '✅ Còn hàng' : '⚠️ Sắp hết'}
                        </span>
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>

            {}
            {product.productDescription && (
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#1e293b' }}>📝 Mô tả sản phẩm</h3>
                <p className={styles.description}>{product.productDescription}</p>
              </div>
            )}

            {}
            {Object.entries(options).map(([optionName, values]) => (
              <div className={styles.optionGroup} key={optionName}>
                <div className={styles.optionLabel}>🎨 {optionName}</div>
                <div className={styles.chips}>
                  {values.map((value) => (
                    <span
                      key={value}
                      className={`${styles.chip} ${selectedOptions[optionName] === value ? styles.chipSelected : ''}`}
                      onClick={() => handleOptionClick(optionName, value)}
                      style={{
                        borderColor: selectedOptions[optionName] === value ? '#3b82f6' : '#e2e8f0',
                        backgroundColor: selectedOptions[optionName] === value ? '#dbeafe' : '#f8fafc',
                        color: selectedOptions[optionName] === value ? '#2563eb' : '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {}
            <div className={styles.actions}>
              <button
                className={styles.primaryBtn}
                onClick={handleAddToCart}
                disabled={isAdding || currentItem?.qtyInStock === 0}
              >
                {isAdding ? 'Đang thêm...' : (currentItem?.qtyInStock === 0 ? 'Hết hàng' : '🛒 Thêm vào giỏ')}
              </button>
              <button
                className={styles.secondaryBtn}
                onClick={handleBuyNow}
                disabled={isAdding || !currentItem || currentItem.qtyInStock === 0}
              >
                {isAdding ? 'Đang xử lý...' : '💳 Mua ngay'}
              </button>
            </div>

            {}
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #bae6fd',
              marginTop: '16px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1' }}>
                  <span>🚚</span>
                  <span>Miễn phí giao hàng cho đơn từ 500.000đ</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1' }}>
                  <span>🔄</span>
                  <span>Đổi trả miễn phí trong 7 ngày</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1' }}>
                  <span>🛡️</span>
                  <span>Bảo hành chính hãng 12 tháng</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        {Array.isArray(product.specs) && product.specs.length > 0 && (
          <section className={styles.specs}>
            <h2 className={styles.sectionTitle}>📊 Thông số kỹ thuật</h2>
            <Carousel itemsPerView={2} className={styles.specsCarousel}>
              {product.specs.map((spec, idx) => (
                <div key={idx} className={styles.specCard}>
                  <div className={styles.specLabel}>{spec.label}</div>
                  <div className={styles.specValue}>{spec.value}</div>
                </div>
              ))}
            </Carousel>
          </section>
        )}

        {}
        <section className={styles.faqs}>
          <h2 className={styles.sectionTitle}>❓ Câu hỏi thường gặp</h2>
          <Carousel itemsPerView={2} className={styles.faqsCarousel}>
            {mockFAQs.map((faq, index) => (
              <div key={index} className={styles.faqCard}>
                <h3>Q: {faq.question}</h3>
                <p>A: {faq.answer}</p>
              </div>
            ))}
          </Carousel>
        </section>

        {}
        <section className={styles.comments}>
          <h2 className={styles.sectionTitle}>💬 Đánh giá & Bình luận</h2>

          {}
          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontWeight: '600', color: '#1e293b', marginBottom: '8px', display: 'block' }}>
                Đánh giá của bạn
              </label>
              <div className={styles.ratingInput}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`${styles.star} ${userRating >= star ? styles.starActive : ''}`}
                    onClick={() => setUserRating(star)}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    ⭐
                  </span>
                ))}
                <span style={{ marginLeft: '12px', color: '#64748b', fontSize: '14px' }}>
                  {userRating > 0 ? `${userRating}/5 sao` : 'Chưa chọn'}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontWeight: '600', color: '#1e293b', marginBottom: '8px', display: 'block' }}>
                Bình luận của bạn
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                className={styles.commentInput}
                maxLength={500}
              />
              <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'right', marginTop: '4px' }}>
                {newComment.length}/500 ký tự
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitComment}
              disabled={isSubmitting} 
              style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              {isSubmitting ? '⏳ Đang gửi...' : '📝 Gửi đánh giá'}
            </button>
          </form>

          {}
          <div className={styles.commentList}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>
              📋 Tất cả đánh giá ({ratingStats.reviewCount})
            </h3>
            {comments.length === 0 && !isLoading && (
              <p>Chưa có đánh giá nào cho sản phẩm này.</p>
            )}

            <div className={styles.commentsListContainer}>
              {(Array.isArray(comments) ? comments : []).map((comment) => (
                <div key={comment.id} className={styles.commentCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={comment.userAvatar || '/default-avatar.png'}
                        alt={comment.userName}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div className={styles.commentRating}>
                          {'⭐'.repeat(comment.ratingValue)} ({comment.ratingValue}/5)
                        </div>
                        <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
                          {comment.userName || 'Anonymous'}
                        </div>
                      </div>
                    </div>
                    <span className={styles.commentDate}>
                      {comment.createdAt ? (
                        new Intl.DateTimeFormat('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }).format(new Date(comment.createdAt))
                      ) : (
                        'Unknown date'
                      )}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 0 50px', lineHeight: '1.6', color: '#475569' }}>
                    {comment.comment}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {}
        <section className={styles.suggestions}>
          <h2 className={styles.sectionTitle}>🔥 Sản phẩm liên quan</h2>

          {loadingRelated && <p>Đang tải...</p>}

          {!loadingRelated && relatedProducts.length > 0 && (
            <Carousel itemsPerView={4} className={styles.relatedCarousel}>
              {relatedProducts.map((relProduct) => {
                const displayItem = relProduct.items?.[0];
                const hasSale = displayItem && displayItem.discountRate > 0;

                return (
                  <div key={relProduct.productId} className={styles.relatedCard}>
                    <Link to={`/products/${relProduct.productId}`} className={styles.relatedLink}>
                      {hasSale && (
                        <div className={styles.relatedBadge}>
                          -{Math.round(displayItem.discountRate)}%
                        </div>
                      )}
                      <img
                        src={`/Product/${relProduct.productMainImage}`}
                        alt={relProduct.productName}
                        className={styles.relatedImage}
                      />
                      <div className={styles.relatedInfo}>
                        <h3 className={styles.relatedName}>{relProduct.productName}</h3>
                        <div className={styles.relatedPriceContainer}>
                          {hasSale ? (
                            <>
                              <span className={styles.relatedNewPrice}>
                                {formatCurrency(displayItem.price)}
                              </span>
                              <span className={styles.relatedOldPrice}>
                                {formatCurrency(displayItem.originalPrice)}
                              </span>
                            </>
                          ) : (
                            <span className={styles.relatedPrice}>
                              {formatCurrency(displayItem?.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </Carousel>
          )}

          {!loadingRelated && relatedProducts.length === 0 && (
            <p style={{ fontStyle: 'italic', color: '#64748b' }}>Không có sản phẩm liên quan nào.</p>
          )}
        </section>
      </div>

      {}
      <ImageModal
        src={`/Product/${currentItem?.itemImage || product.productMainImage}`}
        alt={product.productName}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />
    </div>
  );
};

export default ProductDetail;