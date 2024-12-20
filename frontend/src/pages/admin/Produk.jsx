import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "../../css/produk.css";

const Produk = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [kategori, setKategori] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [product, setProduct] = useState([]);

  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  const checkAuthentication = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get(
        `http://localhost:3000/api/produk?page=${activePage}`,

        {
          validateStatus: function (status) {
            return status < 500;
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("jwtToken");
        navigate("/");
        return;
      }

      if (response.data?.token) {
        localStorage.setItem("jwtToken", response.data.token);
      }

      if (response.data?.data) {
        setProduct(response.data.data);

        setTotalPages(response.data.pagination.total_pages);
        setTotalEntries(response.data.pagination.total);
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("jwtToken");
        navigate("/");
      }
      console.error("Error validating token:", err);
    }
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    const productName = document.getElementById("productName").value;
    const productStock = document.getElementById("productStock").value;
    const productPrice = document.getElementById("productPrice").value;
    const productImage = document.getElementById("productImage").files[0];
    const productCategory = document.getElementById("productKategori").value;
    const ProductDeskripsi = document.getElementById("productDeskripsi").value;
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();

    const formattedDate = `${year}-${month}-${day}`;
    const userId = localStorage.getItem("id_user");

    if (
      !productName ||
      !productStock ||
      !productPrice ||
      !productImage ||
      !productCategory ||
      !ProductDeskripsi
    ) {
      toast.error("Field tidak boleh kosong!", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }

    formData.append("id_user", userId);
    formData.append("id_kategori", productCategory);
    formData.append("nama", productName);
    formData.append("harga", productPrice);
    formData.append("kuantitas", productStock);
    formData.append("deskripsi", ProductDeskripsi);
    formData.append("foto_produk", productImage);
    formData.append("tanggal_diposting", formattedDate);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/produk",
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
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Produk gagal ditambahkan!" || response.message, {
          position: "top-right",
          autoClose: 1500,
        });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Terjadi kesalahan pada server";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
      });
      console.error("Error:", err);
    }
  };

  const handleUpdateProduct = async () => {
    const formData = new FormData();
    const productName = document.getElementById("updateProductName").value;
    const productStock = document.getElementById("updateProductStock").value;
    const productPrice = document.getElementById("updateProductPrice").value;
    const productImage = document.getElementById("updateProductImage").files[0];
    const productCategory = document.getElementById(
      "updateProductKategori"
    ).value;
    const ProductDeskripsi = document.getElementById(
      "updateProductDeskripsi"
    ).value;
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();

    const formattedDate = `${year}-${month}-${day}`;
    const userId = localStorage.getItem("id_user");

    if (
      !productName ||
      !productStock ||
      !productPrice ||
      !productCategory ||
      !ProductDeskripsi
    ) {
      toast.error("Field tidak boleh kosong!", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }

    formData.append("id_user", userId);
    formData.append("id_kategori", productCategory);
    formData.append("nama", productName);
    formData.append("harga", productPrice);
    formData.append("kuantitas", productStock);
    formData.append("deskripsi", ProductDeskripsi);
    formData.append("foto_produk", productImage);
    formData.append("tanggal_diposting", formattedDate);

    try {
      const response = await axios.put(
        `http://localhost:3000/api/produk/${currentProduct.id_produk}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Produk berhasil diupdate!", {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Produk gagal diupdate!" || response.message, {
          position: "top-right",
          autoClose: 1500,
        });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Terjadi kesalahan pada server";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
      });
      console.error("Error:", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus produk ini?",
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
          `http://localhost:3000/api/produk/${id}`
        );

        if (response.status === 200) {
          Swal.fire("Berhasil!", "Produk berhasil dihapus.", "success");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          Swal.fire(
            "Gagal!",
            `Produk gagal dihapus: ${response.message}`,
            "error"
          );
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Terjadi kesalahan pada server";
        Swal.fire("Gagal!", errorMessage, "error");
        console.error("Error:", err);
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
        setKategori(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    checkAuthentication();
    fetchCategories();
  }, [activePage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openUpdateModal = (product) => {
    setCurrentProduct(product);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setCurrentProduct(null);
  };

  return (
    <>
      <Sidebar />
      <div className="card1">
        <div className="title1">
          <h6>List Produk</h6>
        </div>
        <div className="button1">
          <button onClick={openModal}>+ Tambah</button>
        </div>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Gambar</th>
                <th>Nama</th>
                <th>Stok</th>
                <th>Harga</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {product.length > 0 ? (
                product.map((product) => (
                  <tr key={product.id_produk}>
                    <td>{product.nama_kategori}</td>
                    <td>
                      <img
                        src={`http://localhost:3000/api/fileProduk/${product.foto_produk}`}
                        alt="Produk"
                        width="60"
                        height="60"
                      />
                    </td>
                    <td>{product.nama}</td>
                    <td>{product.kuantitas}</td>
                    <td>{`Rp ${Number(product.harga).toLocaleString()}`}</td>
                    <td>
                      <button
                        className="update1"
                        onClick={() => openUpdateModal(product)}
                      >
                        <span className="icon update-icon1" />
                      </button>
                      <button
                        className="delete1"
                        onClick={() => handleDeleteProduct(product.id_produk)}
                      >
                        <span className="icon delete-icon1" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Tidak ada data produk.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="entri">
          <p className="entri-text">
            Menampilkan {(activePage - 1) * 10 + 1} -{" "}
            {Math.min(activePage * 10, totalEntries)} dari {totalEntries} entri
          </p>

          <div className="pagination">
            <button
              className={`pagination-button prev ${
                activePage === 1 ? "disabled" : ""
              }`}
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage === 1}
            >
              «
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`pagination-button ${
                  activePage === index + 1 ? "active" : ""
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className={`pagination-button next ${
                activePage === totalPages ? "disabled" : ""
              }`}
              onClick={() => handlePageChange(activePage + 1)}
              disabled={activePage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay1" onClick={closeModal}>
          <div className="modal-content1" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header1">
              <h5>Tambah Produk</h5>
              <button className="close-button1" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-body1">
              <div className="form-group1">
                <label htmlFor="productName">Nama Produk</label>
                <input
                  type="text"
                  id="productName"
                  placeholder="Masukkan nama produk"
                />
              </div>
              <div className="form-group1">
                <label htmlFor="productStock">Stok</label>
                <input
                  type="number"
                  id="productStock"
                  placeholder="Masukkan stok"
                />
              </div>
              <div className="form-group1">
                <label htmlFor="productPrice">Harga</label>
                <input
                  type="text"
                  id="productPrice"
                  placeholder="Masukkan harga"
                />
              </div>
              <div className="form-group1">
                <label htmlFor="productImage">Gambar Produk</label>
                <input type="file" id="productImage" accept="image/*" />
              </div>
              <div className="form-group1 full-width">
                <label htmlFor="productKategori">Kategori</label>
                <select id="productKategori" placeholder="Pilih Kategori">
                  <option disabled>Pilih Kategori</option>
                  {kategori.map((category) => (
                    <option
                      key={category.id_kategori}
                      value={category.id_kategori}
                    >
                      {category.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group2 full-width">
                <label htmlFor="productDeskripsi">Deskripsi</label>
                <textarea
                  id="productDeskripsi"
                  placeholder="Masukkan deskripsi"
                />
              </div>
            </div>

            <div className="modal-footer1">
              <button className="cancel-button1" onClick={closeModal}>
                Kembali
              </button>
              <button className="save-button1" onClick={handleAddProduct}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {isUpdateModalOpen && currentProduct && (
        <div className="modal-overlay1" onClick={closeUpdateModal}>
          <div className="modal-content1" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header1">
              <h5>Update Produk</h5>
              <button className="close-button1" onClick={closeUpdateModal}>
                ×
              </button>
            </div>

            <div className="modal-body1">
              <div className="form-group1">
                <label htmlFor="updateProductName">Nama Produk</label>
                <input
                  type="text"
                  id="updateProductName"
                  value={currentProduct.nama}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      nama: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group1">
                <label htmlFor="updateProductStock">Stok</label>
                <input
                  type="number"
                  id="updateProductStock"
                  value={currentProduct.kuantitas}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      kuantitas: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group1">
                <label htmlFor="updateProductPrice">Harga</label>
                <input
                  type="text"
                  id="updateProductPrice"
                  value={currentProduct.harga}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      harga: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group1">
                <label htmlFor="updateProductImage">Gambar Produk</label>
                <input type="file" id="updateProductImage" accept="image/*" />
              </div>
              <div className="form-group1">
                <label htmlFor="updateProductKategori">Kategori</label>
                <select
                  id="updateProductKategori"
                  value={currentProduct.id_kategori}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      id_kategori: e.target.value,
                    })
                  }
                >
                  {kategori.map((category) => (
                    <option
                      key={category.id_kategori}
                      value={category.id_kategori}
                    >
                      {category.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group1">
                <img
                  src={`http://localhost:3000/api/fileProduk/${currentProduct.foto_produk}`}
                  alt="Current Product"
                  width={100}
                  height={100}
                />
              </div>
              <div className="form-group2 full-width">
                <label htmlFor="updateProductDeskripsi">Deskripsi</label>
                <textarea
                  id="updateProductDeskripsi"
                  value={currentProduct.deskripsi}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      deskripsi: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-footer1">
              <button className="cancel-button1" onClick={closeUpdateModal}>
                Kembali
              </button>
              <button
                className="save-button1Update"
                onClick={handleUpdateProduct}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Produk;
