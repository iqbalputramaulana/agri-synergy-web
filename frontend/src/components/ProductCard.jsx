// src/components/ProductCard.js
import React from 'react';
import '../css/homepage.css'


const ProductCard = ({ image, title, price, stock }) => {
  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-image" />
      <h3>{title}</h3>
      <p>⭐⭐⭐⭐⭐</p>
      <p>({stock} stock)</p>
        <p>{`Rp ${Number(price).toLocaleString('id-ID')}. -`}</p>
    </div>
  );
};

export default ProductCard;
