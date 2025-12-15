import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AppRoutes from './routes';
import './styles/globals.css';
import './styles/variables.css';
// Routes centralized in src/routes
// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#fee',
          border: '2px solid #f00',
          margin: '20px',
          borderRadius: '8px'
        }}>
          <h1 style={{ color: '#d00' }}>🚨 Có lỗi xảy ra!</h1>
          <h2>Chi tiết lỗi:</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary>Click để xem chi tiết</summary>
            <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
            <p><strong>Stack trace:</strong></p>
            <pre>{this.state.errorInfo.componentStack}</pre>
          </details>
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Thử lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Component để kiểm tra route và render layout phù hợp
function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {/* Render Header/Footer user nếu không phải trang login và không phải trang admin */}
      {!isLoginPage && !isAdminPage && (
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
      )}
      <main>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </main>
      {!isLoginPage && !isAdminPage && (
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router>
          <AppContent />
        </Router>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;