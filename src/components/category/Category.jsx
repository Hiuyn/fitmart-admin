import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    fetchCategorys(); // Your API expects 1-based page numbers
  }, []);
  const [ready, setReady] = useState(false);
  const fetchCategorys = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:8080/api/v1/product-categories`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const filteredData = data.data.data.filter(product => product.deleted_at === null)

    setCategories(filteredData)
    setReady(true);
  };

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

  const confirmDelete = async () => {
    if (categoryToDelete) {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch(`http://localhost:8080/api/v1/product-categories/${categoryToDelete.uuid}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Category Deleted")

        setIsDeleteOpen(false);
        setCategoryToDelete(null);
        reloadData(token)
      } catch (error) {
        console.error('Error posting data:', error);
      }
      
      setIsFormOpen(false);
      setEditing(null);
    }
  };

  const handleSave = async (category) => {
    const token = localStorage.getItem('token');
    if (editing) {
      try {
        const res = await fetch(`http://localhost:8080/api/v1/product-categories/${category.uuid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(category),
        });

        alert("Category Updated")

        reloadData(token)
      } catch (error) {
        console.error('Error posting data:', error);
      }
    } else {
      try {
        const res = await fetch('http://localhost:8080/api/v1/product-categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(category),
        });

        alert("Category Created")

        reloadData(token)
      } catch (error) {
        console.error('Error posting data:', error);
      }
    }
    setIsFormOpen(false);
    setEditing(null);
  };

  const reloadData = async (token) => {
    const response = await fetch(`http://localhost:8080/api/v1/product-categories?created_at=-1&limit=25&q=&type=`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    const filteredData = data.data.data.filter(product => product.deleted_at === null)

    setCategories(filteredData)
  }

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
        categories={categories} 
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