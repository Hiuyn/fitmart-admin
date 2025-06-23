import React, { useState } from 'react';

const OrderList = ({ orders, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortField === 'price' || sortField === 'stock' || sortField === 'id') {
      return sortDirection === 'asc' 
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    } else {
      const aValue = typeof a[sortField] === 'string' ? a[sortField] : String(a[sortField]);
      const bValue = typeof b[sortField] === 'string' ? b[sortField] : String(b[sortField]);
      
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
  });

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '▲' : '▼';
  };

  return (
    <div className="product-list">
      <table>
        <thead>
          <tr className='head'>
            <th className='id-row' onClick={() => handleSort('id')}>ID {getSortIcon('id')}</th>
            <th className='image-row'>Hình ảnh</th>
            <th onClick={() => handleSort('name')}>Tên giỏ hàng {getSortIcon('name')}</th>
            <th onClick={() => handleSort('category')}>Danh mục {getSortIcon('category')}</th>
            <th onClick={() => handleSort('price')}>Giá {getSortIcon('price')}</th>
            <th onClick={() => handleSort('stock')}>Tồn kho {getSortIcon('stock')}</th>
            <th className='action-row'>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.length > 0 ? (
            sortedOrders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {order.avatar ? (
                    <img 
                      src={order.avatar} 
                      alt={order.name} 
                      className="order-avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.parentNode.innerHTML = '<div class="avatar-placeholder"><i class="fas fa-question"></i></div>';
                      }}
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <i className="fas fa-question"></i>
                    </div>
                  )}
                </td>
                <td>{order.name}</td>
                <td>{order.email}</td>
                <td className='role'>
                  {order.role}
                </td>
                <td className='status'>
                  {order.status}
                </td>
                <td className="actions">
                  <div>
                    <button className="edit-button" onClick={() => onEdit(order)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="delete-button" onClick={() => onDelete(order)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">Không có người dùng nào</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList; 