import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/ProductDetail.css";
import Header from "./Header";
import Footer from "./footer";
import axios from "axios";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  // const [activeCategory, setActiveCategory] = useState("");

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;

    const ratings = reviews.map((review) => review.rating);

    if (ratings.length === 0) return 0;

    const averageRating =
      ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    return Math.round(averageRating);
  };

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
    } catch (err) {
      console.error("Error validating token:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
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
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addToCart = async () => {
    try {
      const idUser = localStorage.getItem("id_user");

      if (!idUser) {
        navigate("/");
        return;
      }

      const requestBody = {
        id_produk: parseInt(id),
        id_user: parseInt(idUser),
        total_produk: quantity,
      };

      const response = await axios.post(
        "http://localhost:3000/api/keranjang",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        window.location.reload();
      }
    } catch (err) {
      const errorMeasge =
        err.response?.data?.message || "Gagal menambahkan ke keranjang";
      toast.error(errorMeasge, {
        position: "top-right",
        autoClose: 1500,
      });
    }
  };

  useEffect(() => {
    checkAuthentication();
    fetchCategories();
  }, []);

  const product = products.find(
    (product) => product.id_produk === parseInt(id)
  );

  if (!product) {
    return <p>Product not found!</p>;
  }

  return (
    <div>
      <Header />
      <div className="product-detail-container">
        <div className="product-header">
          <button onClick={() => window.history.back()} className="back-button">
            ←
          </button>
          <h1>{product.nama}</h1>
        </div>
        <div className="product-content">
          <div className="product-image-section">
            <img
              src={`http://localhost:3000/api/fileProduk/${product.foto_produk}`}
              alt={product.name}
              className="product-main-image"
            />
            <div className="product-thumbnails">
              {product.sizes?.map((size, index) => (
                <div key={index} className="thumbnail">
                  <img
                    src={`http://localhost:3000/api/fileProduk/${product.foto_produk}`}
                    alt={size}
                  />
                  <p>{size}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="product-info-section">
            <h2 className="product-price">{`Rp ${Number(
              product.harga
            ).toLocaleString("id-ID")}. -`}</h2>
            <p className="product-stock">({product.kuantitas} stock)</p>
            <div className="product-rating">
              {"⭐".repeat(calculateAverageRating(product.reviews))}
              <span>({product.reviews.length} reviews)</span>
            </div>
            <p className="product-description">{product.deskripsi}</p>
            <ul className="product-ingredients">
              {product.ingredients?.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <div className="quantity-section">
              <label htmlFor="quantity">Qty:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                max={product.kuantitas}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </div>
            <button className="add-to-cart-button" onClick={addToCart}>
              <i className="fas fa-shopping-cart"></i> Add to cart
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
