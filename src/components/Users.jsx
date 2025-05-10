import React, { useState } from 'react';
import UserList from './UserList';
import UserForm from './UserForm';
import DeleteConfirmation from './DeleteConfirmation';

const Users = () => {
  // Dữ liệu mẫu
  const sampleUsers = [
    { 
      id: 1, 
      name: 'Nguyễn Văn A', 
      email: 'nguyenvana@example.com', 
      role: 'Admin', 
      status: 'Hoạt động',
      phone: '0901234567',
      address: 'Hồ Chí Minh',
      avatar: ''
    },
    { 
      id: 2, 
      name: 'Trần Thị B', 
      email: 'tranthib@example.com', 
      role: 'Nhân viên', 
      status: 'Hoạt động',
      phone: '0901234568',
      address: 'Hà Nội',
      avatar: ''
    },
    { 
      id: 3, 
      name: 'Lê Văn C', 
      email: 'levanc@example.com', 
      role: 'Nhân viên', 
      status: 'Bị khóa',
      phone: '0901234569',
      address: 'Đà Nẵng',
      avatar: ''
    },
    { 
      id: 4, 
      name: 'Phạm Thị D', 
      email: 'phamthid@example.com', 
      role: 'Khách hàng', 
      status: 'Hoạt động',
      phone: '0901234570',
      address: 'Cần Thơ',
      avatar: ''
    },
    { 
      id: 5, 
      name: 'Hoàng Văn E', 
      email: 'hoangvane@example.com', 
      role: 'Khách hàng', 
      status: 'Chờ xác nhận',
      phone: '0901234571',
      address: 'Huế',
      avatar: ''
    },
  ];

  const [users, setUsers] = useState(sampleUsers);
  const [editing, setEditing] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc người dùng theo từ khóa tìm kiếm
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user) => {
    setEditing(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setIsDeleteOpen(false);
      setUserToDelete(null);
    }
  };

  const handleSave = (user) => {
    if (editing) {
      // Cập nhật người dùng
      setUsers(users.map(u => u.id === user.id ? user : u));
    } else {
      // Thêm người dùng mới với ID tự động tăng
      const newId = Math.max(...users.map(u => u.id), 0) + 1;
      setUsers([...users, { ...user, id: newId }]);
    }
    setIsFormOpen(false);
    setEditing(null);
  };

  return (
    <div className="dashboard">
      <h1>Quản lý người dùng</h1>
      
      <div className="controls">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Tìm kiếm người dùng..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <button className="add-button" onClick={handleAddNew}>
          <i className="fas fa-plus"></i> Thêm người dùng
        </button>
      </div>

      <UserList 
        users={filteredUsers} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {isFormOpen && (
        <UserForm 
          user={editing} 
          onSave={handleSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}

      {isDeleteOpen && (
        <DeleteConfirmation 
          product={userToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteOpen(false)}
          message={`Bạn có chắc chắn muốn xóa người dùng ${userToDelete?.name}?`}
        />
      )}
    </div>
  );
};

export default Users; 