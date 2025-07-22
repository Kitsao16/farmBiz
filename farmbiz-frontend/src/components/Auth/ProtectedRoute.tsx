import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { checkAuthStatus } from '../../redux/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'farmer' | 'business_owner';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType 
}) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoggedIn, user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check auth status if user is logged in but we don't have user details
    if (isLoggedIn && !user) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isLoggedIn, user]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check user type requirement
  if (requiredUserType && user?.user_type !== requiredUserType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
