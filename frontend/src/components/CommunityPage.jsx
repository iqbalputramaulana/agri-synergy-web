import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Header from './Header';
import Footer from './footer';
import '../css/CommunityPage.css';
import { toast } from "react-toastify";

const CommunityPage = () => {
  const [image, setImage] = useState(null);
  const [komunitas, setKomunitas] = useState([]);
  const navigate = useNavigate();
  const [petaniList, setPetaniList] = useState([]);

  const handleAddKomunitas = async () => {
    let deskripsi = document.getElementById("deskripsi").value;
    const gambar = document.getElementById("gambar").files[0];
    const userId = localStorage.getItem("id_user");

    if (!deskripsi || !gambar) {
      toast.error("Field tidak boleh kosong!", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }

    let topik = "";
    const topikMatch = deskripsi.match(/#\S+/);
    if (topikMatch) {
      topik = topikMatch[0];
      deskripsi = deskripsi.replace(topik, "").trim();
    }

    const formData = new FormData();
    formData.append("id_user", userId);
    formData.append("deskripsi", deskripsi);
    formData.append("topic", topik);
    formData.append("gambar", gambar);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/komunitas",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Produk berhasil ditambahkan!", {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(response.data.message || "Produk gagal ditambahkan!", {
          position: "top-right",
          autoClose: 1500,
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Terjadi kesalahan pada server";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
      });
    }
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      setImage(URL.createObjectURL(selectedImage));
    }
  };

  const checkAuthentication = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get("http://localhost:3000/api/komunitas");
      if (response.status === 200 && response.data?.data) {
        const formattedData = response.data.data.map(item => ({
          ...item,
          waktu: new Date(item.waktu).toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }).replace(/\//g, '-')
        }));
        setKomunitas(formattedData);
      } else {
        localStorage.removeItem("jwtToken");
        navigate("/");
      }
    } catch (error) {
      localStorage.removeItem("jwtToken");
      navigate("/");
    }
  };

  const fetchPetani = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users/:id_user", {
        headers: { id_user: "all" },
      });
      if (response.status === 200 && Array.isArray(response.data?.data)) {
        const petaniData = response.data.data.filter(user => user.role === "petani");
        setPetaniList(petaniData);
      }
    } catch (error) {
      console.error("Error fetching petani data:", error.message);
    }
  };

  const handleLike = async (id_komunitas) => {
    console.log("ID yang diklik:", id_komunitas);
    if (!id_komunitas) {
      toast.error("ID komunitas tidak valid!");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3000/api/komunitas/${id_komunitas}`,
        { like_count: 1 },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
        }
      );
      console.log("Response:", response.data);
      if (response.status === 200) {
        toast.success("Like berhasil!", { autoClose: 1500 });
        setKomunitas((prevKomunitas) =>
          prevKomunitas.map((item) =>
            item.id_komunitas === id_komunitas
              ? { ...item, like_count: item.like_count + 1 }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toast.error("Gagal memberi like", { autoClose: 1500 });
    }
  };
  
  const handleDislike = async (id_komunitas) => {
    console.log("ID yang diklik:", id_komunitas);
    if (!id_komunitas) {
      toast.error("ID komunitas tidak valid!");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3000/api/komunitas/${id_komunitas}`,
        { dislike_count: 1 },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
        }
      );
      console.log("Response:", response.data);
      if (response.status === 200) {
        toast.success("Dislike berhasil!", { autoClose: 1500 });
        setKomunitas((prevKomunitas) =>
          prevKomunitas.map((item) =>
            item.id_komunitas === id_komunitas
              ? { ...item, dislike_count: item.dislike_count + 1 }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      toast.error("Gagal memberi dislike", { autoClose: 1500 });
    }
  };

  useEffect(() => {
    checkAuthentication();
    fetchPetani();
  }, []);

  return (
    <div className="community-page">
      <Header />

      <div className="content-container">
        <div className="sidebar-left">
          <button className="sidebar-button active">
            <i className="fas fa-users"></i> Community
          </button>
          <button
            className="sidebar-button"
            onClick={() => navigate('/your-threads')}
          >
            <i className="fas fa-hashtag"></i> Your Threads
          </button>
          {/* <button className="sidebar-button" onClick={() => navigate('/saved')}>
            <i className="fas fa-bookmark"></i> Saved
          </button> */}
          <button className="sidebar-button" onClick={() => navigate('/login')}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>

        <div className="main-content">
          <div className="share-form">
            <input type="text" placeholder="Apa yang ingin Anda diskusikan?" id="deskripsi" />
            <button className="share-button" onClick={handleAddKomunitas}>Bagikan</button>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
              id="gambar"
            />

            {image && (
              <div className="image-preview">
                <img src={image} alt="Preview Gambar" />
              </div>
            )}
          </div>

          <div className="post-container">
            {komunitas.length > 0 ? (
              komunitas.map((item, index) => (
                <div className="post" key={item.id_komunitas}> {/* Ganti key menjadi id_komunitas */}
                  <div className="post-header">
                    <p>
                      <strong>{item.nama_user}, {item.role_user}</strong>
                    </p>
                    <span>{item.waktu}</span>
                  </div><br />
                  <img
                    src={`http://localhost:3000/api/fileKomunitas/${item.gambar}`}
                    alt="imgKomunitas"
                  /> <br /> <br />
                  <p>{item.deskripsi}</p>
                  <p><strong>{item.topic}</strong></p>
                  <br />
                  <div className="post-actions">
                    <button
                      className="like-button"
                      onClick={() => handleLike(item.id_komunitas)} // Ganti id menjadi id_komunitas
                    >
                      {item.like_count}<i className="fas fa-thumbs-up"></i> Like
                    </button>
                    <button
                      className="unlike-button"
                      onClick={() => handleDislike(item.id_komunitas)} // Ganti id menjadi id_komunitas
                    >
                      {item.dislike_count}<i className="fas fa-thumbs-down"></i> Unlike
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Belum ada komunitas yang tersedia.</p>
            )}

          </div>
        </div>

        <div className="sidebar-right">
          <button className="login-button" onClick={() => navigate('/login')}>Login</button>
          <div className="community-list">
            <h3>Anggota Komunitas</h3>
            <ul>
              {petaniList.length > 0 ? (
                petaniList.map((petani, index) => (
                  <li key={index}>{petani.nama}</li>
                ))
              ) : (
                <li>Belum ada petani terdaftar</li>
              )}
            </ul>
          </div>

          <div className="trending-topics">
            <h3>Trending Topik</h3>
            <ul>
              {komunitas.length > 0 ? (
                komunitas.map((item, index) => (
                  <li key={index}>{item.topic}</li>
                ))
              ) : (
                <li>Belum ada topic yang terdaftar</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CommunityPage;
