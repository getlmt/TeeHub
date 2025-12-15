import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: (typeof window !== 'undefined' && localStorage.getItem('theme')) || 'light',
  sidebarOpen: false,
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
  toast: {
    isVisible: false,
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
    duration: 3000,
  },
  loading: {
    global: false,
    page: false,
    component: false,
  },
  notifications: [],
  searchQuery: '',
  filters: {
    isOpen: false,
    applied: false,
  },
  layout: {
    gridView: true,
    itemsPerPage: 12,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
        document.documentElement.setAttribute('data-theme', action.payload);
      }
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
    
    showToast: (state, action) => {
      state.toast = {
        isVisible: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
        duration: action.payload.duration || 3000,
      };
    },
    hideToast: (state) => {
      state.toast.isVisible = false;
    },
    
    setLoading: (state, action) => {
      const { type, value } = action.payload;
      state.loading[type] = value;
    },
    
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload,
      };
      state.notifications.unshift(notification);
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    markNotificationAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      state.notifications = state.notifications.filter(n => n.id !== notificationId);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },
    
    setFiltersOpen: (state, action) => {
      state.filters.isOpen = action.payload;
    },
    setFiltersApplied: (state, action) => {
      state.filters.applied = action.payload;
    },
    
    setGridView: (state, action) => {
      state.layout.gridView = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.layout.itemsPerPage = action.payload;
    },
    
    // Reset UI state
    resetUI: (state) => {
      state.sidebarOpen = false;
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
      state.toast = {
        isVisible: false,
        message: '',
        type: 'info',
        duration: 3000,
      };
      state.loading = {
        global: false,
        page: false,
        component: false,
      };
      state.searchQuery = '';
      state.filters = {
        isOpen: false,
        applied: false,
      };
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  openModal,
  closeModal,
  showToast,
  hideToast,
  setLoading,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearAllNotifications,
  setSearchQuery,
  clearSearchQuery,
  setFiltersOpen,
  setFiltersApplied,
  setGridView,
  setItemsPerPage,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
