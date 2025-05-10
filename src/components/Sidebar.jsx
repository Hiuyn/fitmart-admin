import React from 'react';

const Sidebar = ({ collapsed, setCollapsed, currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'products', name: 'Sản phẩm', icon: 'fa-box' },
    { id: 'users', name: 'Người dùng', icon: 'fa-users' },
    { id: 'statistics', name: 'Thống kê', icon: 'fa-chart-bar' },
    { id: 'settings', name: 'Cài đặt', icon: 'fa-cog' }
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