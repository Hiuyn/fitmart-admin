import React, { useState, useEffect } from 'react';
import AccountList from './AccountList';
import AccountForm from './AccountForm';
import DeleteConfirmation from '../../components/DeleteConfirmation';

const Account = () => {
  // Dữ liệu mẫu
  const sampleAccounts = [
    { 
      uuid: "FM9a7113c1",
      user_name: "think tran",
      email: "think@gmail.com",
      avatar_url: "",
      address: "",
      created_at: "2025-05-16T08:50:58.747Z",
      updated_at: "2025-05-16T08:50:58.747Z",
      deleted_at: null
    },
    { 
      uuid: "FM9a7113c1",
      user_name: "think tran",
      email: "think@gmail.com",
      avatar_url: "",
      address: "",
      created_at: "2025-05-16T08:50:58.747Z",
      updated_at: "2025-05-16T08:50:58.747Z",
      deleted_at: null
    },
    { 
      uuid: "FM9a7113c1",
      user_name: "think tran",
      email: "think@gmail.com",
      avatar_url: "",
      address: "",
      created_at: "2025-05-16T08:50:58.747Z",
      updated_at: "2025-05-16T08:50:58.747Z",
      deleted_at: null
    },
    { 
      uuid: "FM9a7113c1",
      user_name: "think tran",
      email: "think@gmail.com",
      avatar_url: "",
      address: "",
      created_at: "2025-05-16T08:50:58.747Z",
      updated_at: "2025-05-16T08:50:58.747Z",
      deleted_at: null
    },
    { 
      uuid: "FM9a7113c1",
      user_name: "think tran",
      email: "think@gmail.com",
      avatar_url: "",
      address: "",
      created_at: "2025-05-16T08:50:58.747Z",
      updated_at: "2025-05-16T08:50:58.747Z",
      deleted_at: null
    },
  ];

  const [accounts, setAccounts] = useState(sampleAccounts);
  const [editing, setEditing] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const filteredAccounts = accounts.filter(account => 
    account.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.uuid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleEdit = (account) => {
    setEditing(account);
    setIsFormOpen(true);
  };

  const handleDelete = (account) => {
    setAccountToDelete(account);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (accountToDelete) {
      setAccounts(accounts.filter(p => p.id !== accountToDelete.id));
      setIsDeleteOpen(false);
      setAccountToDelete(null);
    }
  };

  const handleSave = (account) => {
    if (editing) {
      // Cập nhật sản phẩm
      setAccounts(accounts.map(p => p.id === account.id ? account : p));
    } else {
      // Thêm sản phẩm mới với ID tự động tăng
      const newId = Math.max(...accounts.map(p => p.id), 0) + 1;
      setAccounts([...accounts, { ...account, id: newId }]);
    }
    setIsFormOpen(false);
    setEditing(null);
  };

  return (
    <div className="dashboard">
      <h1>Quản lý tài khoản</h1>
      
      <div className="controls">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <button className="add-button" onClick={handleAddNew}>
          <i className="fas fa-plus"></i> Thêm sản phẩm
        </button>
      </div>

      <AccountList 
        accounts={filteredAccounts} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {isFormOpen && (
        <AccountForm 
          account={editing} 
          onSave={handleSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}

      {isDeleteOpen && (
        <DeleteConfirmation 
          account={accountToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteOpen(false)}
        />
      )}
    </div>
  );
};

export default Account; 