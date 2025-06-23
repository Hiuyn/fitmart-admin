import React, { useState, useEffect } from 'react';
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

  const [orders, setOrders] = useState(sampleOrders);
  const [editing, setEditing] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc giỏ hàng theo từ khóa tìm kiếm
  const filteredOrders = orders.filter(order => 
    order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.uuid.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      // Cập nhật giỏ hàng
      setOrders(orders.map(p => p.id === order.id ? order : p));
    } else {
      // Thêm giỏ hàng mới với ID tự động tăng
      const newId = Math.max(...orders.map(p => p.id), 0) + 1;
      setOrders([...orders, { ...order, id: newId }]);
    }
    setIsFormOpen(false);
    setEditing(null);
  };

  return (
    <div className="dashboard">
      <h1>Quản lý giỏ hàng</h1>
      
      <div className="controls">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Tìm kiếm giỏ hàng..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <button className="add-button" onClick={handleAddNew}>
          <i className="fas fa-plus"></i> Thêm giỏ hàng
        </button>
      </div>

      <OrderList 
        orders={filteredOrders} 
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