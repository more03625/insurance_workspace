import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PortalSidebar from './components/PortalSidebar';
import AdminSidebar from './components/AdminSidebar';

import Login from './pages/Login';
import Signup from './pages/Signup';
import PortalDashboard from './pages/portal/PortalDashboard';
import BrowsePolicies from './pages/portal/BrowsePolicies';
import PolicyPurchase from './pages/portal/PolicyPurchase';
import MyPolicies from './pages/portal/MyPolicies';
import MyClaims from './pages/portal/MyClaims';
import FNOLForm from './pages/FNOLForm';
import ClaimDetails from './pages/ClaimDetails';

import Dashboard from './pages/Dashboard';
import ClaimsList from './pages/ClaimsList';
import SurveyorDashboard from './pages/SurveyorDashboard';
import PolicyManagement from './pages/PolicyManagement';
import UserManagement from './pages/UserManagement';

import { USER_ROLES } from './constants/enums';

const PORTAL_ROLES = [USER_ROLES.POLICYHOLDER];
const ADMIN_ROLES = [USER_ROLES.EMPLOYEE, USER_ROLES.ADMIN];

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Policyholder portal */}
            <Route
              path="/portal"
              element={
                <ProtectedRoute allowedRoles={PORTAL_ROLES}>
                  <Layout sidebar={PortalSidebar} />
                </ProtectedRoute>
              }
            >
              <Route index element={<PortalDashboard />} />
              <Route path="browse" element={<BrowsePolicies />} />
              <Route path="purchase/:policyMasterId" element={<PolicyPurchase />} />
              <Route path="policies" element={<MyPolicies />} />
              <Route path="fnol" element={<FNOLForm />} />
              <Route path="claims" element={<MyClaims />} />
              <Route path="claims/:id" element={<ClaimDetails />} />
            </Route>

            {/* Employee / Admin portal */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ROLES}>
                  <Layout sidebar={AdminSidebar} />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="claims" element={<ClaimsList />} />
              <Route path="claims/:id" element={<ClaimDetails />} />
              <Route path="surveyor" element={<SurveyorDashboard />} />
              <Route path="policies" element={<PolicyManagement />} />
              <Route path="users" element={<UserManagement />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
