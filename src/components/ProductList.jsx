import React, { useState, useEffect } from 'react';

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

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/products') // Thay bằng API thật
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error('Lỗi khi gọi API:', error));
  }, []);

  return (
    <div className="product-list">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID {getSortIcon('id')}</th>
            <th>Hình ảnh</th>
            <th onClick={() => handleSort('name')}>Tên sản phẩm {getSortIcon('name')}</th>
            <th onClick={() => handleSort('category')}>Danh mục {getSortIcon('category')}</th>
            <th onClick={() => handleSort('price')}>Giá {getSortIcon('price')}</th>
            <th onClick={() => handleSort('stock')}>Tồn kho {getSortIcon('stock')}</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.length > 0 ? (
            sortedProducts.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  {/* <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-thumbnail"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/50';
                    }}
                  /> */}
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{formatPrice(product.price)}</td>
                <td>{product.stock}</td>
                <td className="actions">
                  <button className="edit-button" onClick={() => onEdit(product)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="delete-button" onClick={() => onDelete(product)}>
                    <i className="fas fa-trash"></i>
                  </button>
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
      <div>
        {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Đang tải...'}
      </div>
    </div>
  );
};

export default ProductList; 