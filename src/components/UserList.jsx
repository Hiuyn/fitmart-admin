import React, { useState } from 'react';

const UserList = ({ users, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (sortField === 'id') {
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
    <div className="user-list">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID {getSortIcon('id')}</th>
            <th>Ảnh đại diện</th>
            <th onClick={() => handleSort('name')}>Họ tên {getSortIcon('name')}</th>
            <th onClick={() => handleSort('email')}>Email {getSortIcon('email')}</th>
            <th onClick={() => handleSort('role')}>Vai trò {getSortIcon('role')}</th>
            <th onClick={() => handleSort('status')}>Trạng thái {getSortIcon('status')}</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.length > 0 ? (
            sortedUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="user-avatar"
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
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td className="actions">
                  <button className="edit-button" onClick={() => onEdit(user)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="delete-button" onClick={() => onDelete(user)}>
                    <i className="fas fa-trash"></i>
                  </button>
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

export default UserList; 