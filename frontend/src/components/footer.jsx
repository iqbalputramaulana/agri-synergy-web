import React from 'react';
import '../css/footer.css';
import logo from '../assets/AGRI_SYNERGY.png'; 
import youtube from '../assets/youtube.png';
import facebook from '../assets/facebook.png';
import twitter from '../assets/twitter.png';
import instagram from '../assets/instagram.png';
import linkedin from '../assets/linkedin.png';
import { useNavigate } from "react-router-dom"

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Left section with description and contact */}
        <div className="footer-section">
          <h4>AGRI SYNERGY</h4>
          <p>
            Platform kami bertujuan untuk memudahkan akses informasi dan layanan terkait agribisnis.
            Dengan komunitas yang kuat dan sumber daya yang terpercaya.
          </p>
          <div className="social-icons">
            <a href="#"><img src={youtube} alt="YouTube Icon" className="social-icon" /></a>
            <a href="#"><img src={facebook} alt="Facebook Icon" className="social-icon" /></a>
            <a href="#"><img src={twitter} alt="Twitter Icon" className="social-icon" /></a>
            <a href="#"><img src={instagram} alt="Instagram Icon" className="social-icon" /></a>
            <a href="#"><img src={linkedin} alt="LinkedIn Icon" className="social-icon" /></a>
          </div>
          <p>Contact Person: +62 858-4828-2072</p>
        </div>

        {/* Middle section with Home links */}
        <div className="footer-section">
          <h4>Home</h4>
          <ul>
            <li><a href="#">Tentang kami</a></li>
            <li><a href="#">Best Seller</a></li>
            <li><a href="#">Analisis</a></li>
            <li><a href="#">Testimoni</a></li>
          </ul>
        </div>

        {/* Right section with Layanan links */}
        <div className="footer-section">
          <h4>Layanan</h4>
          <ul>
            <li><a href="#" onClick={()=> navigate('/calendar')}>Kalender</a></li>
            <li><a href="#" onClick={()=> navigate('/petalahan')}>Peta Lahan</a></li>
            <li><a href="#" onClick={()=> navigate('/community')}>Forum Komunitas</a></li>
          </ul>
        </div>
      </div>

      {/* Logo section on the far right */}
      <div className="footer-logo-container">
        <img src={logo} alt="Agri Synergy Logo" className="footer-logo" />
      </div>
      
      <div className="footer-bottom">
        <p>Agri Synergy © 2024. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
