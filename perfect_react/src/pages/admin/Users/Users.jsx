
import React, { useEffect, useMemo, useState } from 'react';
import styles from './Users.module.css';
import {
  adminFetchUsers,
  adminSearchUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  adminChangeRole, 
} from '../../../services/userService.js'; 



const roleOptions = [
  { value: 'customer', label: 'Khách hàng' },
  { value: 'admin', label: 'Quản trị viên' },
];

const toUiRole = (serverRole) => {
  const r = String(serverRole || '').toUpperCase();
  if (r.includes('ADMIN')) return 'admin';
  if (r.includes('MOD'))   return 'moderator';
  return 'customer'; 
};
const toServerRole = (uiRole) => {
  const r = String(uiRole || '').toLowerCase();
  if (r === 'admin') return 'ADMIN';
  if (r === 'moderator') return 'MODERATOR';
  return 'USER';
};

const roleColor = (role) =>
  ({ customer: '#3b82f6', admin: '#ef4444', moderator: '#f59e0b' }[role] || '#6b7280');


const normalizeUser = (u) => ({
  id: u.id,
  full_name: u.full_name || '',
  user_avatar: u.user_avatar || '',
  email_address: u.email_address || '',
  phone_number: u.phone_number || '',
  role: toUiRole(u.role),
  __raw: u,
});

const Users = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRole, setSelectedRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email_address: '',
    phone_number: '',
    role: 'customer',
    password: '',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    full_name: '',
    email_address: '',
    phone_number: '',
    user_avatar: '',
    role: 'customer',
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminFetchUsers();
      setList((data || []).map(normalizeUser));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredUsers = useMemo(() => {
    const base = list.filter((u) => selectedRole === 'all' || u.role === selectedRole);
    if (!searchTerm.trim()) return base;
    const kw = searchTerm.toLowerCase();
    return base.filter(
      (u) =>
        String(u.id ?? '').toLowerCase().includes(kw) ||
        (u.full_name || '').toLowerCase().includes(kw) ||
        (u.email_address || '').toLowerCase().includes(kw) ||
        (u.phone_number || '').toLowerCase().includes(kw)
    );
  }, [list, selectedRole, searchTerm]);

  const onSearchSubmit = async (e) => {
    e.preventDefault();
    const data = await adminSearchUsers(searchTerm.trim());
    setList((data || []).map(normalizeUser));
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    await adminDeleteUser(userId);
    setList((prev) => prev.filter((x) => x.id !== userId));
  };

  
  const handleChangeRole = async (userId, newRoleUi) => {
    const current = list.find((u) => u.id === userId);
    if (!current) return;
    if (current.role === newRoleUi) return;

    if (newRoleUi === 'admin' && !window.confirm('Bạn sắp gán quyền Quản trị viên. Tiếp tục?')) return;

    const admin_password = window.prompt('Nhập mật khẩu của bạn để xác nhận:');
    if (!admin_password) return;

    try {
      const serverRole = toServerRole(newRoleUi);
      const res = await adminChangeRole(userId, serverRole, admin_password);
      const updated = normalizeUser(res);
      setList((prev) => prev.map((x) => (x.id === userId ? updated : x)));
    } catch (e) {
      alert(e?.message || 'Đổi vai trò thất bại');
      
      setList((prev) => prev.map((x) => (x.id === userId ? { ...x, role: current.role } : x)));
    }
  };

  const openEdit = (user) => {
    setEditForm({
      id: user.id,
      full_name: user.full_name || '',
      email_address: user.email_address || '',
      phone_number: user.phone_number || '',
      user_avatar: user.user_avatar || '',
      role: user.role || 'customer',
    });
    setShowEditModal(true);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const payload = {
      full_name: editForm.full_name,
      email_address: editForm.email_address,  
      phone_number: editForm.phone_number,
      user_avatar: editForm.user_avatar,
      role: toServerRole(editForm.role),
    };
    const res = await adminUpdateUser(editForm.id, payload);
    const updated = normalizeUser(res);
    setList((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    setShowEditModal(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        full_name: form.full_name,
        email_address: form.email_address,
        phone_number: form.phone_number || undefined,
        password: form.password,
        role: toServerRole(form.role),
      };
      const res = await adminCreateUser(payload);
      const created = normalizeUser(res);
      setList((prev) => [created, ...prev]);
      setShowAddModal(false);
      setForm({ full_name: '', email_address: '', phone_number: '', role: 'customer', password: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.users}>
      {}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý người dùng</h1>
      </div>

      {}
      <div className={styles.filters}>
        <form className={styles.searchBox} onSubmit={onSearchSubmit}>
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchIcon} title="Tìm">🔍</button>
        </form>

        <div className={styles.roleFilter}>
          <label className={styles.filterLabel}>Vai trò:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className={styles.roleSelect}
          >
            <option value="all">Tất cả vai trò</option>
            {roleOptions.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.actions}>
          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>➕ Thêm người dùng</button>
        </div>
      </div>

      {}
      {loading ? (
        <div style={{ padding: 16 }}>Đang tải...</div>
      ) : (
        <div className={styles.usersTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableCell}>Người dùng</div>
            <div className={styles.tableCell}>Email</div>
            <div className={styles.tableCell}>Số điện thoại</div>
            <div className={styles.tableCell}>Vai trò</div>
          </div>

          {filteredUsers.map((u) => (
            <div key={u.id} className={styles.tableRow}>
              {}
              <div className={styles.tableCell}>
                <div className={styles.userInfo}>
                  <img
                    src={u.user_avatar || 'https://via.placeholder.com/50'}
                    alt={u.full_name || 'Avatar'}
                    className={styles.userAvatar}
                  />
                  <div className={styles.userDetails}>
                    <div className={styles.userName}>{u.full_name || '(Chưa có tên)'}</div>
                    <div className={styles.userId}>ID: {u.id}</div>
                  </div>
                </div>
              </div>

              {}
              <div className={styles.tableCell}>{u.email_address}</div>

              {}
              <div className={styles.tableCell}>{u.phone_number || '-'}</div>

              {}
              <div className={styles.tableCell}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <select
                    value={u.role}
                    onChange={(e) => handleChangeRole(u.id, e.target.value)}
                    className={styles.roleSelect}
                    style={{ backgroundColor: roleColor(u.role), color: 'white', border: 'none' }}
                  >
                    {roleOptions.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>

                  <button className={styles.editBtn} title="Chỉnh sửa" onClick={() => openEdit(u)}>
                    ✏️
                  </button>
                  <button className={styles.deleteBtn} title="Xóa" onClick={() => handleDeleteUser(u.id)}>
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className={styles.tableRow}>
              <div className={styles.tableCell} style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.7 }}>
                Không có người dùng nào phù hợp.
              </div>
            </div>
          )}
        </div>
      )}

      {}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Thêm người dùng mới</h3>
              <button className={styles.closeBtn} onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className={styles.modalContent}>
              <form className={styles.addUserForm} onSubmit={handleAdd}>
                <div className={styles.formGroup}>
                  <label>Họ và tên</label>
                  <input type="text" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} placeholder="Nhập họ và tên" />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input type="email" value={form.email_address} onChange={(e) => setForm((f) => ({ ...f, email_address: e.target.value }))} required placeholder="Nhập email" />
                </div>
                <div className={styles.formGroup}>
                  <label>Số điện thoại</label>
                  <input type="tel" value={form.phone_number} onChange={(e) => setForm((f) => ({ ...f, phone_number: e.target.value }))} placeholder="Nhập số điện thoại" />
                </div>
                <div className={styles.formGroup}>
                  <label>Vai trò</label>
                  <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
                    {roleOptions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Mật khẩu</label>
                  <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required placeholder="Nhập mật khẩu" />
                </div>
                <div className={styles.formActions}>
                  <button type="button" onClick={() => setShowAddModal(false)}>Hủy</button>
                  <button type="submit" disabled={submitting}>{submitting ? 'Đang thêm...' : 'Thêm người dùng'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {}
      {showEditModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Sửa thông tin người dùng</h3>
              <button className={styles.closeBtn} onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div className={styles.modalContent}>
              <form className={styles.addUserForm} onSubmit={submitEdit}>
                <div className={styles.formGroup}>
                  <label>Họ và tên</label>
                  <input type="text" value={editForm.full_name} onChange={(e) => setEditForm((f) => ({ ...f, full_name: e.target.value }))} placeholder="Nhập họ và tên" />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input type="email" value={editForm.email_address} onChange={(e) => setEditForm((f) => ({ ...f, email_address: e.target.value }))} required placeholder="Nhập email" />
                </div>
                <div className={styles.formGroup}>
                  <label>Số điện thoại</label>
                  <input type="tel" value={editForm.phone_number} onChange={(e) => setEditForm((f) => ({ ...f, phone_number: e.target.value }))} placeholder="Nhập số điện thoại" />
                </div>
                <div className={styles.formGroup}>
                  <label>Avatar URL</label>
                  <input type="url" value={editForm.user_avatar} onChange={(e) => setEditForm((f) => ({ ...f, user_avatar: e.target.value }))} placeholder="https://..." />
                </div>
                <div className={styles.formGroup}>
                  <label>Vai trò</label>
                  <select value={editForm.role} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}>
                    <option value="customer">Khách hàng</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
                <div className={styles.formActions}>
                  <button type="button" onClick={() => setShowEditModal(false)}>Hủy</button>
                  <button type="submit">Lưu thay đổi</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Users;
