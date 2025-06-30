import React, { useEffect, useState } from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import DeleteConfirmation from '../DeleteConfirmation';

const Product = () => {
  // Dữ liệu mẫu
  const sampleProducts = [];

  useEffect(() => {
    fetchUsers(); // Your API expects 1-based page numbers
  }, []);
  const [ready, setReady] = useState(false);
  const fetchUsers = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:8080/api/v1/products`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const filteredData = data.data.data.filter(product => product.deleted_at === null)

    console.log(filteredData)

    setProducts(filteredData)
    setReady(true);
  };

  const [products, setProducts] = useState(sampleProducts);
  const [editing, setEditing] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc sản phẩm theo từ khóa tìm kiếm
  var filteredProducts = {}

  console.log(products)
  if (ready) {
    filteredProducts = products.filter(product => 
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const handleAddNew = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product) => {
    setEditing(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setIsDeleteOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSave = (product) => {
    if (editing) {
      // Cập nhật sản phẩm
      setProducts(products.map(p => p.id === product.id ? product : p));
    } else {
      // Thêm sản phẩm mới với ID tự động tăng
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      setProducts([...products, { ...product, id: newId }]);
    }
    setIsFormOpen(false);
    setEditing(null);
  };

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Quản lý sản phẩm thể thao</h1>
      
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

      <ProductList 
        products={filteredProducts} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      <ProductForm 
        product={editing}
        isModalOpen={isFormOpen}
        onSave={handleSave}
        onCancel={() => setIsFormOpen(false)} 
      />

      {isDeleteOpen && (
        <DeleteConfirmation 
          product={productToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteOpen(false)}
        />
      )}
    </div>
  );
};

export default Product;