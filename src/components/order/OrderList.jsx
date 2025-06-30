import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderList = ({ orders, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  console.log(orders)

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

  const navigate = useNavigate();
  return (
    <div className="product-list">
      <table>
        <thead>
          <tr className='head'>
            <th className='id-row' style={{width: '120px'}} onClick={() => handleSort('uuid')}>ID {getSortIcon('uuid')}</th>
            <th style={{width: '120px'}} onClick={() => handleSort('account_id')}>ID Tài khoản {getSortIcon('account_id')}</th>
            <th onClick={() => handleSort('payment_method')}>Cách trả tiền {getSortIcon('payment_method')}</th>
            <th onClick={() => handleSort('status_txt')}>Status {getSortIcon('status_txt')}</th>
            <th onClick={() => handleSort('total_fee')}>Tổng giá {getSortIcon('total_fee')}</th>
            
            <th className='action-row'>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.length > 0 ? (
            sortedOrders.map(order => (
              <tr className='item-row' key={order.id} onClick={() => navigate(`/admin/order/${order.id}`)}>
                <td>{order.uuid}</td>
                <td>{order.account_id}</td>
                <td>{order.payment_method}</td>
                <td className='status'>{order.status_txt}</td>
                <td>{order.total_fee}</td>
                <td className="actions">
                  <div>
                    <button className="edit-button" onClick={(e) => {e.stopPropagation(); onEdit(order)}}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="delete-button" onClick={(e) => {e.stopPropagation(); onDelete(order)}}>
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