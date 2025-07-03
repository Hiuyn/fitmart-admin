import React, { useEffect, useState } from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import DeleteConfirmation from '../DeleteConfirmation';
import { getAllProductOptions, getProductVariants } from '../../api/products';
import { notification } from 'antd';

const token = localStorage.getItem('token');
const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

const Product = () => {
  // Dữ liệu mẫu
  const sampleProducts = [];

  useEffect(() => {
    fetchUsers(); // Your API expects 1-based page numbers
  }, []);
  const [ready, setReady] = useState(false);
  const fetchUsers = async () => {

    const response = await fetch(`http://localhost:8080/api/v1/products`, {
      headers: getHeaders(),
    });

    const data = await response.json();
    const filteredData = data.data.data.filter(product => product.deleted_at === null)

    setProducts(filteredData)
    setReady(true);
  };

  const [products, setProducts] = useState(sampleProducts);
  const [editing, setEditing] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddNew = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product) => {
    let formData = {...product}
    Promise.all([
      getProductVariants(product.uuid, {}),
      getAllProductOptions(product.uuid, {})
    ]).then(([variantsRes, optionsRes]) => {
      formData.variants = variantsRes.data.data;
      formData.options = optionsRes.data.data;

      setEditing(formData); // Đảm bảo setEditing sau khi có đủ dữ liệu
      setIsFormOpen(true);
    });
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      // setProducts(products.filter(p => p.id !== productToDelete.id));
      let payload = {
      "options": {
          "created": [],
          "updated": [],
          "deleted": productToDelete.options.map(item => item.uuid),
      },
      "variants": {
          "created":[],
          "updated": [],
          "deleted": productToDelete.variants.map(item => item.uuid),
      }
    }

    fetch(`http://localhost:8080/api/v1/products/${productToDelete.uuid}`, {
      method: "DELETE",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.status === 204) {
          return { code: 200, message: "Xoá sản phẩm thành công" }; // Tự mock lại
        }
        return res.json();
      })
      .then(({ code, message }) => {
        if (code === 200) {
          notification.success({ message: "Xoá sản phẩm thành công" });
        } else {
          notification.error({ message });
        }
      })
      .catch(() => notification.error({ message: "Lỗi kết nối server" }))
      .finally(() => {
        setIsDeleteOpen(false);
        setProductToDelete(null);
        fetchUsers()
      })
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
    fetchUsers();
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
        products={products} 
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