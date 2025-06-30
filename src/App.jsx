import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import AuthRoute from './components/AuthRoute';

import Product from './components/product/Product.jsx';
import ProductDetail from './components/product/ProductDetail.jsx';

import Category from './components/category/Category';
import CategoryDetail from './components/category/CategoryDetail.jsx';

import Account from './components/account/Account';
import AccountDetail from './components/account/AccountDetail';

import Order from './components/order/Order';
import OrderDetail from './components/order/OrderDetail.jsx';

import Users from './components/user/Users.jsx';
import UserDetail from './components/user/UserDetail.jsx';

import Statistics from './components/Statistics';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Register from './components/Register';

import './styles.css';

function App() {
  const location = useLocation();

  const [isLoggedIn, setLoggedIn] = useState(true);
  const [isAdmin, setAdmin] = useState(false);

  const [collapsed, setCollapsed] = useState(false);
  
  const [currentPage, setCurrentPage] = useState('products');
  const [currentId, setCurrentId] = useState(0);


  const [settings, setSettings] = useState({
    darkMode: false,
    compactSidebar: false,
    primaryColor: '#3498db',
    itemsPerPage: '10',
    showThumbnails: true,
    emailNotifications: true,
    desktopNotifications: false
  });

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    
    // Lưu cài đặt vào localStorage để duy trì giữa các phiên
    localStorage.setItem('sportAdmin-settings', JSON.stringify(newSettings));
  };

  // Tải cài đặt từ localStorage khi khởi động ứng dụng
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoggedIn(false)
    }

    const savedSettings = localStorage.getItem('sportAdmin-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  return (
    <div className={`app-container ${settings.darkMode ? 'dark-theme' : 'light-theme'}`}>

      {(location.pathname !== "/admin/register" && location.pathname !== "/admin/login") && (

        <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}

        currentId={currentId}
        setCurrentId={setCurrentId}

        settings={settings}
        isLoggedIn={isLoggedIn}
      />
      )}
      
      <div className={`main-content ${collapsed ? 'expanded' : ''}`} style={{ marginLeft: ["/admin/register", "/admin/login"].includes(location.pathname) ? 0 : undefined }}>
        <Routes>
          <Route path="/admin/register" element={<Register settings={settings} />} />
          <Route path="/admin/login" element={<Login settings={settings} />} />

          <Route element={<AuthRoute isLoggedIn={isLoggedIn} />}>
            <Route path="/admin" element={<Navigate to="/admin/statistics" />} />

            <Route path="/admin/statistics" element={<Statistics settings={settings} />} />

            <Route path="/admin/order" element={<Order settings={settings} />} />
            <Route path="/admin/order/:id" element={<OrderDetail />} />

            <Route path="/admin/users" element={<Users settings={settings} />} />
            <Route path="/admin/users/:id" element={<UserDetail />} />

            <Route path="/admin/accounts" element={<Account settings={settings} />} />
            <Route path="/admin/accounts/:id" element={<AccountDetail />} />

            <Route path="/admin/products" element={<Product settings={settings} />} />
            <Route path="/admin/products/:id" element={<ProductDetail />} />

            <Route path="/admin/category" element={<Category settings={settings} />} />
            <Route path="/admin/category/:id" element={<CategoryDetail />} />
            
            <Route path="/admin/settings" element={<Settings settings={settings} updateSettings={updateSettings} />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App; 