import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AccountForm from './AccountForm';

const AccountDetail = () => {
  const { id } = useParams(); // gets the ":id" from the URL

  const editing = true;
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = () => {
    setIsFormOpen(true);
  };

  const sampleAccount = {
    uuid: "FM9a7113c1",
    name: "think tran",
    email: "think@gmail.com",
    avatar_url: "",
    address: "",
    created_at: "2025-05-16T08:50:58.747Z",
    updated_at: "2025-05-16T08:50:58.747Z",
    deleted_at: null
  };

  const [account, setAccount] = useState({});


  useEffect(() => {
    fetchUsers(); // Your API expects 1-based page numbers
  }, []);
  const [ready, setReady] = useState(false);
  const fetchUsers = async () => {
    const token = localStorage.getItem('token');

    const responseDetail = await fetch(`http://localhost:8080/api/v1/accounts/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await responseDetail.json();

    console.log(data)

    setAccount(data)

    console.log(account)

    setReady(true);
  };


  const handleSave = (account) => {
    setIsFormOpen(false);
  };

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div>
        <h1>Chi tiết tài khoản: </h1>
      
        <div className='detail-actions'>
          <button className="detail-edit-button" onClick={(e) => {e.stopPropagation(); handleEdit(sampleAccount)}} style={{display: 'flex', gap: '.5rem', paddingRight: '30px', paddingLeft: '30px'}}>
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
              <th className='id-row fart' style={{width: '125px'}}>ID</th>
              <td>{account.uuid}</td>
            </tr>
            <tr>
              <th>Username</th>
              <td>{account.user_name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{account.email}</td>
            </tr>
            <tr>
              <th>Ảnh đại diện</th>
              <td>{account.avatar_url}</td>
            </tr>
            <tr>
              <th>Địa chỉ</th>
              <td>{account.address}</td>
            </tr>
            <tr>
              <th>Số điện thoại</th>
              <td>{account.phone}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <AccountForm 
          account={account} 
          onSave={handleSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default AccountDetail; 