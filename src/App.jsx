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

import { isAuthenticated } from './middleware/AuthContext.jsx';

import './styles.css';

function App() {
  const location = useLocation();
  
  const [isLoggedIn, setLoggedIn] = useState(true);

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
  

  // Áp dụng chế độ tối khi thay đổi cài đặt
  useEffect(() => {
    
    // Áp dụng màu chủ đạo
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    
    // Áp dụng cài đặt sidebar
    if (settings.compactSidebar) {
      setCollapsed(true);
    }
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    
    // Lưu cài đặt vào localStorage để duy trì giữa các phiên
    localStorage.setItem('sportAdmin-settings', JSON.stringify(newSettings));
  };

  // Tải cài đặt từ localStorage khi khởi động ứng dụng
  useEffect(() => {
    const savedSettings = localStorage.getItem('sportAdmin-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  return (
    <div className={`app-container ${settings.darkMode ? 'dark-theme' : 'light-theme'}`}>

      {(location.pathname != "/register") && (

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
      
      <div className={`main-content ${collapsed ? 'expanded' : ''}`} style={{ marginLeft: ["/register", "/login"].includes(location.pathname) ? 0 : undefined }}>
        <Routes>
          <Route path="/register" element={<Register settings={settings} />} />
          <Route path="/login" element={<Login settings={settings} />} />

          <Route element={<AuthRoute isLoggedIn={isLoggedIn} />}>
            <Route path="/" element={<Navigate to="/statistics" />} />

            <Route path="/statistics" element={<Statistics settings={settings} />} />

            <Route path="/order" element={<Order settings={settings} />} />
            <Route path="/order/:id" element={<OrderDetail />} />

            <Route path="/users" element={<Users settings={settings} />} />
            <Route path="/users/:id" element={<UserDetail />} />

            <Route path="/accounts" element={<Account settings={settings} />} />
            <Route path="/accounts/:id" element={<AccountDetail />} />

            <Route path="/products" element={<Product settings={settings} />} />
            <Route path="/products/:id" element={<ProductDetail />} />

            <Route path="/category" element={<Category settings={settings} />} />
            <Route path="/category/:id" element={<CategoryDetail />} />
            
            <Route path="/settings" element={<Settings settings={settings} updateSettings={updateSettings} />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App; 