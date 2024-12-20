import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./footer";
import "../css/Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [keranjang, setKeranjang] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const handleContinueToCheckout = () => {
    navigate("/checkout");
  };

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

  const handleRemoveItem = async (id) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus item ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/keranjang/${id}`
        );

        if (response.status === 200) {
          Swal.fire("Berhasil!", "Item berhasil dihapus.", "success");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          Swal.fire(
            "Gagal!",
            `Item gagal dihapus: ${response.message}`,
            "error"
          );
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan pada server";
        console.error("Error deleting item:", errorMessage);
        Swal.fire("Gagal!", "Terjadi kesalahan pada server", "error");
      }
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    const total = keranjang.reduce(
      (sum, item) => sum + Number(item.total_harga),
      0
    );
    setSubtotal(total);
  }, [keranjang]);

  return (
    <div>
      <Header />
      <div className="cart-container">
        <div className="cart-items">
          {keranjang.length > 0 ? (
            keranjang.map((item) => (
              <div className="cart-item" key={item.id_keranjang}>
                <img
                  src={`http://localhost:3000/api/fileProduk/${item.foto_produk}`}
                  alt={item.nama_produk}
                  width={80}
                />
                <div className="item-details">
                  <h4>{item.nama_produk}</h4>
                  <p>Jumlah Produk: {item.total_produk}</p>
                  <p>{`Rp ${Number(item.total_harga).toLocaleString("id-ID")}. -`}</p>
                </div>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveItem(item.id_keranjang)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <div className="card-red">
              <p>Tidak ada items di keranjang</p>
            </div>
          )}
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <input
            type="text"
            placeholder="Enter coupon code here"
            className="coupon-input"
          />
          <div className="summary-details">
          <p>
              Coupon (-): <span>Rp 0</span>
            </p>
            <p>
              Subtotal:{" "}
              <span>
                Rp {subtotal.toLocaleString("id-ID")}
              </span>
            </p>
            <hr />
            <p>
              Total:{" "}
              <span>
                Rp {subtotal.toLocaleString("id-ID")}
              </span>
            </p>
          </div>
          <button
            className="checkout-button"
            onClick={handleContinueToCheckout}
          >
            Continue to checkout
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
