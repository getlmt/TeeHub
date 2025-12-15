
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(v => !v);

  return (
    <div className={styles.adminLayout}>
      <div className={`${styles.sidebarWrapper} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <AdminSidebar />
      </div>
      <div className={styles.mainContent}>
        <AdminHeader onToggleSidebar={toggleSidebar} />
        <main className={styles.pageContent}>
          <div className={styles.contentWrapper}>
            {}
            <Outlet />
          </div>
        </main>
      </div>
      {isSidebarOpen && <div className={styles.mobileOverlay} onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
}
