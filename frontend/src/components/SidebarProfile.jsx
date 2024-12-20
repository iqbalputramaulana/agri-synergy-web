import React from 'react';
import { FaUser, FaShoppingCart, FaTruck, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/SidebarProfile.css';

function Sidebar({ setActivePage }) {
  const navigate = useNavigate(); // Inisialisasi navigate

  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // Hapus token autentikasi
    localStorage.removeItem('role'); // Hapus data role jika ada
    navigate('/login'); // Arahkan ke halaman login
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-option sidebar-profile" onClick={() => setActivePage('profile')}>
        <FaUser className="sidebar-icon icon-profile" />
        <span>Profile</span>
      </div>
      <div className="sidebar-option sidebar-order-history" onClick={() => setActivePage('orderHistory')}>
        <FaShoppingCart className="sidebar-icon icon-order-history" />
        <span>Riwayat Pembelian</span>
      </div>
      <div className="sidebar-option sidebar-dropshipper" onClick={() => setActivePage('dropshipper')}>
        <FaTruck className="sidebar-icon icon-dropshipper" />
        <span>Dropshipper</span>
      </div>
      <div className="sidebar-option sidebar-logout" onClick={handleLogout}>
        <FaSignOutAlt className="sidebar-icon icon-logout" />
        <span>Logout</span>
      </div>
    </div>
  );
}

export default Sidebar;
