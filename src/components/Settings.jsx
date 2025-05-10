import React, { useState } from 'react';

const Settings = ({ settings, updateSettings }) => {
  const [formData, setFormData] = useState({
    ...settings
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
    alert('Cài đặt đã được lưu!');
  };

  return (
    <div className="settings">
      <h1>Cài đặt hệ thống</h1>
      
      <div className="settings-container">
        <form onSubmit={handleSubmit}>
          <div className="settings-section">
            <h2>Giao diện</h2>
            
            <div className="setting-item">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="darkMode"
                  checked={formData.darkMode}
                  onChange={handleChange}
                />
                <span className="toggle-slider"></span>
              </label>
              <div className="setting-description">
                <h3>Chế độ tối</h3>
                <p>Bật chế độ tối để giảm mỏi mắt khi làm việc vào ban đêm</p>
              </div>
            </div>
            
            <div className="setting-item">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="compactSidebar"
                  checked={formData.compactSidebar}
                  onChange={handleChange}
                />
                <span className="toggle-slider"></span>
              </label>
              <div className="setting-description">
                <h3>Sidebar thu gọn mặc định</h3>
                <p>Tự động thu gọn sidebar khi mở ứng dụng</p>
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-input">
                <label htmlFor="primaryColor">Màu chủ đạo:</label>
                <div className="color-picker">
                  <input
                    type="color"
                    id="primaryColor"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                  />
                  <span>{formData.primaryColor}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h2>Hiển thị dữ liệu</h2>
            
            <div className="setting-item">
              <div className="setting-input">
                <label htmlFor="itemsPerPage">Số mục hiển thị mỗi trang:</label>
                <select
                  id="itemsPerPage"
                  name="itemsPerPage"
                  value={formData.itemsPerPage}
                  onChange={handleChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
            
            <div className="setting-item">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="showThumbnails"
                  checked={formData.showThumbnails}
                  onChange={handleChange}
                />
                <span className="toggle-slider"></span>
              </label>
              <div className="setting-description">
                <h3>Hiển thị hình ảnh thu nhỏ</h3>
                <p>Hiển thị hình ảnh thu nhỏ trong danh sách sản phẩm</p>
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h2>Thông báo</h2>
            
            <div className="setting-item">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                />
                <span className="toggle-slider"></span>
              </label>
              <div className="setting-description">
                <h3>Nhận thông báo qua email</h3>
                <p>Gửi email khi có đơn hàng mới hoặc sản phẩm sắp hết hàng</p>
              </div>
            </div>
            
            <div className="setting-item">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="desktopNotifications"
                  checked={formData.desktopNotifications}
                  onChange={handleChange}
                />
                <span className="toggle-slider"></span>
              </label>
              <div className="setting-description">
                <h3>Thông báo trên màn hình</h3>
                <p>Hiển thị thông báo trên màn hình khi có cập nhật mới</p>
              </div>
            </div>
          </div>
                    
          <div className="settings-actions">
            <button type="reset" className="cancel-button" onClick={() => setFormData({...settings})}>
              Khôi phục mặc định
            </button>
            <button type="submit" className="save-button">
              Lưu cài đặt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings; 