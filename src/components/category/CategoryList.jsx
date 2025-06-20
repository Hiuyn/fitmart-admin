import React, { useState } from 'react';

const CategoryList = ({ categories, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCategories = [...categories].sort((a, b) => {
    if (sortField === 'description' || sortField === 'stock' || sortField === 'id') {
      return sortDirection === 'asc' 
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    } else {
      const aValue = typeof a[sortField] === 'string' ? a[sortField] : String(a[sortField]);
      const bValue = typeof b[sortField] === 'string' ? b[sortField] : String(b[sortField]);
      
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
  });

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '▲' : '▼';
  };

  return (
    <div className="product-list">
      <table>
        <thead>
          <tr>
            <th className='id-row' onClick={() => handleSort('id')}>ID {getSortIcon('id')}</th>
            <th onClick={() => handleSort('title')}>Tên danh mục {getSortIcon('title')}</th>
            <th onClick={() => handleSort('description')}>Mô tả {getSortIcon('description')}</th>
            <th className='action-row'>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {sortedCategories.length > 0 ? (
            sortedCategories.map(category => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>
                  <div className='product'>
                    {category.title}
                  </div>
                </td>
                <td>{category.description}</td>
                <td className="actions">
                  <div>
                    <button className="edit-button" onClick={() => onEdit(category)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="delete-button" onClick={() => onDelete(category)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">Không có sản phẩm nào</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList; 