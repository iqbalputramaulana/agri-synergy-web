import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { provinsi, kabupaten } from "daftar-wilayah-indonesia";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./footer";
import PaymentModal from "./PaymentModal";
import "../css/Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const [keranjang, setKeranjang] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [users, setUsers] = useState({
    nama: '',
    email: '',
    alamat: '',
    no_hp: '',
    kodepos: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsers((prevUsers) => ({
      ...prevUsers,
      [name]: value,
    }));
  };

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const provincesData = await provinsi();
        const uniqueProvinces = provincesData
          .filter((province) => province && province.kode && province.nama)
          .map((province) => ({
            ...province,
            uniqueKey: `province-${province.kode}`,
          }));
        setProvinces(uniqueProvinces);
      } catch (error) {
        console.error("Error loading provinces:", error);
      }
    };

    loadProvinces();
  }, []);

  const handleProvinceChange = async (e) => {
    const selectedProvinceCode = e.target.value;
    setSelectedProvince(selectedProvinceCode);
    setSelectedCity("");

    try {
      const citiesData = await kabupaten(selectedProvinceCode);
      const uniqueCities = citiesData
        .filter((city) => city && city.kode && city.nama)
        .map((city) => ({
          ...city,
          uniqueKey: `city-${city.kode}`,
        }));
      setCities(uniqueCities);
    } catch (error) {
      console.error("Error loading cities:", error);
    }
  };

  // Cek Autentikasi
  const checkAuthentication = async () => {
    const token = localStorage.getItem("jwtToken");
    const idUser = localStorage.getItem("id_user");
    if (!token || !idUser) {
      navigate("/");
      return;
    }

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get("http://localhost:3000/api/keranjang", {
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
        setKeranjang(response.data.data);
      }
    } catch (err) {
      console.error("Error validating token:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("jwtToken");
        navigate("/");
      }
    }
  };

  const handleUsers = async () => {
    const idUser = localStorage.getItem("id_user");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/${idUser}`,
        {
          headers: {
            id_user: idUser,
          },
        }
      );
  
      if (response.data?.data) {
        const userData = response.data.data[0];
        setUsers({
          nama: userData.nama || '',
          email: userData.email || '',
          alamat: userData.alamat || '',
          no_hp: userData.no_hp || '',
          kodepos: userData.kodepos || ''
        });

        if (userData.provinsi) {
          setSelectedProvince(userData.provinsi);

          const citiesData = await kabupaten(userData.provinsi);
          const uniqueCities = citiesData
            .filter((city) => city && city.kode && city.nama)
            .map((city) => ({
              ...city,
              uniqueKey: `city-${city.kode}`,
            }));
          setCities(uniqueCities);

          if (userData.kota) {
            setSelectedCity(userData.kota);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateUser = async () => {
    const idUser = localStorage.getItem("id_user");
  
    try {
      const response = await axios.put(
        `http://localhost:3000/api/users/${idUser}`,
        {
          nama: users.nama,
          alamat: users.alamat,
          no_hp: users.no_hp,
          email: users.email,
          provinsi: selectedProvince,
          kota: selectedCity,
          kodepos: users.kodepos,
        }
      );
  
      if (response.status === 200) {
        const totalAmount = subtotal + 1000;
        setTotalAmount(totalAmount);
        setShowPaymentModal(true);
      } else {
        toast.error("Data gagal diperbarui" || response.message, {
          position: "top-right",
          autoClose: 1500,
        });
      }
    } catch (err) {
      console.error("Full error object:", err);
      const errorMessage =
        err.response?.data?.message || "Terjadi kesalahan pada server";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
      });
    }
  };
  

  // Hitung Subtotal
  useEffect(() => {
    const total = keranjang.reduce(
      (sum, item) => sum + Number(item.total_harga),
      0
    );
    setSubtotal(total);
  }, [keranjang]);

  // Panggil Cek Autentikasi
  useEffect(() => {
    checkAuthentication();
    handleUsers();
  }, []);

  // Checkout dan Tutup Modal
  // const handleCheckout = () => {
  //   const totalAmount = subtotal + 1000;
  //   setTotalAmount(totalAmount);
  //   setShowPaymentModal(true);
  // };

  const handleCloseModal = () => setShowPaymentModal(false);

  return (
    <div className="checkout-page">
      <Header />

      <div className="checkout-container">
        <div className="billing-section">
          <h2 className="billing-title">Billing Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                name="nama"
                value={users.nama}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="alamat"
                placeholder="Address"
                value={users.alamat}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Provinsi</label>
              <select value={selectedProvince} onChange={handleProvinceChange}>
                <option value="">Select</option>
                {provinces.map((province) => (
                  <option key={province.uniqueKey} value={province.nama}>
                    {province.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedProvince}
              >
                <option value="">Select</option>
                {cities.map((city) => (
                  <option key={city.uniqueKey} value={city.nama}>
                    {city.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Zip Code</label>
              <input
                type="text"
                placeholder="Zip Code"
                name="kodepos"
                value={users.kodepos}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={users.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="Phone Number"
                name="no_hp"
                value={users.no_hp}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="order-summary-section">
          <h2 className="order-title">Order Summary</h2>
          {keranjang.length > 0 ? (
            keranjang.map((item) => (
              <div className="order-item" key={item.id_keranjang}>
                <img
                  src={`http://localhost:3000/api/fileProduk/${item.foto_produk}`}
                  alt={item.nama_produk}
                  width={80}
                />
                <div>
                  <p>{item.nama_produk}</p>
                  <p>
                    {item.total_produk} x Rp{" "}
                    {Number(item.total_harga).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>Tidak ada item di keranjang</p>
          )}

          <div className="summary-details">
            <p>
              Sub-total: <span>Rp {subtotal.toLocaleString("id-ID")}</span>
            </p>
            <p>
              Shipping: <span>Free</span>
            </p>
            <p>
              Discount: <span>Rp 0</span>
            </p>
            <p>
              Tax: <span>Rp 1.000</span>
            </p>
            <p className="total">
              Total:
              <span>{`Rp ${(subtotal + 1000).toLocaleString(
                "id-ID"
              )}. -`}</span>
            </p>
          </div>

          <button className="checkout-button" onClick={handleUpdateUser}>
            CHECKOUT →
          </button>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          onClose={handleCloseModal}
          totalAmount={totalAmount}
          updateUser={handleUpdateUser}
          keranjang={keranjang}
        />
      )}
      <Footer />
    </div>
  );
};

export default Checkout;
