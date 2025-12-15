import React, { useEffect, useState, useCallback } from 'react';
import ReactPaginate from 'react-paginate';
import styles from './Products.module.css';
import { productService } from '../../../services/productService';
import { categoryService } from '../../../services/categoryService';
import { promotionService } from '../../../services/promotionService';
const ITEMS_PER_PAGE = 10;

//state chỉnh sửa sản phẩm
const getInitialFormData = () => ({
  productId: null, // <-- Thêm ID (quan trọng để biết là sửa hay thêm)
  productName: '',
  categoryId: '',
  productDescription: '',
  productMainImage: null, // Sẽ là file (khi thêm) hoặc string (khi sửa)
  items: [
    {
      productItemId: null, // <-- Thêm ID item
      sku: '',
      qtyInStock: '',
      price: '',
      itemImage: null,
      configurations: []
    }
  ]
});

function Products() {
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [currentProductForPromo, setCurrentProductForPromo] = useState(null);
  const [loadingPromo, setLoadingPromo] = useState(false);
  const [promoFormData, setPromoFormData] = useState({
    promotionId: null,
    name: '',
    description: '',
    discountRate: '',
    startDate: '',
    endDate: '',
    productId: null
  });

  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  
  const [showModal, setShowModal] = useState(false); 
  const [modalMode, setModalMode] = useState('ADD');   
  const [formData, setFormData] = useState(getInitialFormData()); 

  
  const [variations, setVariations] = useState([]);
  const [loadingVariations, setLoadingVariations] = useState(true);

  const [imagePreview, setImagePreview] = useState(null);
  const [itemImagePreviews, setItemImagePreviews] = useState({}); 

  
  useEffect(() => {
    const fetchVariations = async () => {
      setLoadingVariations(true);
      try {
        
        

        
        const mockVariations = [
          {
            variationId: 1,
            variationName: 'Color',
            options: [
              { variationOptionId: 1, value: 'White' },
              { variationOptionId: 2, value: 'Black' },
              { variationOptionId: 3, value: 'Red' },
              { variationOptionId: 4, value: 'Pink' },
              { variationOptionId: 5, value: 'Grey' },
              { variationOptionId: 6, value: 'Brown' },
              { variationOptionId: 7, value: 'Blue' },
              { variationOptionId: 8, value: 'Green' },
              { variationOptionId: 9, value: 'Navy' },
              
            ]
          },
          {
            variationId: 2,
            variationName: 'Size',
            options: [
              { variationOptionId: 10, value: 'S' },
              { variationOptionId: 11, value: 'M' },
              { variationOptionId: 12, value: 'L' },
              { variationOptionId: 13, value: 'XL' },
              { variationOptionId: 14, value: 'XXL' },
              
            ]
          }
        ];

        setVariations(mockVariations);
      } catch (err) {
        console.error("Lỗi khi tải variations:", err);
        setError("Không thể tải danh sách biến thể.");
      } finally {
        setLoadingVariations(false);
      }
    };
    fetchVariations();
  }, []);

  
  const findVariationIdByOptionId = (optionId) => {
    for (const v of variations) {
      if (v.options.some(o => o.variationOptionId === optionId)) return v.variationId;
    }
    return null;
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        productMainImage: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  
  const handleItemImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newItems = [...formData.items];
      newItems[index].itemImage = file;
      setFormData(prev => ({
        ...prev,
        items: newItems
      }));

      
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemImagePreviews(prev => ({
          ...prev,
          [index]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  
  const handleConfigurationChange = (itemIndex, variationId, variationOptionId, variationName, value) => {
    const newItems = [...formData.items];
    const configs = newItems[itemIndex].configurations ? [...newItems[itemIndex].configurations] : [];

    
    const existingIndex = configs.findIndex(c => c.variationId === variationId);

    const newConfig = {
      variationId: parseInt(variationId, 10),
      variationOptionId: parseInt(variationOptionId, 10),
      variationName,
      value
    };

    if (existingIndex >= 0) {
      configs[existingIndex] = newConfig;
    } else {
      configs.push(newConfig);
    }

    newItems[itemIndex].configurations = configs;
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  
  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          sku: '',
          qtyInStock: '',
          price: '',
          itemImage: null,
          configurations: []
        }
      ]
    }));
  };

  
  const handleRemoveItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: newItems
      }));

      
      const newPreviews = { ...itemImagePreviews };
      delete newPreviews[index];
      setItemImagePreviews(newPreviews);
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(getInitialFormData());
    setImagePreview(null);
    setItemImagePreviews({});
  };

  
  const buildItemsPayload = (items) => {
    return items.map(item => {
      
      const mapByVariation = (item.configurations || []).reduce((acc, c) => {
        const vid = c.variationId != null ? c.variationId : findVariationIdByOptionId(c.variationOptionId);
        const key = vid != null ? `vid_${vid}` : `vname_${c.variationName || 'unknown'}`;
        acc[key] = {
          variationId: vid,
          variationOptionId: c.variationOptionId
        };
        return acc;
      }, {});

      const variationSelections = Object.values(mapByVariation).filter(Boolean);

      
      const variationOptionIds = variationSelections.map(s => s.variationOptionId);

      return {
        productItemId: item.productItemId ?? null,
        sku: item.sku,
        qtyInStock: parseInt(item.qtyInStock, 10) || 0,
        price: parseFloat(item.price) || 0,
        variationOptionIds
      };
    });
  };

  
  const handleAddProductSubmit = async (event) => {
    event.preventDefault();
    
    try {
      setLoading(true);

      const formDataToSend = new FormData();

      
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('productDescription', formData.productDescription);

      
      if (formData.productMainImage) {
        formDataToSend.append('productMainImage', formData.productMainImage);
      } else {
        throw new Error("Vui lòng chọn ảnh chính cho sản phẩm.");
      }

      
      const itemsData = buildItemsPayload(formData.items);

      
      console.log('itemsData to send (ADD):', itemsData);

      
      formDataToSend.append('items', JSON.stringify(itemsData));

      
      formData.items.forEach((item, index) => {
        if (item.itemImage && typeof item.itemImage !== 'string') {
          
          formDataToSend.append(`itemImages`, item.itemImage);
        }
      });

      await productService.createProduct(formDataToSend);

      alert('Thêm sản phẩm thành công!');
      handleCloseModal();
      fetchProducts(); 

    } catch (err) {
      console.error('Lỗi khi thêm sản phẩm:', err); 
      alert(`Lỗi khi thêm sản phẩm: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); 

    try {
      
      const formDataToSend = new FormData();
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('productDescription', formData.productDescription);

      
      
      if (formData.productMainImage && typeof formData.productMainImage !== 'string') {
        formDataToSend.append('productMainImage', formData.productMainImage);
      }

      
      const itemsData = buildItemsPayload(formData.items);

      
      console.log('itemsData to send (FORM SUBMIT):', itemsData);

      
      formDataToSend.append('items', JSON.stringify(itemsData));

      
      formData.items.forEach((item, index) => {
        
        if (item.itemImage && typeof item.itemImage !== 'string') {
          formDataToSend.append('itemImages', item.itemImage);
        }
        
      });

      
      if (modalMode === 'ADD') {
        
        await productService.createProduct(formDataToSend);
        alert('Thêm sản phẩm thành công!');
      } else {
        
        await productService.updateProduct(formData.productId, formDataToSend);
        alert('Cập nhật sản phẩm thành công!');
      }

      
      handleCloseModal();
      fetchProducts(); 

    } catch (err) {
      console.error(`Lỗi khi ${modalMode === 'ADD' ? 'thêm' : 'cập nhật'} sản phẩm:`, err);
      alert(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await categoryService.getAllCategories();
        setCategories([{ categoryId: 'all', categoryName: 'Tất cả danh mục' }, ...data]);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
        setError("Không thể tải danh mục.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(0);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await productService.getAllProducts(
        currentPage,
        ITEMS_PER_PAGE,
        selectedCategory,
        debouncedSearchTerm,
      );

      setProducts(data.content);
      setPageCount(data.totalPages);

    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
      setError(err.message || "Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, debouncedSearchTerm, loadingCategories]);

  useEffect(() => {
    if (!loadingCategories) {
      fetchProducts();
    }
  }, [fetchProducts, loadingCategories]);

  
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(0);
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}" (ID: ${productId})?`)) {
      try {
        setLoading(true);
        await productService.deleteProduct(productId);
        alert(`Đã xóa sản phẩm ${productId} thành công!`);
        fetchProducts();
      } catch (err) {
        alert(`Xóa sản phẩm thất bại: ${err.message}`);
        setError(err.message);
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = (productId, currentStatus) => {
    console.log(`Thay đổi trạng thái sản phẩm ${productId}`);
    
  };

  const handleEditProduct = (product) => {
    console.log("Edit product:", product);
    
  };

  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  
  const handleOpenAddModal = () => {
    setFormData(getInitialFormData()); 
    setImagePreview(null);
    setItemImagePreviews({});
    setModalMode('ADD');
    setShowModal(true);
  };

  
  const handleOpenEditModal = (product) => {
    
    
    
    const items = (product.items || []).map(item => {
      const reducedConfigs = (item.configurations || []).reduce((acc, config) => {
        
        const variationIdFromConfig = config.variationId != null ? config.variationId : findVariationIdByOptionId(config.variationOptionId);
        const key = variationIdFromConfig != null ? `vid_${variationIdFromConfig}` : `vname_${config.variationName}`;
        if (!acc[key]) {
          acc[key] = {
            variationId: variationIdFromConfig,
            variationOptionId: config.variationOptionId,
            variationName: config.variationName,
            value: config.value
          };
        }
        return acc;
      }, {});
      return {
        productItemId: item.productItemId,
        sku: item.sku,
        qtyInStock: item.qtyInStock,
        price: item.price,
        itemImage: item.itemImage, 
        configurations: Object.values(reducedConfigs)
      };
    });

    const editData = {
      productId: product.productId,
      productName: product.productName,
      categoryId: product.category?.categoryId || '',
      productDescription: product.productDescription,
      productMainImage: product.productMainImage, 
      items
    };
    setFormData(editData);

    
    setImagePreview(product.productMainImage ? `/Product/${product.productMainImage}` : null);
    const itemPreviews = {};
    product.items.forEach((item, index) => {
      if (item.itemImage) {
        itemPreviews[index] = `/Product/${item.itemImage}`;
      }
    });
    setItemImagePreviews(itemPreviews);

    setModalMode('EDIT'); 
    setShowModal(true);  
  };
  const handleOpenPromoModal = async (product) => {
    setCurrentProductForPromo(product);
    setLoadingPromo(true);
    setShowPromotionModal(true);

    try {
      
      const data = await promotionService.getPromotionByProductId(product.productId);
      
      setPromoFormData({
        promotionId: data.promotionId || data.id, 
        name: data.name || '',
        description: data.description || '',
        discountRate: data.discountRate || '',
        startDate: data.startDate || '',
        endDate: data.endDate || '',
        productId: product.productId
      });
    } catch (err) {
      
      if (err.response && err.response.status === 404) {
        setPromoFormData({
          promotionId: null,
          name: '',
          description: '',
          discountRate: '',
          startDate: '',
          endDate: '',
          productId: product.productId
        });
      } else {
        console.error("Lỗi tải khuyến mãi:", err);
      }
    } finally {
      setLoadingPromo(false);
    }
  };

  
  const handleClosePromoModal = () => {
    setShowPromotionModal(false);
    setCurrentProductForPromo(null);
  };

  
  const handlePromoInputChange = (e) => {
    const { name, value } = e.target;
    setPromoFormData(prev => ({ ...prev, [name]: value }));
  };

  
  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    setLoadingPromo(true);

    const payload = {
      ...promoFormData,
      productId: currentProductForPromo.productId
    };

    try {
      if (promoFormData.promotionId) {
        
        await promotionService.updatePromotion(promoFormData.promotionId, payload);
        alert("Cập nhật khuyến mãi thành công!");
      } else {
        
        await promotionService.createPromotion(payload);
        alert("Tạo khuyến mãi thành công!");
      }
      handleClosePromoModal();
      fetchProducts(); 
    } catch (err) {
      alert("Lỗi lưu khuyến mãi: " + (err.response?.data?.message || err.message));
    } finally {
      setLoadingPromo(false);
    }
  };

  
  const handleDeletePromo = async () => {
    if(!promoFormData.promotionId) return;
    if(window.confirm("Bạn chắc chắn muốn xóa khuyến mãi này?")) {
      setLoadingPromo(true);
      try {
        await promotionService.deletePromotion(promoFormData.promotionId);
        alert("Đã xóa khuyến mãi!");
        handleClosePromoModal();
        fetchProducts();
      } catch (err) {
        alert("Lỗi xóa: " + (err.response?.data?.message || err.message));
      } finally {
        setLoadingPromo(false);
      }
    }
  };

  
  
  
  
  return (
    <div className={styles.products}>
      {}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý sản phẩm</h1>
        <p className={styles.pageSubtitle}>Thêm, chỉnh sửa và quản lý sản phẩm</p>
      </div>

      {}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.categoryFilter}>
          <label className={styles.filterLabel}>Danh mục:</label>
          {loadingCategories ? (
            <select disabled><option>Đang tải...</option></select>
          ) : (
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className={styles.categorySelect}
            >
              {categories.map(category => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                  {category.productCount != null ? ` (${category.productCount})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.addBtn} onClick={handleOpenAddModal}>
            ➕ Thêm sản phẩm
          </button>

          <button className={styles.exportBtn}>📊 Xuất báo cáo</button>
        </div>
      </div>

      {}
      {error && <p className={styles.errorText}>Lỗi: {error}</p>}

      {}
      <div className={styles.tableContainer}>
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá (Item đầu)</th>
              <th>Tồn kho (Tổng)</th>
              <th>Giảm giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className={styles.loadingText}>Đang tải sản phẩm...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="7" className={styles.noDataText}>Không tìm thấy sản phẩm nào.</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.productId}>
                  <td>
                    <img
                      src={`/Product/${product.productMainImage}`}
                      alt={product.productName}
                      className={styles.tableProductImage}
                    />
                  </td>
                  <td>
                    <div className={styles.tableNameId}>
                      <span className={styles.tableName}>{product.productName}</span>
                      <span className={styles.tableId}>ID: {product.productId}</span>
                    </div>
                  </td>
                  <td>{product.category?.categoryName || 'N/A'}</td>
                  <td>
                    {product.items && product.items.length > 0
                      ? formatCurrency(product.items[0].price)
                      : 'N/A'
                    }
                  </td>
                  <td>
                    {product.items ? product.items.reduce((sum, item) => sum + (item.qtyInStock || 0), 0) : 0}
                  </td>
                  {}
                  <td>
                  {}
                  {(Number(product.discountRate) > 0 || (product.items && product.items[0]?.discountRate > 0)) ? (
                    <span
                      className={styles.statusBadge}
                      style={{ backgroundColor: '#ef4444', color: 'white' }}
                    >
                      -{Number(product.discountRate || product.items[0]?.discountRate)}%
                    </span>
                  ) : (
                    <span
                      className={styles.statusBadge}
                      style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
                    >
                      Không
                    </span>
                  )}
                </td>
                  <td>
                    <div className={styles.tableActions}>
                      <button
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        onClick={() => handleOpenEditModal(product)}
                        title="Chỉnh sửa"
                      >✏️</button>
                      <button
                        className={`${styles.actionBtn} ${styles.promoBtn}`}
                        onClick={() => handleOpenPromoModal(product)} 
                        title="Quản lý giảm giá"
                        style={{ backgroundColor: '#8b5cf6', color: 'white', border: 'none' }}
                      >
                        🏷️
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDeleteProduct(product.productId, product.productName)}
                        title="Xóa"
                      >🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {}
      {!loading && pageCount > 1 && (
        <ReactPaginate
          previousLabel={'<'}
          nextLabel={'>'}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          forcePage={currentPage}
          containerClassName={styles.paginationContainer}
          pageClassName={styles.pageItem}
          pageLinkClassName={styles.pageLink}
          previousClassName={styles.pageItem}
          previousLinkClassName={styles.pageLink}
          nextClassName={styles.pageItem}
          nextLinkClassName={styles.pageLink}
          breakClassName={styles.pageItem}
          breakLinkClassName={styles.pageLink}
          activeClassName={styles.active}
          disabledClassName={styles.disabled}
          renderOnZeroPageCount={null}
        />
      )}

      {}
      {showModal && (<div className={styles.modalOverlay} onClick={handleCloseModal}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleFormSubmit}> {}
            <div className={styles.modalHeader}>
              {}
              <h3>{modalMode === 'ADD' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={handleCloseModal}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalContent}>
              {}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Tên sản phẩm <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>

              {}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Danh mục <span className={styles.required}>*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className={styles.formSelect}
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories
                    .filter(cat => cat.categoryId !== 'all')
                    .map(category => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </option>
                    ))
                  }
                </select>
              </div>

              {}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mô tả sản phẩm</label>
                <textarea
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  placeholder="Nhập mô tả chi tiết về sản phẩm"
                  rows="4"
                />
              </div>

              {}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Hình ảnh chính <span className={styles.required}>*</span>
                </label>
                <div className={styles.imageUpload}>
                  <input
                    type="file"
                    id="productImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                    required={modalMode === 'ADD'}
                  />
                  <label htmlFor="productImage" className={styles.fileLabel}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                    ) : (
                      <div className={styles.uploadPlaceholder}>
                        <span className={styles.uploadIcon}>📷</span>
                        <span>Chọn hình ảnh</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {}
              <div className={styles.formGroup}>
                <div className={styles.sectionHeader}>
                  <label className={styles.formLabel}>
                    Biến thể sản phẩm <span className={styles.required}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className={styles.addItemBtn}
                  >
                    ➕ Thêm biến thể
                  </button>
                </div>

                {formData.items.map((item, index) => (
                  <div key={index} className={styles.itemGroup}>
                    <div className={styles.itemHeader}>
                      <span className={styles.itemLabel}>Biến thể #{index + 1}</span>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className={styles.removeItemBtn}
                        >
                          🗑️ Xóa
                        </button>
                      )}
                    </div>

                    <div className={styles.itemFields}>
                      {}
                      <div className={styles.formField}>
                        <label>SKU <span className={styles.required}>*</span></label>
                        <input
                          type="text"
                          value={item.sku}
                          onChange={(e) => handleItemChange(index, 'sku', e.target.value)}
                          placeholder="TSHIRT-WHITE-M"
                          className={styles.formInput}
                          required
                        />
                      </div>

                      {}
                      <div className={styles.formField}>
                        <label>Giá (₫) <span className={styles.required}>*</span></label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          placeholder="299000"
                          className={styles.formInput}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      {}
                      <div className={styles.formField}>
                        <label>Tồn kho <span className={styles.required}>*</span></label>
                        <input
                          type="number"
                          value={item.qtyInStock}
                          onChange={(e) => handleItemChange(index, 'qtyInStock', e.target.value)}
                          placeholder="100"
                          className={styles.formInput}
                          min="0"
                          required
                        />
                      </div>

                      {}
                      <div className={styles.formField}>
                        <label>Hình ảnh (tùy chọn)</label>
                        <input
                          type="file"
                          id={`itemImage-${index}`}
                          accept="image/*"
                          onChange={(e) => handleItemImageChange(index, e)}
                          className={styles.fileInput}
                        />
                        <label htmlFor={`itemImage-${index}`} className={styles.fileLabel} style={{ width: '100px', height: '100px' }}>
                          {itemImagePreviews[index] ? (
                            <img src={itemImagePreviews[index]} alt="Preview" className={styles.imagePreview} />
                          ) : (
                            <div className={styles.uploadPlaceholder}>
                              <span className={styles.uploadIcon} style={{ fontSize: '1.5rem' }}>📷</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {}
                    {loadingVariations ? (
                      <p className={styles.loadingText}>Đang tải biến thể...</p>
                    ) : (
                      <div className={styles.configurationsWrapper}>
                        <label className={styles.configLabel}>Cấu hình biến thể:</label>
                        <div className={styles.configurationsGrid}>
                          {variations.map(variation => {
                            
                            const currentValue = item.configurations.find(
                              c => c.variationId === variation.variationId
                            );

                            return (
                              <div key={variation.variationId} className={styles.formField}>
                                <label>{variation.variationName} <span className={styles.required}>*</span></label>
                                <select
                                  value={currentValue?.variationOptionId || ''}
                                  onChange={(e) => {
                                    const selectedOptionId = parseInt(e.target.value, 10);
                                    
                                    const selectedOption = variation.options.find(
                                      opt => opt.variationOptionId === selectedOptionId
                                    );
                                    if (selectedOption) {
                                      
                                      handleConfigurationChange(
                                        index,
                                        variation.variationId,
                                        selectedOption.variationOptionId,
                                        variation.variationName,
                                        selectedOption.value
                                      );
                                    }
                                  }}
                                  className={styles.formSelect}
                                  required
                                >
                                  <option value="">Chọn {variation.variationName}</option>
                                  {variation.options.map(option => (
                                    <option key={option.variationOptionId} value={option.variationOptionId}>
                                      {option.value}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleCloseModal}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : (modalMode === 'ADD' ? '✓ Thêm sản phẩm' : '✓ Cập nhật')}
              </button>
            </div>
          </form>
        </div>
      </div>
      )}
      {}
      {}
      {}
      
      {showPromotionModal && (
        <div className={styles.modalOverlay} onClick={handleClosePromoModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handlePromoSubmit}>
              <div className={styles.modalHeader}>
                {}
                <h3>🏷️ {promoFormData.promotionId ? 'Cập nhật KM' : 'Tạo KM mới'} cho: {currentProductForPromo?.productName}</h3>
                <button type="button" className={styles.closeBtn} onClick={handleClosePromoModal}>✕</button>
              </div>

              <div className={styles.modalContent}>
                {loadingPromo ? <p className={styles.loadingText}>Đang tải dữ liệu...</p> : (
                  <>
                    {}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Tên chương trình <span className={styles.required}>*</span></label>
                      <input 
                        type="text" 
                        name="name" 
                        className={styles.formInput} 
                        required 
                        value={promoFormData.name} 
                        onChange={handlePromoInputChange} 
                        placeholder="Ví dụ: Sale xả kho, Black Friday..."
                      />
                    </div>

                    {}
                    <div className={styles.formGroup}>
                       <label className={styles.formLabel}>Mức giảm (%) <span className={styles.required}>*</span></label>
                       <input 
                         type="number" 
                         name="discountRate" 
                         className={styles.formInput} 
                         required 
                         min="1" 
                         max="100" 
                         step="0.1"
                         value={promoFormData.discountRate} 
                         onChange={handlePromoInputChange}
                         placeholder="Nhập số % (VD: 20)"
                       />
                    </div>

                    {}
                    <div className={styles.formGroup} style={{display:'flex', gap:'15px'}}>
                      <div style={{flex:1}}>
                        <label className={styles.formLabel}>Từ ngày <span className={styles.required}>*</span></label>
                        <input 
                          type="date" 
                          name="startDate" 
                          className={styles.formInput} 
                          required 
                          value={promoFormData.startDate} 
                          onChange={handlePromoInputChange}
                        />
                      </div>
                      <div style={{flex:1}}>
                        <label className={styles.formLabel}>Đến ngày <span className={styles.required}>*</span></label>
                        <input 
                          type="date" 
                          name="endDate" 
                          className={styles.formInput} 
                          required 
                          value={promoFormData.endDate} 
                          onChange={handlePromoInputChange}
                        />
                      </div>
                    </div>
                    
                    {}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Mô tả chi tiết</label>
                      <textarea 
                        name="description" 
                        className={styles.formTextarea} 
                        rows="3"
                        value={promoFormData.description} 
                        onChange={handlePromoInputChange}
                        placeholder="Mô tả thêm về chương trình khuyến mãi này..."
                      />
                    </div>
                  </>
                )}
              </div>

              {}
              <div className={styles.modalActions}>
                {}
                {promoFormData.promotionId && (
                   <button 
                     type="button" 
                     className={styles.deleteBtn} 
                     onClick={handleDeletePromo} 
                     disabled={loadingPromo} 
                     style={{marginRight:'auto'}} 
                   >
                     🗑️ Xóa KM
                   </button>
                )}

                <button 
                  type="button" 
                  className={styles.cancelBtn} 
                  onClick={handleClosePromoModal}
                >
                  Hủy
                </button>
                
                <button 
                  type="submit" 
                  className={styles.submitBtn} 
                  disabled={loadingPromo}
                >
                  {loadingPromo ? 'Đang lưu...' : (promoFormData.promotionId ? '✓ Cập nhật' : '✓ Tạo mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
