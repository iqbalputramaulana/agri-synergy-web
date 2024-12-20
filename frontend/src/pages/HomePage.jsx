import React, { useEffect, useState } from "react";
import logo1 from "../assets/AGRI_SYNERGY.png";
import "../css/homepage.css";
import profile from "../assets/profileicon.png";
import market from "../assets/marketicon.png";
import notification from "../assets/notificationicon.png";
import bcurve from "../assets/Rectangle-1.png";
import bcurve2 from "../assets/Rectangle_2.png";
import trophy from "../assets/Trophy.png";
import creditcard from "../assets/CreditCard.png";
import headphone from "../assets/Headphones.png";
import pic1 from "../assets/background_5.jpg";
import pic2 from "../assets/background_4.jpg";
import pic3 from "../assets/background_3.jpg";
import ProductCard from "../components/ProductCard";
import plant from "../assets/plant.png";
import bag from "../assets/bag.png";
import corn from "../assets/corn.png";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const testimonials = [
  {
    image: "src/assets/testimoni/profile1.png",
    text: "Platform ini memudahkan pengelolaan lahan dan penjualan jagung langsung ke pasar",
    name: "Yanto, Petani Jagung",
  },
  {
    image: "src/assets/testimoni/profile2.png",
    text: "Prediksi harga dan cuaca sangat membantu dalam perencanaan tanam",
    name: "Budi, Petani Jagung",
  },
  {
    image: "src/assets/testimoni/profile3.png",
    text: "Kami bisa terhubung dengan pembeli lebih mudah dan cepat",
    name: "Siti, Distributor Pertanian",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [role, setRole] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartNotivCount, setCartNotivCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const toggleNotificationDropdown = () => setIsNotificationOpen(!isNotificationOpen);

  const checkAuthentication = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get("http://localhost:3000/api/produk", {
        validateStatus: (status) => status < 500,
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("jwtToken");
        navigate("/");
        return;
      }

      if (response.data?.token) {
        localStorage.setItem("jwtToken", response.data.token);
      }

      if (response.data?.data) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error validating token:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("jwtToken");
        navigate("/");
      }
    }
  };

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

  const feacthCartItems = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/keranjang");
      setCartItemCount(response.data.data.length);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItemCount(0);
    }
  };

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

  useEffect(() => {
    checkAuthentication();
    fetchCategories();
    feacthCartItems();
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector(".navi");
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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <section className="scroll">
      <div className="navi" id="navbar">
        <div className="logow">
          <img src={logo1} alt="Logo" />
        </div>

        <nav>
          <ul>
            <li className="float-in">
              <a href="#" className="" onClick={() => navigate("/")}>
                HOME
              </a>
            </li>
            <li className="float-in">
              <a href="#" className="" onClick={() => navigate("/market")}>
                MARKET
              </a>
            </li>
            <li className="float-in">
              <a href="#" className="" onClick={() => navigate("/konsultasi")}>
                KONSULTASI
              </a>
            </li>
            <li className="float-in">
              <a onClick={toggleDropdown} className="explore-button">
                JELAJAH {dropdownVisible ? "▲" : "▼"}
              </a>
              {dropdownVisible && (
                <div className="unique-dropdown-menu">
                  {role === "pembeli" && (
                    <a href="#" onClick={() => navigate("/orderhistory")}>Order History</a>
                  )}

                  {(role === "petani" || role === "admin" || role === "tengkulak") && (
                    <>
                      <a href="#" onClick={() => navigate("/calendar")}>KALENDER</a>
                      <a href="#" onClick={() => navigate("/petalahan")}>PETA LAHAN</a>
                      <a href="#" onClick={() => navigate("/community")}>FORUM KOMUNITAS</a>
                      <a href="#" onClick={() => navigate("/kategori")}>Petani Page</a>
                    </>
                  )}
                </div>
              )}

            </li>
          </ul>
          <div className="icon">
            <div className="icon-wrapper">
              <img
                src={market}
                alt="Market Icon"
                onClick={() => navigate("/cart")}
              />
              {localStorage.getItem("jwtToken") && cartItemCount > 0 && (
                <span className="badge">{cartItemCount}</span>
              )}
            </div>
            <div className="icon-wrapper" onClick={toggleNotificationDropdown}>
              <img src={notification} alt="Notification Icon" />
              {cartNotivCount > 0 && <span className="badge">{cartNotivCount}</span>}
              {isNotificationOpen && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">Notifikasi</div>
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
            <div className="icon-wrapper">
              <img
                src={profile}
                alt="Profile Icon"
                onClick={() => navigate("/login")}
              />
            </div>
          </div>
        </nav>
      </div>
      <div id="main-containers">
        <div className="main-contents">
          <h1>Mempermudah Pengelolaan dan Pemasaran Jagung Anda</h1>
          <h2>
            Meningkatkan produktivitas pertanian dan memperluas akses pasar
            melalui solusi digital yang terintegrasi
          </h2>
          <div className="imgcurve">
            <img src={bcurve2} alt="bcurve" />
          </div>

          {/* info bar */}
          <div className="info-bar">
            <div className="info-item">
              <img src={trophy} alt="info" className="info-icon" />
              <div className="info-text">
                <h4>RETUR 24 JAM</h4>
                <p>Jaminan uang kembali 100%</p>
              </div>
            </div>

            <div className="info-item">
              <img src={creditcard} alt="info" className="info-icon" />
              <div className="info-text">
                <h4>PEMBAYARAN AMAN</h4>
                <p>Uang Anda aman</p>
              </div>
            </div>

            <div className="info-item">
              <img src={headphone} alt="info" className="info-icon" />
              <div className="info-text">
                <h4>DUKUNGAN 24/7</h4>
                <p>Kontak/ pesan langsung</p>
              </div>
            </div>
          </div>

          <div className="aboutus-container">
            {/* Left Section */}
            <div className="aboutus-content">
              <p className="aboutus-title">Tentang Kami</p>
              <p className="aboutus-description">
                Kami adalah platform digital yang membantu petani jagung
                mengelola lahan dan memasarkan hasil panen secara langsung tanpa
                perantara. Dengan teknologi berbasis data, kami menyediakan
                solusi yang efisien dan mudah digunakan untuk meningkatkan
                produktivitas serta memperluas akses pasar. Visi kami adalah
                mendukung petani jagung mencapai hasil terbaik dan meningkatkan
                kesejahteraan mereka secara berkelanjutan.
              </p>
              <p className="aboutus-highlight">
                Dengan teknologi berbasis data, kami menyediakan solusi yang
                efisien dan mudah digunakan untuk meningkatkan produktivitas
                serta memperluas akses pasar. Visi kami adalah mendukung petani
                jagung mencapai hasil terbaik dan meningkatkan kesejahteraan
                mereka secara berkelanjutan.
              </p>
              <p className="aboutus-highlight">
                Ingin menjadi pengembang pertanian berbasis digital dengan kami?{" "}
                <br />
                Silakan hubungi contact person: +62 858-4828-2072 (Alex
                Darmawan)
              </p>
            </div>

            {/* Right Section */}
            <div className="aboutus-images">
              <img
                src={pic1}
                alt="Field of corn"
                className="aboutus-image-main"
              />
              <div className="aboutus-image-grid">
                <img
                  src={pic2}
                  alt="Farmer in corn field"
                  className="aboutus-image-secondary pic2"
                />
                <img
                  src={pic3}
                  alt="Farmer using tablet"
                  className="aboutus-image-secondary"
                />
              </div>
            </div>
          </div>

          {/* product showcase  */}
          <div className="product-showcase">
            <p className="title-product-showcase">BEST PRODUCT</p>
            <p className="subtitle-product-showcase">
              Produk Jagung Terbaik Langsung dari Petani
            </p>
            <div className="product-grid">
              {products.map((product, index) => (
                <ProductCard
                  key={index}
                  image={`http://localhost:3000/api/fileProduk/${product.foto_produk}`}
                  title={product.nama}
                  price={product.harga}
                  stock={product.kuantitas}
                />
              ))}
            </div>
            <div className="see-more-container">
              <button className="see-more" onClick={() => navigate("/market")}>
                See More..
              </button>
            </div>
          </div>

          {/* analitic and static */}

          <div className="agri-analytics-container">
            <p className="agri-title">ANALYTICS AND STATISTICS</p>
            <p className="agri-description">
              Dapatkan wawasan mendalam tentang pertanian Anda untuk pengambilan
              keputusan yang lebih baik
            </p>
            <div className="rectangele"></div>
            <div className="agri-cards-container">
              <div className="agri-card">
                <div className="agri-icon">
                  <img src={plant} alt="icon" />
                </div>
                <h3 className="agri-card-title">Pertumbuhan Tanaman</h3>
                <p className="agri-card-text">
                  Lacak perkembangan lahan dan kondisi tanaman Anda dari awal
                  tanam hingga panen, serta dapatkan prediksi cuaca yang akurat.
                </p>
                <div className="rectangele2"></div>
              </div>
              <div className="agri-card">
                <div className="agri-icon">
                  <img src={bag} alt="icon" />
                </div>
                <h3 className="agri-card-title">Prediksi Harga Pasar</h3>
                <p className="agri-card-text">
                  Analisis harga pasar terkini dan prediksi tren untuk
                  menentukan waktu terbaik dalam menjual hasil panen Anda.
                </p>
                <div className="rectangele3"></div>
              </div>
              <div className="agri-card">
                <div className="agri-icon">
                  <img src={corn} alt="icon" />
                </div>
                <h3 className="agri-card-title">Laporan Hasil Panen</h3>
                <p className="agri-card-text">
                  Akses data hasil panen dan produktivitas lahan untuk
                  merencanakan musim tanam.
                </p>
                <div className="rectangele4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="testimonials-section"
        style={{ backgroundImage: "url(src/assets/testimoni/bgtestimoni.jpg)" }}
      >
        <h2 className="testimonials-title">Testimonial</h2>
        <div className="testimonials-container">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="testimonial-image"
              />
              <p className="testimonial-text">{testimonial.text}</p>
              <p className="testimonial-name">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
      <div className="containers">
        <img src={bcurve} alt="" className="image-curve" />
      </div>
    </section>
  );
};

export default HomePage;
