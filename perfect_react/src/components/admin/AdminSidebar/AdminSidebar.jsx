import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './AdminSidebar.module.css';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: '📈',
      exact: true
    },
    {
      path: '/admin/orders',
      label: 'Đơn hàng',
      icon: '🛒'
    },
    {
      path: '/admin/products',
      label: 'Sản phẩm',
      icon: '🛍️'
    },
    {
      path: '/admin/category',
      label: 'Danh mục',
      icon: '📁'
    },
    {
      path: '/admin/users',
      label: 'Người dùng',
      icon: '👥'
    },
    {
      path: '/admin/contacts',
      label: 'Liên hệ',
      icon: '✉️'
    },
    {
      path: '/admin/chat',
      label: 'Chat',
      icon: '💬'
    }

  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        {}
        <nav className={styles.nav}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.path} className={styles.menuItem}>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `${styles.menuLink} ${isActive ? styles.active : ''}`
                  }
                >
                  <span className={styles.menuIcon}>{item.icon}</span>
                  <span className={styles.menuLabel}>{item.label}</span>
                  {item.badge && (
                    <span className={styles.menuBadge}>{item.badge}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>



        {}
        {}
      </div>
    </aside>
  );
};

export default AdminSidebar;

