import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();
  return (
    <div className="product-list">
      <table>
        <thead>
          <tr className='head-account'>
            <th className='id-row' style={{width: '120px'}} onClick={() => handleSort('uuid')}>ID {getSortIcon('uuid')}</th>
            <th className='image-row'>Hình ảnh</th>
            <th onClick={() => handleSort('user_name')}>Tên tài khoản {getSortIcon('user_name')}</th>
            <th onClick={() => handleSort('email')}>Email {getSortIcon('email')}</th>
            <th className='action-row'>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {sortedAccounts.length > 0 ? (
            sortedAccounts.map(account => (
              <tr className='item-row' key={account.id} onClick={() => navigate(`/admin/accounts/${account.uuid}`)}>
                <td>{account.uuid}</td>
                <td>
                  {account.avatar_url ? (
                    <img 
                      src={account.avatar_url} 
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
                <td>{account.user_name}</td>
                <td>{account.email}</td>
                <td className="actions">
                  <div>
                    <button className="edit-button" onClick={(e) => {e.stopPropagation(); onEdit(account)}}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="delete-button" onClick={(e) => {e.stopPropagation(); onDelete(account)}}>
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