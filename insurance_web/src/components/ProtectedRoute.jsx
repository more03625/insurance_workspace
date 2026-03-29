import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../constants/enums';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const home = user.role === USER_ROLES.POLICYHOLDER ? '/portal' : '/admin';
    return <Navigate to={home} replace />;
  }

  return children;
}
