import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import axios from 'axios';
import './Cardproduct.css';
// import { text } from 'framer-motion/client';

function ProductCard({ product }) {
  return (
    <div className="cardproduct">
      <div className="card-header">
        {product.productName}
      </div>
      <div className="card-body">
        <p>ProductCode Code: {product.productCode}</p>
        <p>Size: {product.size}</p>
        <p>SizeUnit: {product.sizeUnit}</p>
      </div>
    </div>
  );
}

function  ProductListcard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch data from API
    fetch('http://103.225.168.137/apiaccbk2/api/Prototype/Product/GetProduct')
      .then(response => response.json())
      // .then(data => setProducts(data));
      .then(data => {
        console.log('Received data:', data); // ตรวจสอบข้อมูลที่ได้รับ
        setProducts(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className='dashboard'>
      <h1 className='h1-pr'>Product list</h1>
      <div className="product-list">
        {products.map(product => (
          <ProductCard key={product.productID} product={product} />
        ))}
      </div>
    </div>

  );
}

export default ProductListcard;