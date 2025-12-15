import React, { useState, useEffect, useCallback } from 'react';
import ReactPaginate from 'react-paginate';
import styles from './Category.module.css';
import { categoryService } from '../../../services/categoryService';

const ITEMS_PER_PAGE = 10;

function Category() {
  // State cho categories và phân trang
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // State cho modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // State cho form
  const [formData, setFormData] = useState({
    categoryName: ''
  });

  const [editingCategory, setEditingCategory] = useState(null);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(0);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await categoryService.getAllCategories(
        currentPage,
        ITEMS_PER_PAGE,
        debouncedSearchTerm
      );

      setCategories(data.content || data);
      setPageCount(data.totalPages || 1);

    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
      setError(err.message || "Không thể tải danh sách danh mục.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handlers
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingCategory(null);
    setFormData({
      categoryName: ''
    });
  };

  const handleAddCategorySubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      await categoryService.createCategory(formData);
      alert('Thêm danh mục thành công!');
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      alert(`Lỗi khi thêm danh mục: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      categoryName: category.categoryName
    });
    setShowEditModal(true);
  };

  const handleEditCategorySubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      await categoryService.updateCategory(editingCategory.categoryId, formData);
      alert('Cập nhật danh mục thành công!');
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      alert(`Lỗi khi cập nhật danh mục: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${categoryName}" (ID: ${categoryId})?`)) {
      try {
        setLoading(true);
        await categoryService.deleteCategory(categoryId);
        alert(`Đã xóa danh mục ${categoryId} thành công!`);
        fetchCategories();
      } catch (err) {
        alert(`Xóa danh mục thất bại: ${err.message}`);
        setError(err.message);
        setLoading(false);
      }
    }
  };

  // Filtered categories
  const filteredCategories = categories.filter(category =>
    category.categoryName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className={styles.categories}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý danh mục</h1>
        <p className={styles.pageSubtitle}>Thêm, chỉnh sửa và quản lý danh mục sản phẩm</p>
      </div>

      {/* Filters and actions */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Tìm theo tên danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.actions}>
          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
            ➕ Thêm danh mục
          </button>
        </div>
      </div>

      {/* Hiển thị lỗi */}
      {error && <p className={styles.errorText}>Lỗi: {error}</p>}

      {/* Categories table */}
      <div className={styles.tableContainer}>
        <table className={styles.categoryTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên danh mục</th>
              <th>Số lượng sản phẩm</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className={styles.loadingText}>Đang tải danh mục...</td></tr>
            ) : filteredCategories.length === 0 ? (
              <tr><td colSpan="4" className={styles.noDataText}>Không tìm thấy danh mục nào.</td></tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category.categoryId}>
                  <td className={styles.categoryId}>{category.categoryId}</td>
                  <td>
                    <div className={styles.categoryName}>{category.categoryName}</div>
                  </td>
                  <td>
                    <span className={styles.productCount}>
                      {category.productCount || 0} sản phẩm
                    </span>
                  </td>
                  <td>
                    <div className={styles.tableActions}>
                      <button
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        onClick={() => handleEditCategory(category)}
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDeleteCategory(category.categoryId, category.categoryName)}
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
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

      {/* Add Category Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleAddCategorySubmit}>
              <div className={styles.modalHeader}>
                <h3>Thêm danh mục mới</h3>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={handleCloseModal}
                >
                  ✕
                </button>
              </div>

              <div className={styles.modalContent}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Tên danh mục <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Nhập tên danh mục"
                    required
                  />
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
                  {loading ? 'Đang thêm...' : '✓ Thêm danh mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleEditCategorySubmit}>
              <div className={styles.modalHeader}>
                <h3>Chỉnh sửa danh mục</h3>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={handleCloseModal}
                >
                  ✕
                </button>
              </div>

              <div className={styles.modalContent}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Tên danh mục <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Nhập tên danh mục"
                    required
                  />
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
                  {loading ? 'Đang cập nhật...' : '✓ Cập nhật danh mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Category;