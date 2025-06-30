import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CategoryForm from './CategoryForm';

const CategoryDetail = () => {
  const { id } = useParams(); // gets the ":id" from the URL

  const editing = true;
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = () => {
    setIsFormOpen(true);
  };

  const sampleCategory = {
    uuid: "FM9a7113c1",
    name: "think tran",
    email: "think@gmail.com",
    avatar_url: "",
    address: "",
    created_at: "2025-05-16T08:50:58.747Z",
    updated_at: "2025-05-16T08:50:58.747Z",
    deleted_at: null
  };


  const handleSave = (category) => {
    setIsFormOpen(false);
  };

  return (
    <div className="dashboard">
      <div>
        <h1>Chi tiết danh mục: </h1>
      
        <div className='detail-actions'>
          <button className="detail-edit-button" onClick={(e) => {e.stopPropagation(); handleEdit(sampleCategory)}} style={{display: 'flex', gap: '.5rem', paddingRight: '30px', paddingLeft: '30px'}}>
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
              <th>Tên danh mục</th>
              <td></td>
            </tr>
            <tr>
              <th>Nội dung</th>
              <td></td>
            </tr>
            <tr>
              <th>Handle</th>
              <td></td>
            </tr>
            <tr>
              <th>Đang hoạt động</th>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <CategoryForm 
          category={editing} 
          onSave={handleSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default CategoryDetail; 