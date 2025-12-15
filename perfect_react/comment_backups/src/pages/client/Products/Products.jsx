import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import styles from './Products.module.css';
import { productService } from '../../../services/productService';
import { categoryService } from '../../../services/categoryService'; // <-- Import service category

const ITEMS_PER_PAGE = 9; // Số sản phẩm mỗi trang

// Dữ liệu tĩnh cho sort options (Backend cần hỗ trợ các giá trị 'id' này)
const SORT_OPTIONS = [
  { id: 'newest', label: 'Sản phẩm mới nhất', icon: '🆕' }, // Giả sử backend sắp xếp theo ID giảm dần
  // { id: 'price-desc', label: 'Giá cao đến thấp', icon: '💰' }, // Backend cần sắp xếp theo giá giảm dần
  // { id: 'price-asc', label: 'Giá thấp đến cao', icon: '💵' }, // Backend cần sắp xếp theo giá tăng dần
  { id: 'hot', label: 'Bán chạy nhất', icon: '🔥' }, // Backend cần logic riêng
  //   { id: 'popular', label: 'Nổi bật nhất', icon: '⭐' } // Backend cần logic riêng
];
const formatCurrency = (amount) => {
  if (amount == null) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};
function Product() {
  // State cho sản phẩm và phân trang
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // State cho danh mục
  const [categories, setCategories] = useState([]); // Lưu danh mục từ API
  const [loadingCategories, setLoadingCategories] = useState(true); // Loading riêng cho danh mục
  const [selectedCategory, setSelectedCategory] = useState('all'); // ID của danh mục đang chọn ('all' là mặc định)
  const [totalProductCount, setTotalProductCount] = useState(0); // State mới để lưu tổng số sản phẩm

  // State cho sắp xếp
  const [selectedSort, setSelectedSort] = useState('newest'); // Giá trị sort mặc định
  const [isSortOpen, setIsSortOpen] = useState(false); // Trạng thái đóng/mở dropdown sort
  const [sortOrder, setSortOrder] = useState('productId,desc');
  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // --- Effect 1: Tải danh sách danh mục ---
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        // Lấy danh sách category KÈM SỐ LƯỢNG từ API mới
        const categoryData = await categoryService.getAllCategories(); // API trả về List<CategoryWithCountResponse>

        // Tính tổng số sản phẩm từ kết quả trả về (nếu API không trả về tổng riêng)
        // Hoặc tốt hơn là gọi API đếm tổng sản phẩm riêng biệt
        // Tạm thời tính tổng từ các count lẻ:
        const totalCount = categoryData.reduce((sum, cat) => sum + cat.productCount, 0);
        setTotalProductCount(totalCount); // Cập nhật state tổng số lượng

        // Tạo mục "Tất cả" với tổng số lượng vừa tính
        const allCategory = {
          categoryId: 'all',
          categoryName: 'Tất cả sản phẩm',
          productCount: totalCount // Sử dụng tổng số lượng
        };

        // Gộp mục "Tất cả" với danh sách từ API
        setCategories([allCategory, ...categoryData]);

      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
        setError("Không thể tải danh mục sản phẩm.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []); // Mảng dependency rỗng `[]` => Chỉ chạy 1 lần khi component được gắn vào DOM

  // --- Effect: Debounce Search Term ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(0); // Reset về trang đầu khi search thay đổi
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // --- Effect 2: Tải danh sách sản phẩm ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true); // Bắt đầu loading sản phẩm
        setError(null); // Reset lỗi cũ (nếu có)
        // console.log('Calling getAllProducts with:', currentPage, ITEMS_PER_PAGE, selectedCategory, selectedSort); // <-- Log tham số gọi
        // Gọi service để lấy sản phẩm, truyền vào các state hiện tại
        const data = await productService.getAllProducts(
          currentPage,        // Trang hiện tại (từ state)
          ITEMS_PER_PAGE,     // Số lượng mỗi trang (hằng số)
          selectedCategory,   // ID danh mục đang chọn (từ state)
          debouncedSearchTerm, // Sử dụng debouncedSearchTerm thay vì null
          selectedSort        // Kiểu sắp xếp đang chọn (từ state)
        );
        // // Log dữ liệu nhận về
        // console.log('Received product data:', data);
        // Cập nhật state sản phẩm và thông tin phân trang từ kết quả API
        setProducts(data.content); // `data.content` là mảng sản phẩm
        setPageCount(data.totalPages); // `data.totalPages` là tổng số trang

      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err); // Log lỗi chi tiết
        setError(err.message || "Không thể tải danh sách sản phẩm."); // Hiển thị lỗi
      } finally {
        setLoadingProducts(false); // Kết thúc loading sản phẩm
      }
    };

    // Chỉ gọi API tải sản phẩm KHI danh mục đã được tải xong
    // (Điều này tránh gọi API với `selectedCategory` chưa đúng lúc đầu)
    if (!loadingCategories) {
      fetchProducts();
    }
    // Effect này sẽ chạy lại mỗi khi một trong các giá trị sau thay đổi:
    // currentPage, selectedCategory, selectedSort, debouncedSearchTerm, loadingCategories
  }, [currentPage, selectedCategory, selectedSort, debouncedSearchTerm, loadingCategories]);

  // --- Hàm xử lý sự kiện click vào trang (Pagination) ---
  const handlePageClick = (event) => {
    // `event.selected` là chỉ số của trang được click (bắt đầu từ 0)
    setCurrentPage(event.selected);
    // Cuộn lên đầu trang một cách mượt mà
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Hàm xử lý sự kiện click vào danh mục (Sidebar) ---
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId); // Cập nhật state danh mục đang chọn
    setCurrentPage(0); // Luôn quay về trang đầu tiên khi đổi danh mục
  };

  // --- Hàm xử lý sự kiện thay đổi sắp xếp (Dropdown) ---
  const handleSortChange = (sortId) => {
    setSelectedSort(sortId); // Cập nhật state sắp xếp đang chọn
    setCurrentPage(0); // Luôn quay về trang đầu tiên khi đổi sắp xếp
    setIsSortOpen(false); // Đóng dropdown sau khi chọn
  };

  // Tìm đối tượng sort option hiện tại để hiển thị label và icon
  const currentSortOption = SORT_OPTIONS.find(opt => opt.id === selectedSort) || SORT_OPTIONS[0];

  // --- Render ---

  // Hiển thị lỗi nếu có
  if (error && !loadingProducts && !loadingCategories) { // Chỉ hiển thị lỗi nếu không đang loading
    return <p>Lỗi: {error}</p>;
  }

  return (
    <div className={styles.products}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>

          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            {/* DANH MỤC SẢN PHẨM */}
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
              {/* Hiển thị "Loading..." nếu danh mục chưa tải xong */}
              {loadingCategories ? <p>Đang tải danh mục...</p> : (
                <ul className={styles.categoryList}>
                  {categories.map((category) => (
                    <li
                      key={category.categoryId}
                      className={`${styles.categoryItem} ${selectedCategory === category.categoryId ? styles.categoryActive : ''}`}
                      onClick={() => handleCategoryClick(category.categoryId)}
                    >
                      <span className={styles.categoryName}>{category.categoryName}</span>
                      {/* === HIỂN THỊ SỐ LƯỢNG === */}
                      {/* Kiểm tra xem productCount có tồn tại và > 0 không */}
                      {category.productCount != null && category.productCount >= 0 && (
                        <span className={styles.categoryCount}>{category.productCount}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* SẮP XẾP THEO (Custom Dropdown) */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Sắp xếp theo</h3>
              <div className={styles.customDropdown}>
                <button
                  className={styles.dropdownToggle}
                  onClick={() => setIsSortOpen(!isSortOpen)} // Đóng/mở dropdown
                >
                  <span className={styles.dropdownLabel}>
                    <span className={styles.dropdownIcon}>{currentSortOption.icon}</span>
                    {currentSortOption.label}
                  </span>
                  <span className={styles.dropdownArrow}>▼</span>
                </button>

                {isSortOpen && ( // Chỉ hiển thị menu nếu isSortOpen là true
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownArrowUp}></div>
                    {SORT_OPTIONS.map((option) => (
                      <div
                        key={option.id}
                        className={`${styles.dropdownItem} ${selectedSort === option.id ? styles.dropdownItemActive : ''}`}
                        onClick={() => handleSortChange(option.id)} // Gọi handler khi chọn
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

          {/* PRODUCTS CONTAINER */}
          <div className={styles.productsContainer}>
            <div className={styles.headerSection}>
              <div className={styles.titleSection}>
               
              </div>
             
            </div>

            {/* Hiển thị Loading hoặc danh sách sản phẩm */}
            {loadingProducts ? (
              <p className={styles.loadingText}>Đang tải sản phẩm...</p>
            ) : (
              <>
                {/* Hiển thị nếu không tìm thấy sản phẩm */}
                {products.length === 0 && !loadingProducts && (
                  <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                )}
                {/* Grid chứa các card sản phẩm */}
                <div className={styles.grid}>
                  {products.map((product) => {
                    // Lấy item đầu tiên để hiển thị (giống logic cũ của bạn)
                    const displayItem = product.items?.[0];
                    // Kiểm tra xem có sale không
                    const hasSale = displayItem && displayItem.discountRate > 0;

                    return (
                      <div key={product.productId} className={styles.card}>

                        {/* 1. THÊM TAG SALE (NẾU CÓ) */}
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
                          {/* <p>Category: {product.category?.categoryName}</p> */}


                          {/* 2. SỬA LẠI KHỐI GIÁ */}
                          {/* Xóa: <p className={styles.price}>...</p> */}
                          <div className={styles.priceContainer}>
                            {displayItem ? (
                              hasSale ? (
                                // CÓ SALE: Hiển thị 2 giá
                                <>
                                  <span className={styles.originalPrice}>
                                    {formatCurrency(displayItem.originalPrice)}
                                  </span>
                                  <span className={styles.newPrice}>
                                    {formatCurrency(displayItem.price)}
                                  </span>
                                </>
                              ) : (
                                // KHÔNG SALE: Hiển thị 1 giá
                                <span className={styles.normalPrice}>
                                  {formatCurrency(displayItem.originalPrice)}
                                </span>
                              )
                            ) : (
                              // Không có item (không có giá)
                              <span className={styles.normalPrice}>Liên hệ</span>
                            )}

                            {/* === ĐÃ SỬA === */}
                            {/* Luôn hiển thị 'Đã bán' nếu > 0 */}
                            {product.totalSold != null && product.totalSold > 0 && (
                              <div className={styles.soldCount}>
                                Đã bán {product.totalSold}
                              </div>
                            )}
                            {/* === HẾT PHẦN SỬA === */}
                          </div>
                          {/* HẾT PHẦN SỬA GIÁ */}

                          <div className={styles.actions}>
                            <a href={`/products/${product.productId}`} className={styles.linkBtn}>
                              View Details
                            </a>
                            {/* <a href="#" className={`${styles.linkBtn} ${styles.secondaryBtn}`}>
                              Add to Cart
                            </a> */}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* PAGINATION */}
                {/* Chỉ hiển thị pagination nếu có nhiều hơn 1 trang VÀ không đang loading */}
                {pageCount > 1 && !loadingProducts && (
                  <ReactPaginate
                    previousLabel={'< Previous'}
                    nextLabel={'Next >'}
                    breakLabel={'...'}
                    pageCount={pageCount} // Tổng số trang từ API
                    marginPagesDisplayed={2} // Số trang hiển thị ở đầu/cuối
                    pageRangeDisplayed={3} // Số trang hiển thị ở giữa
                    onPageChange={handlePageClick} // Hàm gọi khi click trang
                    forcePage={currentPage} // Đồng bộ trang hiện tại với state

                    // --- SỬ DỤNG LẠI CLASS TỪ CODE CŨ CỦA BẠN ---
                    containerClassName={styles.paginationContainer}
                    pageClassName={styles.paginationPage}       // Class cho <li> chứa số trang
                    pageLinkClassName={styles.paginationLink}     // Class cho <a> chứa số trang
                    previousClassName={styles.paginationPrevious}   // Class cho <li> nút Previous
                    previousLinkClassName={styles.paginationLink}   // Class cho <a> nút Previous
                    nextClassName={styles.paginationNext}         // Class cho <li> nút Next
                    nextLinkClassName={styles.paginationLink}     // Class cho <a> nút Next
                    breakClassName={styles.paginationBreak}       // Class cho <li> dấu "..."
                    breakLinkClassName={styles.paginationLink}    // Class cho <a> dấu "..."
                    activeClassName={styles.paginationActive}     // Class cho <li> trang hiện tại
                    disabledClassName={styles.paginationDisabled}   // Class cho <li> nút Previous/Next bị vô hiệu hóa
                    // --- HẾT PHẦN CLASS ---
                    renderOnZeroPageCount={null} // Không render gì nếu pageCount = 0
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