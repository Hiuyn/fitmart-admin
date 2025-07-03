import React from 'react';

const DeleteConfirmation = ({ product, onConfirm, onCancel, message }) => {
  const defaultMessage = product ? 
    `Bạn có chắc chắn muốn xóa sản phẩm "${product.title}"?` : 
    'Bạn có chắc chắn muốn xóa mục này?';

  return (
    <div className="modal-overlay">
      <div className="delete-confirmation">
        <h3>Xác nhận xóa</h3>
        <p>{message || defaultMessage}</p>
        <p className="warning">Hành động này không thể hoàn tác!</p>
        
        <div className="confirm-actions">
          <button className="cancel-button" onClick={onCancel}>
            Hủy
          </button>
          <button className="delete-button" onClick={onConfirm}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation; 