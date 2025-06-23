import React, { useState } from 'react';

const ProductList = ({ products, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortField === 'price' || sortField === 'stock' || sortField === 'id') {
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
            <th className='image-row'>Hình ảnh</th>
            <th onClick={() => handleSort('name')}>Tên sản phẩm {getSortIcon('name')}</th>
            <th onClick={() => handleSort('category')}>Danh mục {getSortIcon('category')}</th>
            <th onClick={() => handleSort('price')}>Giá {getSortIcon('price')}</th>
            <th onClick={() => handleSort('stock')}>Tồn kho {getSortIcon('stock')}</th>
            <th className='action-row'>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.length > 0 ? (
            sortedProducts.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-thumbnail"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/object_cube.png';
                    }}
                  />
                </td>
                <td>
                  <div className='product'>
                    {product.name}
                  </div>
                </td>
                <td>{product.category}</td>
                <td>{formatPrice(product.price)}</td>
                <td>{product.stock}</td>
                <td className="actions">
                  <div>
                    <button className="edit-button" onClick={() => onEdit(product)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="delete-button" onClick={() => onDelete(product)}>
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

export default ProductList; 