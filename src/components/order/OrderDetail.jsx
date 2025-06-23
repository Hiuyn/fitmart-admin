import React from 'react';
import { useParams } from 'react-router-dom';


const OrderDetail = () => {
  const { id } = useParams(); // gets the ":id" from the URL

  return (
    <div className="dashboard">
      <h1>Chi tiết giỏ hàng: </h1>
      <p>ID: {id}</p>
      
    </div>
  );
};

export default OrderDetail; 