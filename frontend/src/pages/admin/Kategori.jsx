import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "../../css/kategori.css";

const Kategori = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [kategori, setKategori] = useState([]);

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
        `http://localhost:3000/api/kategori?page=${activePage}`,
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
        setKategori(response.data.data);

        setTotalPages(response.data.pagination.total_pages);
        setTotalEntries(response.data.pagination.total);
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("jwtToken");
        navigate("/");
        return;
      }
      console.log("Error Validating token:", error);
    }
  };

  const handleAddCategory = async () => {
    const NamaCategory = document.getElementById("kategoriName").value;

    if (!NamaCategory) {
      toast.error("Kategori tidak boleh kosong!", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/kategori", {
        nama: NamaCategory,
      });

      if (response.status === 200) {
        toast.success("Kategori berhasil ditambahkan!", {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Kategori gagal ditambahkan!" || response.message, {
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

  const handleUpdateCategory = async () => {
    const NamaCategory = document.getElementById("kategoriName").value;

    if (!NamaCategory || !categoryToEdit) {
      toast.error("Kategori tidak boleh kosong!", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/kategori/${categoryToEdit.id_kategori}`,
        {
          nama: NamaCategory,
        }
      );

      if (response.status === 200) {
        toast.success("Kategori berhasil diubah!", {
          position: "top-right",
          autoClose: 1500,
        });

        checkAuthentication();
        closeUpdateModal();
      } else {
        toast.error("Kategori gagal diubah!" + response.message, {
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

  const handleDeleteCategory = async (id) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus kategori ini?",
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
          `http://localhost:3000/api/kategori/${id}`
        );

        if (response.status === 200) {
          Swal.fire("Berhasil!", "Kategori berhasil dihapus.", "success");
          checkAuthentication();
        } else {
          Swal.fire(
            "Gagal!",
            `Kategori gagal dihapus: ${response.message}`,
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

  useEffect(() => {
    checkAuthentication();
  }, [activePage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setActivePage(page);
    }
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openUpdateModal = (category) => {
    setCategoryToEdit(category);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setCategoryToEdit(null);
  };

  return (
    <>
      <Sidebar />
      <div className="card">
        <div className="title">
          <h6>List Kategori</h6>
        </div>
        <div className="button">
          <button onClick={openAddModal}>+ Tambah</button>
        </div>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {kategori.length > 0 ? (
                kategori.map((kategori) => (
                  <tr key={kategori.id_kategori}>
                    <td>{kategori.nama}</td>
                    <td>
                      <button
                        className="update"
                        onClick={() => openUpdateModal(kategori)}
                      >
                        <span className="icon update-icon" />
                      </button>
                      <button
                        className="delete"
                        onClick={() =>
                          handleDeleteCategory(kategori.id_kategori)
                        }
                      >
                        <span className="icon delete-icon" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">Tidak ada data kategori.</td>
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

      {isAddModalOpen && (
        <div className="modal-overlay" onClick={closeAddModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Tambah Kategori</h5>
              <button className="close-button1" onClick={closeAddModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="kategoriName">Nama Kategori</label>
                <input
                  type="text"
                  id="kategoriName"
                  placeholder="Masukkan nama kategori"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={closeAddModal}>
                Kembali
              </button>
              <button className="save-button" onClick={handleAddCategory}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {isUpdateModalOpen && categoryToEdit && (
        <div className="modal-overlay" onClick={closeUpdateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Update Kategori</h5>
              <button className="close-button1" onClick={closeUpdateModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="kategoriName">Nama Kategori</label>
                <input
                  type="text"
                  id="kategoriName"
                  placeholder="Masukkan nama kategori"
                  defaultValue={categoryToEdit?.nama}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={closeUpdateModal}>
                Kembali
              </button>
              <button
                className="save-buttonUpdate"
                onClick={handleUpdateCategory}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Kategori;
