import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Businesses from './pages/Businesses';
import BusinessDetail from './pages/BusinessDetail';
import Activities from './pages/Activities';
import FarmerDashboard from './pages/FarmerDashboard';
import BusinessDashboard from './pages/BusinessDashboard';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes with layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="businesses" element={<Businesses />} />
            <Route path="businesses/:id" element={<BusinessDetail />} />
            <Route path="activities" element={<Activities />} />
            
            {/* Farmer-specific routes */}
            <Route 
              path="farmer-dashboard" 
              element={
                <ProtectedRoute requiredUserType="farmer">
                  <FarmerDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Business owner-specific routes */}
            <Route 
              path="business-dashboard" 
              element={
                <ProtectedRoute requiredUserType="business_owner">
                  <BusinessDashboard />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
