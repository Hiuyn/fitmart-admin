import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserForm from './UserForm';


const UserDetail = () => {
  const { id } = useParams(); // gets the ":id" from the URL

  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = () => {
    setIsFormOpen(true);
  };

  const [user, setUser] = useState({});

  useEffect(() => {
    fetchUsers(); // Your API expects 1-based page numbers
  }, []);
  const [ready, setReady] = useState(false);
  const fetchUsers = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:8080/api/v1/users/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });


    const data = await response.json();
    console.log(data)

    setUser(data)
  };


  const handleSave = (order) => {
    setIsFormOpen(false);
  };

  return (
    <div className="dashboard">
      <div>
        <h1>Chi tiết người dùng: </h1>
      
        <div className='detail-actions'>
          <button className="detail-edit-button" onClick={(e) => {e.stopPropagation(); handleEdit()}} style={{display: 'flex', gap: '.5rem', paddingRight: '30px', paddingLeft: '30px'}}>
            <i className="fas fa-edit"></i>
            <div>Sửa</div>
          </button>
          <button className="detail-delete-button" onClick={(e) => {e.stopPropagation();}} style={{display: 'flex', gap: '.5rem', paddingRight: '30px', paddingLeft: '30px'}}>
            <i className="fas fa-trash"></i>
            <div>Xoá</div>
          </button>
        </div>
      </div>

      <div className="product-list">
        <table className='detail-table'>
          <tbody>
            <tr className='head'>
              <th className='id-row fart' style={{width: '140px'}}>ID</th>
              <td>{user.uuid}</td>
            </tr>
            <tr>
              <th>Tên người dùng</th>
              <td>{user.user_name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th>Role</th>
              <td>{user.role}</td>
            </tr>
            <tr>
              <th>Avatar</th>
              <td>{user.avatar_url}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <UserForm 
          user={user} 
          onSave={handleSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default UserDetail; 