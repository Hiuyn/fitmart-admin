import React, { useState, useEffect } from 'react';
import CategoryList from './CategoryList';
import CategoryForm from './CategoryForm';
import DeleteConfirmation from '../../components/DeleteConfirmation';

const Category = () => {
  // Dữ liệu mẫu
  const sampleCategories = [
    { 
      id: 1, 
      title: 'Giày đá bóng Nike Mercurial', 
      description: 'Giày đá bóng Nike Mercurial với công nghệ đệm Air, giúp tăng tốc độ và kiểm soát bóng tốt hơn trên mọi mặt sân.',
    },
    { 
      id: 2, 
      title: 'Áo thể thao Adidas', 
      stock: 30, 
      description: 'Áo thể thao Adidas được làm từ chất liệu thấm hút mồ hôi tốt, thoáng khí và co giãn 4 chiều, phù hợp với mọi hoạt động thể thao.',
      image: 'https://example.com/adidas-shirt.jpg' 
    },
    { 
      id: 3, 
      title: 'Bóng rổ Spalding', 
      description: 'Bóng rổ Spalding chính hãng, kích thước chuẩn, có độ bám tốt và khả năng nảy cao, được sử dụng trong các giải đấu chuyên nghiệp.',
    },
    { 
      id: 4, 
      title: 'Găng tay tập gym', 
      description: 'Găng tay tập gym giúp bảo vệ lòng bàn tay khỏi các vết chai và tránh trơn trượt khi tập luyện với các thiết bị nặng.',
    },
    { 
      id: 5, 
      title: 'Vợt tennis Wilson', 
      description: 'Vợt tennis Wilson với thiết kế cân bằng hoàn hảo, giúp tăng lực đánh và độ chính xác cho người chơi ở mọi cấp độ.',
    },
  ];

  const [categories, setCategories] = useState(sampleCategories);
  const [editing, setEditing] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const filteredCategories = categories.filter(category => 
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category) => {
    setEditing(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(p => p.id !== categoryToDelete.id));
      setIsDeleteOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleSave = (category) => {
    if (editing) {
      // Cập nhật sản phẩm
      setCategories(categories.map(p => p.id === category.id ? category : p));
    } else {
      // Thêm sản phẩm mới với ID tự động tăng
      const newId = Math.max(...categories.map(p => p.id), 0) + 1;
      setCategories([...categories, { ...category, id: newId }]);
    }
    setIsFormOpen(false);
    setEditing(null);
  };

  return (
    <div className="dashboard">
      <h1>Quản lý danh mục</h1>
      
      <div className="controls">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Tìm kiếm danh mục..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <button className="add-button" onClick={handleAddNew}>
          <i className="fas fa-plus"></i> Thêm danh mục
        </button>
      </div>

      <CategoryList 
        categories={filteredCategories} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {isFormOpen && (
        <CategoryForm 
          category={editing} 
          onSave={handleSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}

      {isDeleteOpen && (
        <DeleteConfirmation 
          category={categoryToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteOpen(false)}
        />
      )}
    </div>
  );
};

export default Category; 