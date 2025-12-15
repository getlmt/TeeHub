import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import styles from './Products.module.css';
import { productService } from '../../../services/productService';
import { categoryService } from '../../../services/categoryService'; 

const ITEMS_PER_PAGE = 9; 


const SORT_OPTIONS = [
  { id: 'newest', label: 'Sản phẩm mới nhất', icon: '🆕' }, 
  
  
  { id: 'hot', label: 'Bán chạy nhất', icon: '🔥' }, 
  
];
const formatCurrency = (amount) => {
  if (amount == null) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};
function Product() {
  
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  
  const [categories, setCategories] = useState([]); 
  const [loadingCategories, setLoadingCategories] = useState(true); 
  const [selectedCategory, setSelectedCategory] = useState('all'); 
  const [totalProductCount, setTotalProductCount] = useState(0); 

  
  const [selectedSort, setSelectedSort] = useState('newest'); 
  const [isSortOpen, setIsSortOpen] = useState(false); 
  const [sortOrder, setSortOrder] = useState('productId,desc');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        
        const categoryData = await categoryService.getAllCategories(); 

        
        
        
        const totalCount = categoryData.reduce((sum, cat) => sum + cat.productCount, 0);
        setTotalProductCount(totalCount); 

        
        const allCategory = {
          categoryId: 'all',
          categoryName: 'Tất cả sản phẩm',
          productCount: totalCount 
        };

        
        setCategories([allCategory, ...categoryData]);

      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
        setError("Không thể tải danh mục sản phẩm.");
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

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true); 
        setError(null); 
        
        
        const data = await productService.getAllProducts(
          currentPage,        
          ITEMS_PER_PAGE,     
          selectedCategory,   
          debouncedSearchTerm, 
          selectedSort        
        );
        
        
        
        setProducts(data.content); 
        setPageCount(data.totalPages); 

      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err); 
        setError(err.message || "Không thể tải danh sách sản phẩm."); 
      } finally {
        setLoadingProducts(false); 
      }
    };

    
    
    if (!loadingCategories) {
      fetchProducts();
    }
    
    
  }, [currentPage, selectedCategory, selectedSort, debouncedSearchTerm, loadingCategories]);

  
  const handlePageClick = (event) => {
    
    setCurrentPage(event.selected);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId); 
    setCurrentPage(0); 
  };

  
  const handleSortChange = (sortId) => {
    setSelectedSort(sortId); 
    setCurrentPage(0); 
    setIsSortOpen(false); 
  };

  
  const currentSortOption = SORT_OPTIONS.find(opt => opt.id === selectedSort) || SORT_OPTIONS[0];

  

  
  if (error && !loadingProducts && !loadingCategories) { 
    return <p>Lỗi: {error}</p>;
  }

  return (
    <div className={styles.products}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>

          {}
          <aside className={styles.sidebar}>
            {}
             <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Tìm theo tên sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                <span className={styles.searchIcon}><img src="../public/Img/search.png" style={{ width: "20px", height: "20px" }} alt="" /></span>
              </div>
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Danh mục sản phẩm</h3>
              {}
              {loadingCategories ? <p>Đang tải danh mục...</p> : (
                <ul className={styles.categoryList}>
                  {categories.map((category) => (
                    <li
                      key={category.categoryId}
                      className={`${styles.categoryItem} ${selectedCategory === category.categoryId ? styles.categoryActive : ''}`}
                      onClick={() => handleCategoryClick(category.categoryId)}
                    >
                      <span className={styles.categoryName}>{category.categoryName}</span>
                      {}
                      {}
                      {category.productCount != null && category.productCount >= 0 && (
                        <span className={styles.categoryCount}>{category.productCount}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Sắp xếp theo</h3>
              <div className={styles.customDropdown}>
                <button
                  className={styles.dropdownToggle}
                  onClick={() => setIsSortOpen(!isSortOpen)} 
                >
                  <span className={styles.dropdownLabel}>
                    <span className={styles.dropdownIcon}>{currentSortOption.icon}</span>
                    {currentSortOption.label}
                  </span>
                  <span className={styles.dropdownArrow}>▼</span>
                </button>

                {isSortOpen && ( 
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownArrowUp}></div>
                    {SORT_OPTIONS.map((option) => (
                      <div
                        key={option.id}
                        className={`${styles.dropdownItem} ${selectedSort === option.id ? styles.dropdownItemActive : ''}`}
                        onClick={() => handleSortChange(option.id)} 
                      >
                        <span className={styles.dropdownIcon}>{option.icon}</span>
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {}
          <div className={styles.productsContainer}>
            <div className={styles.headerSection}>
              <div className={styles.titleSection}>
               
              </div>
             
            </div>

            {}
            {loadingProducts ? (
              <p className={styles.loadingText}>Đang tải sản phẩm...</p>
            ) : (
              <>
                {}
                {products.length === 0 && !loadingProducts && (
                  <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                )}
                {}
                <div className={styles.grid}>
                  {products.map((product) => {
                    
                    const displayItem = product.items?.[0];
                    
                    const hasSale = displayItem && displayItem.discountRate > 0;

                    return (
                      <div key={product.productId} className={styles.card}>

                        {}
                        {hasSale && (
                          <div className={styles.saleBadge}>
                            -{Math.round(displayItem.discountRate)}%
                          </div>
                        )}

                        <img
                          src={`/Product/${product.productMainImage}`}
                          alt={product.productName}
                          className={styles.thumb}
                        />
                        <div className={styles.cardBody}>
                          <h2 className={styles.name}>{product.productName}</h2>
                          {}


                          {}
                          {}
                          <div className={styles.priceContainer}>
                            {displayItem ? (
                              hasSale ? (
                                
                                <>
                                  <span className={styles.originalPrice}>
                                    {formatCurrency(displayItem.originalPrice)}
                                  </span>
                                  <span className={styles.newPrice}>
                                    {formatCurrency(displayItem.price)}
                                  </span>
                                </>
                              ) : (
                                
                                <span className={styles.normalPrice}>
                                  {formatCurrency(displayItem.originalPrice)}
                                </span>
                              )
                            ) : (
                              
                              <span className={styles.normalPrice}>Liên hệ</span>
                            )}

                            {}
                            {}
                            {product.totalSold != null && product.totalSold > 0 && (
                              <div className={styles.soldCount}>
                                Đã bán {product.totalSold}
                              </div>
                            )}
                            {}
                          </div>
                          {}

                          <div className={styles.actions}>
                            <a href={`/products/${product.productId}`} className={styles.linkBtn}>
                              View Details
                            </a>
                            {}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {}
                {}
                {pageCount > 1 && !loadingProducts && (
                  <ReactPaginate
                    previousLabel={'< Previous'}
                    nextLabel={'Next >'}
                    breakLabel={'...'}
                    pageCount={pageCount} 
                    marginPagesDisplayed={2} 
                    pageRangeDisplayed={3} 
                    onPageChange={handlePageClick} 
                    forcePage={currentPage} 

                    
                    containerClassName={styles.paginationContainer}
                    pageClassName={styles.paginationPage}       
                    pageLinkClassName={styles.paginationLink}     
                    previousClassName={styles.paginationPrevious}   
                    previousLinkClassName={styles.paginationLink}   
                    nextClassName={styles.paginationNext}         
                    nextLinkClassName={styles.paginationLink}     
                    breakClassName={styles.paginationBreak}       
                    breakLinkClassName={styles.paginationLink}    
                    activeClassName={styles.paginationActive}     
                    disabledClassName={styles.paginationDisabled}   
                    
                    renderOnZeroPageCount={null} 
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;