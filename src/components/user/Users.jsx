import React, { useEffect, useState } from 'react';
import UserList from './UserList';
import UserForm from './UserForm';
import DeleteConfirmation from '../DeleteConfirmation';
import {notification} from 'antd'

const Users = () => {
  // Dữ liệu mẫu
  const sampleUsers = [];

  const [users, setUsers] = useState(sampleUsers);
  const [editing, setEditing] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');


  useEffect(() => {
    fetchUsers(searchTerm); // Your API expects 1-based page numbers
  }, [searchTerm]);
  const [ready, setReady] = useState(false);
  const fetchUsers = async (searchTerm) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/users?created_at=-1&limit=25&q=${searchTerm}&type=`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const filteredData = data.data.data.filter(product => product.deleted_at === null)
      setUsers(filteredData)
      setReady(true);
    } catch (error) {
      console.log('Eror: ', error.message)
    }
  };

  // Lọc người dùng theo từ khóa tìm kiếm
  var filteredUsers = {}
  if (ready) {
    filteredUsers = users.filter(user => 
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const reloadData = async (token) => {
    const response = await fetch(`http://localhost:8080/api/v1/users?created_at=-1&limit=25&q=&type=`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    const filteredData = data.data.data.filter(product => product.deleted_at === null)

    setUsers(filteredData)
  }

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

  const confirmDelete = async () => {
    if (userToDelete) {
      const token = localStorage.getItem('token');

      fetch(`http://localhost:8080/api/v1/users/${userToDelete.uuid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then(res => {
        return res.json()
      }).then(data => {
        if (data.code === 200) {
          notification.success({ message: 'Xoá thành công' })
        } else {
          notification.error({ message: data.message })
        }
      }).catch(err => notification.error({ message: err.message }))
      .finally(() => {
        setIsDeleteOpen(false);
        setUserToDelete(null);
        reloadData(token)
      });
      
      setIsFormOpen(false);
      setEditing(null);
    }
  };

  const handleSave = async (user) => {
    const token = localStorage.getItem('token');
    if (editing) {
      let temp = {...user, password: user.password ?? ""}
      fetch(`http://localhost:8080/api/v1/users/${temp.uuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(temp),
      }).then(response => {
        return response.json(); // Phải gọi để lấy body JSON thực tế
      })
      .then(data => {
        if (data.code === 200) {
          notification.success({ message: 'Cập nhật thành công' })
          setIsFormOpen(false);
          setEditing(null);
        } else {
          notification.error({ message: data.message })
        }
      }).catch(err => notification.error({ message: err.message }))
      .finally(() => {
        reloadData(token)
      })
    } else {
      try {
        fetch('http://localhost:8080/api/v1/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user),
        }).then(res => {
          return res.json()
        }).then(data => {
          if (data.code === 200) {
            notification.success({ message: 'Tạo thành công' })
            setIsFormOpen(false);
            setEditing(null);
          } else {
            notification.error({ message: data.message })
          }
        }).catch(err => console.log(err))
        .finally(() => {
          reloadData(token)
        });
        // alert("User Created")

      } catch (error) {
        console.error('Error posting data:', error);
      }
    }
  };

  if (!ready) {
    return <div>Loading...</div>;
  }

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
        users={users} 
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
          message={`Bạn có chắc chắn muốn xóa người dùng ${userToDelete?.user_name}?`}
        />
      )}
    </div>
  );
};

export default Users; 