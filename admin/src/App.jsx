import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';

// Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProductsList from './pages/Products/ProductsList';
import ProductForm from './pages/Products/ProductForm';
import UsersList from './pages/Users/UsersList';
import UserForm from './pages/Users/UserForm';
import ServicesList from './pages/Services/ServicesList';
import ServiceForm from './pages/Services/ServiceForm';
import BookingsList from './pages/Bookings/BookingsList';
import OrdersList from './pages/Orders/OrdersList';

// Components

import Sidebar from './components/admin/Sidebar';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

// Admin Layout Component
const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Product Routes */}
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ProductsList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products/new"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ProductForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products/edit/:id"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ProductForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Service Routes */}
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ServicesList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/services/new"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ServiceForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/services/edit/:id"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ServiceForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Booking Routes */}
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <BookingsList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <UsersList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Order Routes */}
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <OrdersList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/users/new"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <UserForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/edit/:id"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <UserForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
