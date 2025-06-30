import React, { useState, useEffect } from 'react';
import UploadImage from '../common/UploadImage';
import {notification} from 'antd'

const UserForm = ({ user, onSave, onCancel }) => {

  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    role: '',
    avatar_url: '',
    permissions: [],
    metadata: {},
    password: '',
  });
  const [image, setImage] = useState([])
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        uuid: user.uuid,
        user_name: user.user_name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url || '',
        password: user.password,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.user_name) {
      newErrors.user_name = 'Họ tên không được để trống';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.role) {
      newErrors.role = 'Vai trò không được để trống';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const formDataImage = new FormData()
      formDataImage.append('file', image[0]?.file)

      fetch(`http://localhost:8080/api/v1/uploads`, {
        method: 'POST',
        body: formDataImage,
      }).then(response => {
        return response.json(); // Phải gọi để lấy body JSON thực tế
      })
      .then(data => {
        if (data.code === 200) {
          onSave({...formData, avatar_url: data.data})
          notification.success({ message: 'Cập nhật thành công' })
        } else {
          notification.error({ message: data.message })
        }
      }).catch(err => notification.error({ message: err.message }))
    }
  };

  const roles = ['Admin', 'Nhân viên', 'Khách hàng'];
  const statuses = ['Hoạt động', 'Bị khóa', 'Chờ xác nhận'];

  return (
    <div className="modal-overlay">
      <div className="user-form-modal">
        <h2>{user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Họ tên:</label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              className={errors.user_name ? 'error' : ''}
            />
            {errors.user_name && <div className="error-message">{errors.user_name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="name">Mật khẩu:</label>
            <input
              type="text"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Vai trò:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={errors.role ? 'error' : ''}
            >
              <option value="">-- Chọn vai trò --</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            {errors.role && <div className="error-message">{errors.role}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="avatar_url">URL ảnh đại diện:</label>
            {/* <input
              type="text"
              id="avatar_url"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
            /> */}
            <UploadImage value={formData.avatar_url} setImage={(file) => {
              setImage(file)
            }}/>
          </div>

          

          {/* {formData.avatar_url ? (
            <div className="image-preview">
              <img 
                src={formData.avatar_url} 
                alt="Xem trước"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.parentNode.innerHTML = '<div class="avatar-placeholder large"><i class="fas fa-question"></i></div>';
                }}
              />
            </div>
          ) : (
            <div className="image-preview">
              <div className="avatar-placeholder large">
                <i className="fas fa-question"></i>
              </div>
            </div>
          )} */}
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Hủy
            </button>
            <button type="submit" className="save-button">
              {user ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm; 