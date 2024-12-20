import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/header.css";
import logo from "../assets/AGRI_SYNERGY.png";
import profile from "../assets/header/profileicon.png";
import market from "../assets/header/marketicon.png";
import notification from "../assets/header/notificationicon.png";

const Header = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // State untuk menu dan dropdown
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // State untuk data
  const [role, setRole] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartNotivCount, setCartNotivCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // Toggle Menu dan Dropdown
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);
  const toggleNotificationDropdown = () => setIsNotificationOpen(!isNotificationOpen);

  // Fetch data cart
  const fetchCartItems = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get("http://localhost:3000/api/keranjang");
      setCartItemCount(response.data.data.length);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItemCount(0);
    }
  };

  // fetch kategori
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/kategori", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      if (response.data?.data) {
        setCategories(response.data.data);
      }

      const storedRole = localStorage.getItem("role");
      if (storedRole) {
        setRole(storedRole);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch data notifikasi
  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/kalender");
      setNotifications(response.data.data);
      setCartNotivCount(response.data.data.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setCartNotivCount(0);
    }
  };

  // Fetch data saat komponen pertama kali dirender
  useEffect(() => {
    fetchCartItems();
    fetchNotifications();
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".nav");
      if (navbar) {
        if (window.scrollY > 0) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="nav" id="navbar">
      <div className="logos">
        <img src={logo} alt="Logo" />
      </div>

      <nav>
        <ul>
          <li>
            <a href="#" onClick={() => navigate("/")}>HOME</a>
          </li>
          <li>
            <a href="#" onClick={() => navigate("/market")}>MARKET</a>
          </li>
          <li>
            <a href="#" onClick={() => navigate("/konsultasi")}>KONSULTASI</a>
          </li>
          <li>
            <a onClick={toggleDropdown} className="explore-button">
              <span className="explore-text">JELAJAH</span>
              <span className="explore-icon">
                {dropdownVisible ? "▲" : "▼"}
              </span>
            </a>
            {dropdownVisible && (
              <div className="unique-dropdown-menu">
                {role === "pembeli" && (
                  <a href="#" onClick={() => navigate("/orderhistory")}>Order History</a>
                )}
                {(role === "petani" || role === "admin" || role === "tengkulak" || role === "ahli") && (
                  <>
                    <a href="#" onClick={() => navigate("/calendar")}>KALENDER</a>
                    <a href="#" onClick={() => navigate("/petalahan")}>PETA LAHAN</a>
                    <a href="#" onClick={() => navigate("/community")}>FORUM KOMUNITAS</a>

                    {(role === "admin" || role === "tengkulak" || role === "petani") && (
                      <a href="#" onClick={() => navigate("/kategori")}>
                        {role === "admin" ? "ADMIN PAGE" : "PETANI PAGE"}
                      </a>
                    )}
                  </>
                )}
              </div>
            )}

          </li>
        </ul>

        <div className="icon">
          <button className="hamburger" onClick={toggleMenu}>
            ☰
          </button>

          <div className={`icon-container ${isMenuOpen ? "open" : "closed"}`}>
            {/* Market Icon */}
            <div className="icon-wrapper" onClick={() => navigate("/cart")}>
              <img src={market} alt="Market Icon" />
              {cartItemCount > 0 && <span className="badge">{cartItemCount}</span>}
            </div>

            {/* Notification Icon */}
            <div className="icon-wrapper" onClick={toggleNotificationDropdown}>
              <img src={notification} alt="Notification Icon" />
              {cartNotivCount > 0 && <span className="badge">{cartNotivCount}</span>}
              {isNotificationOpen && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">Notifikasi Kalender</div>
                  {notifications.length > 0 ? (
                    notifications.map((kalender, index) => (
                      <div key={index} className="notification-item">
                        <strong>{kalender.judul}</strong>
                        <p>{kalender.deskripsi}</p>
                        <small>{kalender.tanggal}</small>
                      </div>
                    ))
                  ) : (
                    <div className="no-notifications">Tidak ada notifikasi</div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Icon */}
            <div className="icon-wrapper" onClick={() => navigate("/login")}>
              <img src={profile} alt="Profile Icon" />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
