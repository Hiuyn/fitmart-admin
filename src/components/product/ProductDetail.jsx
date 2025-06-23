import React from 'react';
import { useParams } from 'react-router-dom';


const ProductDetail = () => {
  const { id } = useParams(); // gets the ":id" from the URL

  return (
    <div className="dashboard">
      <h1>Chi tiết sản phẩm: </h1>
      <p>ID: {id}</p>
      
    </div>
  );
};

export default ProductDetail; 