import React, { useState, useEffect } from 'react';
import UploadImage from '../common/UploadImage';
import { notification } from 'antd';

const AccountForm = ({ account, onSave, onCancel }) => {

  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    avatar_url: '',
    metadata: {},
    password: '',
    address: "",
    phone: "",
  });

const [image, setImage] = useState([])

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (account) {
      setFormData({
        uuid: account.uuid,
        user_name: account.user_name,
        email: account.email,
        avatar_url: account.avatar_url || '',
        password: account.password,
      });
    }
  }, [account]);

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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (validateForm()) {
      if (image[0]?.file) {
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
      } else {
        onSave(formData)
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="user-form-modal">
        <h2>{account ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}</h2>
        
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
            <label htmlFor="address">Địa chỉ:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Số điện thoại:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
            />
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
              {account ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm; 