import { Tag } from 'antd';
import React, { useEffect, useState } from 'react';
// import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();
  return (
    <div className="user-list">
      <table>
        <thead>
          <tr>
            <th className='id-row' style={{width: '120px'}} onClick={() => handleSort('id')}>ID {getSortIcon('id')}</th>
            <th className='user-icon-row'>Ảnh đại diện</th>
            <th onClick={() => handleSort('name')}>Họ tên {getSortIcon('name')}</th>
            <th onClick={() => handleSort('email')}>Email {getSortIcon('email')}</th>
            <th className='role-row' onClick={() => handleSort('role')}>Vai trò {getSortIcon('role')}</th>
            <th className='role-row'>Quyền {getSortIcon('role')}</th>
            {/* <th className='status-row' onClick={() => handleSort('status')}>Trạng thái {getSortIcon('status')}</th> */}
            <th className='action-row'>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.length > 0 ? (
            sortedUsers.map(user => (
                <tr className='item-row' key={user.uuid} onClick={() => navigate(`/admin/users/${user.uuid}`)}>
                <td>{user.uuid}</td>
                <td>
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
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
                <td>{user.user_name}</td>
                <td>{user.email}</td>
                <td className='role'>
                  <div>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span> 
                  </div>
                </td>
                <td className='permissions'>
                  <div>
                    {user.permissions.map(per => (
                      <Tag color="blue">{per}</Tag>
                    ))}
                  </div>
                </td>
                {/* <td className='status'>
                  <div>
                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </div>
                </td> */}
                <td className="actions">
                  <div>
                    <button className="edit-button" onClick={(e) => {e.stopPropagation(); onEdit(user)}}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="delete-button" onClick={(e) => {e.stopPropagation(); onDelete(user)}}>
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

export default UserList; 