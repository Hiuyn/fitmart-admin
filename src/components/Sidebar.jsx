import React from 'react';

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
            <li 
              key={item.id}
              className={currentPage === item.id ? 'active' : ''}
              onClick={() => setCurrentPage(item.id)}
            >
              <i className={`fas ${item.icon}`}></i>
              {!collapsed && <span>{item.name}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar; 