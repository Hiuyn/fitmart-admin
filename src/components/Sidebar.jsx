import React from 'react';
import { Routes, Route, Link  } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ collapsed, setCollapsed, currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'statistics', name: 'Thống kê', icon: 'fa-chart-bar' },
    { id: 'order', name: 'Hàng đặt', icon: 'fa-shopping-cart' },
    { id: 'users', name: 'Người dùng', icon: 'fa-user' },
    { id: 'accounts', name: 'Tài khoản', icon: 'fa-users' },
    { id: 'products', name: 'Sản phẩm', icon: 'fa-box' },
    { id: 'category', name: 'Danh mục', icon: 'fa-list ' },
    { id: 'register', name: 'Đăng xuất', icon: 'fa-sign-out' },
  ];

  const user = JSON.parse(localStorage.getItem('user'));

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
          {menuItems.map(item => {
            
            // Ẩn users và accounts nếu không phải ADMIN
            if (
              (item.id === 'users' || item.id === 'accounts') &&
              (!user?.data?.role || user.data.role !== 'ADMIN')
            ) {
              return null;
            }

            const path = `/admin/${item.id === 'register' ? 'login' : item.id}`;

            return (
              <NavLink
                key={item.id}
                to={path}
                style={{ textDecoration: 'none' }}
                className={({ isActive }) => ''}
              >
                {({ isActive }) => (
                  <li className={isActive ? 'active' : ''} style={{ color: 'white', userSelect: 'none' }}>
                    <i className={`fas ${item.icon}`}></i>
                    {!collapsed && <span>{item.name}</span>}
                  </li>
                )}
              </NavLink>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar; 