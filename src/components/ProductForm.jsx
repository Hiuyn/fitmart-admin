import React, { useState, useEffect, useRef } from 'react';

const ProductForm = ({ product, onSave, onCancel }) => {
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    id: product ? product.id : null,
    name: '',
    category: '',
    price: 0,
    stock: 0,
    description: '',
    image: ''
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description || '',
        image: product.image
      });
      setImagePreview(product.image);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên sản phẩm không được để trống';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Danh mục không được để trống';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }
    
    if (formData.stock < 0) {
      newErrors.stock = 'Số lượng không được âm';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const priceFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  });

  const categories = [
    'Giày', 'Quần áo', 'Dụng cụ', 'Phụ kiện', 'Thiết bị tập luyện'
  ];

  return (
    <div className="modal-overlay">
      <div className="product-form-modal">
        <h2>{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tên sản phẩm:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Danh mục:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <div className="error-message">{errors.category}</div>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Giá:</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <div className="error-message">{errors.price}</div>}
              {formData.price > 0 && (
                <div className="formatted-price">
                  {priceFormatter.format(formData.price)}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="stock">Số lượng:</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={errors.stock ? 'error' : ''}
              />
              {errors.stock && <div className="error-message">{errors.stock}</div>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Mô tả sản phẩm:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={errors.description ? 'error' : ''}
            ></textarea>
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>
          
          <div className="form-group">
            <label>Hình ảnh sản phẩm:</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <div className="file-upload-container">
              <button 
                type="button" 
                className="file-upload-button"
                onClick={triggerFileInput}
              >
                <i className="fas fa-upload"></i> Chọn ảnh từ máy tính
              </button>
              <span className="file-name">
                {imagePreview ? 'Đã chọn ảnh' : 'Chưa chọn ảnh nào'}
              </span>
            </div>

            {imagePreview && (
              <div className="image-preview">
                <img 
                  src={imagePreview} 
                  alt="Xem trước"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentNode.innerHTML = '<div class="image-placeholder"><i class="fas fa-image"></i></div>';
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Hủy
            </button>
            <button type="submit" className="save-button">
              {product ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm; 