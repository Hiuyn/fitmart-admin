import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import DeleteConfirmation from '../DeleteConfirmation';

const Product = () => {
  // Dữ liệu mẫu
  const sampleProducts = [
    { 
      id: 1, 
      name: 'Giày đá bóng Nike Mercurial', 
      category: 'Giày', 
      price: 2500000, 
      stock: 15, 
      description: 'Giày đá bóng Nike Mercurial với công nghệ đệm Air, giúp tăng tốc độ và kiểm soát bóng tốt hơn trên mọi mặt sân.',
      image: 'https://example.com/nike-mercurial.jpg' 
    },
    { 
      id: 2, 
      name: 'Áo thể thao Adidas', 
      category: 'Quần áo', 
      price: 850000, 
      stock: 30, 
      description: 'Áo thể thao Adidas được làm từ chất liệu thấm hút mồ hôi tốt, thoáng khí và co giãn 4 chiều, phù hợp với mọi hoạt động thể thao.',
      image: 'https://example.com/adidas-shirt.jpg' 
    },
    { 
      id: 3, 
      name: 'Bóng rổ Spalding', 
      category: 'Dụng cụ', 
      price: 750000, 
      stock: 20, 
      description: 'Bóng rổ Spalding chính hãng, kích thước chuẩn, có độ bám tốt và khả năng nảy cao, được sử dụng trong các giải đấu chuyên nghiệp.',
      image: 'https://example.com/spalding-ball.jpg' 
    },
    { 
      id: 4, 
      name: 'Găng tay tập gym', 
      category: 'Phụ kiện', 
      price: 350000, 
      stock: 40, 
      description: 'Găng tay tập gym giúp bảo vệ lòng bàn tay khỏi các vết chai và tránh trơn trượt khi tập luyện với các thiết bị nặng.',
      image: 'https://example.com/gym-gloves.jpg' 
    },
    { 
      id: 5, 
      name: 'Vợt tennis Wilson', 
      category: 'Dụng cụ', 
      price: 1800000, 
      stock: 10, 
      description: 'Vợt tennis Wilson với thiết kế cân bằng hoàn hảo, giúp tăng lực đánh và độ chính xác cho người chơi ở mọi cấp độ.',
      image: 'https://example.com/wilson-racket.jpg' 
    },
  ];

  const [products, setProducts] = useState(sampleProducts);
  const [editing, setEditing] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="dashboard">
      <h1>Quản lý sản phẩm thể thao</h1>a
      
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

      {isFormOpen && (
        <ProductForm 
          product={editing} 
          onSave={handleSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}

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