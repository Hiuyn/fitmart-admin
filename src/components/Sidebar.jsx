import React from 'react';
import { Routes, Route, Link  } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import Dashboard from './product/Product';
import Category from './category/Category';
import Account from './account/Account';
import Order from './order/Order';
import Users from './user/Users';
import Statistics from './Statistics';
import Settings from './Settings';
import Login from './Login';
import Register from './Register';

const Sidebar = ({ collapsed, setCollapsed, currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'statistics', name: 'Thống kê', icon: 'fa-chart-bar' },
    { id: 'order', name: 'Order', icon: 'fa-shopping-cart' },
    { id: 'users', name: 'Người dùng', icon: 'fa-user' },
    { id: 'accounts', name: 'Tài khoản', icon: 'fa-users' },
    { id: 'products', name: 'Sản phẩm', icon: 'fa-box' },
    { id: 'category', name: 'Danh mục', icon: 'fa-list ' },
    { id: 'settings', name: 'Cài đặt', icon: 'fa-cog' },
    { id: 'register', name: 'Đăng xuất', icon: 'fa-sign-out' },
  ];
  
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>{collapsed ? 'A' : 'Admin Panel'}</h2>
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '>' : '<'}
        </button>
      </div>
      <div className="sidebar-menu">
        <ul>
          {menuItems.map(item => (
            <li key={item.id}>
              <NavLink
                to={`/${item.id === 'register' ? 'login' : item.id}`}
                className={({ isActive }) => (isActive ? 'active' : '')}
                style={{ color: 'white' }}
              >
                <i className={`fas ${item.icon}`}></i>
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar; 