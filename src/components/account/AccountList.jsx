import React, { useState } from 'react';

const AccountList = ({ accounts, onEdit, onDelete }) => {
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

  const sortedAccounts = [...accounts].sort((a, b) => {
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
          <tr className='head-account'>
            <th className='id-row' onClick={() => handleSort('id')}>ID {getSortIcon('id')}</th>
            <th className='image-row'>Hình ảnh</th>
            <th onClick={() => handleSort('name')}>Tên sản phẩm {getSortIcon('name')}</th>
            <th onClick={() => handleSort('category')}>Danh mục {getSortIcon('category')}</th>
            <th onClick={() => handleSort('price')}>Giá {getSortIcon('price')}</th>
            <th onClick={() => handleSort('stock')}>Tồn kho {getSortIcon('stock')}</th>
            <th className='action-row'>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {sortedAccounts.length > 0 ? (
            sortedAccounts.map(account => (
              <tr key={account.id}>
                <td>{account.id}</td>
                <td>
                  {account.avatar ? (
                    <img 
                      src={account.avatar} 
                      alt={account.name} 
                      className="account-avatar"
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
                <td>{account.name}</td>
                <td>{account.email}</td>
                <td className='role'>
                  {account.role}
                </td>
                <td className='status'>
                  {account.status}
                </td>
                <td className="actions">
                  <div>
                    <button className="edit-button" onClick={() => onEdit(account)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="delete-button" onClick={() => onDelete(account)}>
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

export default AccountList; 