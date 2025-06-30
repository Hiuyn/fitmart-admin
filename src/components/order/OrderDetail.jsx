import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OrderForm from './OrderForm';

const OrderDetail = () => {
  const { id } = useParams(); // gets the ":id" from the URL

  const editing = true;
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [order, setOrder] = useState({});
  

  useEffect(() => {
    fetchUsers(); // Your API expects 1-based page numbers
  }, []);
  const [ready, setReady] = useState(false);
  const fetchUsers = async () => {
    const token = localStorage.getItem('token');

    const responseDetail = await fetch(`http://localhost:8080/api/v1/orders/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await responseDetail.json();

    console.log(data)

    setOrder(data)

    console.log(order)

    setReady(true);
  };

  const handleEdit = () => {
    setIsFormOpen(true);
  };

  const sampleOrder = {
    uuid: "FM9a7113c1",
    name: "think tran",
    email: "think@gmail.com",
    avatar_url: "",
    address: "",
    created_at: "2025-05-16T08:50:58.747Z",
    updated_at: "2025-05-16T08:50:58.747Z",
    deleted_at: null
  };


  const handleSave = (order) => {
    setIsFormOpen(false);
  };

  return (
    <div className="dashboard">
      <div>
        <h1>Chi tiết hàng đặt: </h1>
      
        <div className='detail-actions'>
          <button className="detail-edit-button" onClick={(e) => {e.stopPropagation(); handleEdit(sampleOrder)}} style={{display: 'flex', gap: '.5rem', paddingRight: '30px', paddingLeft: '30px'}}>
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
              <td>{id}</td>
            </tr>
            <tr>
              <th className='image-row'>Hình ảnh</th>
              <td></td>
            </tr>
            <tr>
              <th>Tên giỏ hàng</th>
              <td></td>
            </tr>
            <tr>
              <th>Danh mục</th>
              <td></td>
            </tr>
            <tr>
              <th>Giá</th>
              <td></td>
            </tr>
            <tr>
              <th>Tồn kho</th>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <OrderForm 
          order={editing} 
          onSave={handleSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default OrderDetail; 