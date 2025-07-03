import React, { useEffect, useState } from 'react';
import OrderList from './OrderList';
import OrderForm from './OrderForm';
import DeleteConfirmation from '../DeleteConfirmation';

const Order = () => {
  // Dữ liệu mẫu
  const sampleOrders = [
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

  useEffect(() => {
    fetchUsers(); // Your API expects 1-based page numbers
  }, []);
  const [ready, setReady] = useState(false);
  const fetchUsers = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:8080/api/v1/orders`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const filteredData = data.data.data.filter(product => product.deleted_at === null)

    setOrders(filteredData)
    setReady(true);
  };

  const [orders, setOrders] = useState(sampleOrders);
  const [editing, setEditing] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddNew = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleEdit = (order) => {
    setEditing(order);
    setIsFormOpen(true);
  };

  const handleDelete = (order) => {
    setOrderToDelete(order);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      setOrders(orders.filter(p => p.id !== orderToDelete.id));
      setIsDeleteOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleSave = (order) => {
    if (editing) {
      // Cập nhật sản phẩm
      setOrders(orders.map(p => p.id === order.id ? order : p));
    } else {
      // Thêm sản phẩm mới với ID tự động tăng
      const newId = Math.max(...orders.map(p => p.id), 0) + 1;
      setOrders([...orders, { ...order, id: newId }]);
    }
    setIsFormOpen(false);
    setEditing(null);
  };

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Quản lý hàng đặt</h1>
      
      <div className="controls">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Tìm kiếm hàng đặt..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <button className="add-button" onClick={handleAddNew}>
          <i className="fas fa-plus"></i> Thêm hàng đặt
        </button>
      </div>

      <OrderList 
        orders={orders} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {isFormOpen && (
        <OrderForm 
          order={editing} 
          onSave={handleSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}

      {isDeleteOpen && (
        <DeleteConfirmation 
          order={orderToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteOpen(false)}
        />
      )}
    </div>
  );
};

export default Order; 