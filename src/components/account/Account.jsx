import React, { useState, useEffect } from 'react';
import AccountList from './AccountList';
import AccountForm from './AccountForm';
import DeleteConfirmation from '../../components/DeleteConfirmation';

const Account = () => {
  // Dữ liệu mẫu
  const sampleAccounts = [];

  useEffect(() => {
    fetchAccounts(); // Your API expects 1-based page numbers
  }, []);
  const [ready, setReady] = useState(false);
  const fetchAccounts = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:8080/api/v1/accounts?limit=25&q=&type=`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const filteredData = data.data.data.filter(account => account.deleted_at === null)

    setAccounts(filteredData)
    setReady(true);
  };

  const [accounts, setAccounts] = useState(sampleAccounts);
  const [editing, setEditing] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc tài khoản theo từ khóa tìm kiếm
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

  const confirmDelete = async () => {
    if (accountToDelete) {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch(`http://localhost:8080/api/v1/accounts/${accountToDelete.uuid}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res)

        alert("Account Deleted")

        setIsDeleteOpen(false);
        setAccountToDelete(null);
        reloadData(token)
      } catch (error) {
        console.error('Error posting data:', error);
      }
      
      setIsFormOpen(false);
      setEditing(null);
    }
  };

  const handleSave = async (account) => {
    const token = localStorage.getItem('token');

    if (editing) {

      try {
        const res = await fetch(`http://localhost:8080/api/v1/accounts/${account.uuid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(account),
        });

        alert("Account Updated")

        reloadData(token)
      } catch (error) {
        console.error('Error posting data:', error);
      }
    } else {
      console.log(account)
      
      try {
        const res = await fetch('http://localhost:8080/api/v1/accounts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(account),
        });

        alert("Account Created")

        reloadData(token)
      } catch (error) {
        console.error('Error posting data:', error);
      }
    }
    setIsFormOpen(false);
    setEditing(null);
  };

    const reloadData = async (token) => {
    const response = await fetch(`http://localhost:8080/api/v1/accounts?created_at=-1&limit=25&q=&type=`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    const filteredData = data.data.data.filter(product => product.deleted_at === null)

    setAccounts(filteredData)
  }

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Quản lý tài khoản</h1>
      
      <div className="controls">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Tìm kiếm tài khoản..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <button className="add-button" onClick={handleAddNew}>
          <i className="fas fa-plus"></i> Thêm tài khoản
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