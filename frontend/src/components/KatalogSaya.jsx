// File: KatalogSaya.jsx
import React from 'react';
import Header from './Header';
import Footer from './footer';
import Sidebar from './Sidebar';
import '../css/KatalogSaya.css';

const KatalogSaya = () => {
  return (
    <div className="katalog-page">
      <Header />
      <div className="katalog-content">
        <Sidebar />
        <div className="katalog-container">
          <h2>Katalog Saya</h2>
          <div className="banner">
            <h3>Mulai bisnis online dan jadilah penjual dropshipper di</h3>
            <h3 className="highlight">AGRI SYNERGY</h3>
            <ul>
              <li>Dapatkan keuntungan hingga jutaan rupiah per bulan</li>
              <li>Tidak ada biaya awal</li>
              <li>Tidak ada manajemen inventaris</li>
            </ul>
          </div>
          <div className="chat-section">
            <div className="chat-box">
              Hi! I want to buy the ID 00235,<br />
              I will pay by cash
            </div>
            <img
              src="/images/sample-product.jpg"
              alt="Sample Product"
              className="product-image"
            />
          </div>
          <button className="explore-button">Mulai Eksplor Katalog Saya</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default KatalogSaya;
