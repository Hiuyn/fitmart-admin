import React, { useState, useEffect } from 'react';

const CategoryForm = ({ category, onSave, onCancel }) => {

  const [formData, setFormData] = useState({
      uuid: "",
      title: "",
      description: "",
      handle: "",
      rank: "",
      is_active: false,
      parent_category_id: "",
  });



  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        uuid: category.uuid,
        title: category.title,
        description: category.description,
        handle: category.handle,
        rank: category.rank,
        is_active: category.is_active,
        parent_category_id: category.parent_category_id,
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title) {
      newErrors.title = 'Tên không được để trống';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
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

  return (
    <div className="modal-overlay">
      <div className="user-form-modal">
        <h2>{category ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tên:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="name">Mật khẩu:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="handle">Handle:</label>
            <input style={{width: '40px'}}
              type="text"
              id="handle"
              name="handle"
              value={formData.handle}
              onChange={handleChange}
              className={errors.handle ? 'error' : ''}
            />
            {errors.handle && <div className="error-message">{errors.handle}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="rank">Rank:</label>
            <input style={{width: '40px'}}
              type="text"
              id="rank"
              name="rank"
              value={formData.rank}
              onChange={handleChange}
              className={errors.rank ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="handle">Is active:</label>
            <input style={{width: '40px'}}
              type="checkbox"
              id="is_active"
              name="is_active"
              value={formData.is_active}
              onChange={handleChange}
              className={errors.is_active ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="parent_category_id">Parent Category Id:</label>
            <input style={{width: '40px'}}
              type="text"
              id="parent_category_id"
              name="parent_category_id"
              value={formData.parent_category_id}
              onChange={handleChange}
              className={errors.parent_category_id ? 'error' : ''}
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Hủy
            </button>
            <button type="submit" className="save-button">
              {category ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm; 