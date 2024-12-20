import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Sidebar from "../../components/Sidebar";
import "../../css/petalahan.css";

const Petalahan = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentRicefield, setCurrentRicefield] = useState(null);
  const [ricefield, setRicefield] = useState([]);

  const checkAuthentication = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get(`http://localhost:3000/api/sawah`, {
        validateStatus: function (status) {
          return status < 500;
        },
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
        setRicefield(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("jwtToken");
        navigate("/");
      }
      console.error("Error validating token:", error);
    }
  };

  const handleAddRicefield = async () => {
    const formData = new FormData();
    const GambarLahan = document.getElementById("imageLahan").files[0];
    const LuasLahan = document.getElementById("luasLahan").value;
    const Lokasi = document.getElementById("lokasi").value;
    const JenisTanah = document.getElementById("jenisTanah").value;
    const HasilPanen = document.getElementById("hasilPanen").value;
    const Produksi = document.getElementById("produksi").value;
    const Latitude = document.getElementById("latitude").value;
    const Longitude = document.getElementById("longitude").value;
    const Deskripsi = document.getElementById("description").value;

    const userId = localStorage.getItem("id_user");

    if (
      !GambarLahan ||
      !LuasLahan ||
      !Lokasi ||
      !JenisTanah ||
      !HasilPanen ||
      !Produksi ||
      !Latitude ||
      !Longitude ||
      !Deskripsi
    ) {
      toast.error("Semua field harus diisi!", {
        position: "top-right",
        autoClose: 1500,
      });
      return;
    }

    formData.append("id_user", userId);
    formData.append("lokasi", Lokasi);
    formData.append("luas", LuasLahan);
    formData.append("foto_lokasi", GambarLahan);
    formData.append("jenis_tanah", JenisTanah);
    formData.append("hasil_panen", HasilPanen);
    formData.append("produksi", Produksi);
    formData.append("deskripsi", Deskripsi);
    formData.append("latitude", Latitude);
    formData.append("longitude", Longitude);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/sawah",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Data sawah berhasil ditambahkan!", {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Data gagal ditambahkan!" || response.message, {
          position: "top-right",
          autoClose: 1500,
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Terjadi kesalahan";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
      });
      console.error(err);
    }
  };

  const handleUpdateRicefield = async () => {
    const formData = new FormData();
    const GambarLahan = document.getElementById("UpdateImageLahan").files[0];
    const LuasLahan = document.getElementById("UpdateLuasLahan").value;
    const Lokasi = document.getElementById("UpdateLokasi").value;
    const JenisTanah = document.getElementById("UpdateJenisTanah").value;
    const HasilPanen = document.getElementById("UpdateHasilPanen").value;
    const Produksi = document.getElementById("UpdateProduksi").value;
    const Latitude = document.getElementById("UpdateLatitude").value;
    const Longitude = document.getElementById("UpdateLongitude").value;
    const Deskripsi = document.getElementById("UpdateDescription").value;

    const userId = localStorage.getItem("id_user");



    formData.append("id_user", userId);
    formData.append("lokasi", Lokasi);
    formData.append("luas", LuasLahan);
    formData.append("foto_lokasi", GambarLahan);
    formData.append("jenis_tanah", JenisTanah);
    formData.append("hasil_panen", HasilPanen);
    formData.append("produksi", Produksi);
    formData.append("deskripsi", Deskripsi);
    formData.append("latitude", Latitude);
    formData.append("longitude", Longitude);

    try {
      const response = await axios.put(
        `http://localhost:3000/api/sawah/${currentRicefield.id_sawah}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Data sawah berhasil diubah!", {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Data gagal diubah!" || response.message, {
          position: "top-right",
          autoClose: 1500,
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Terjadi kesalahan";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
      });
      console.error(err);
    }
  };

  const handleDeleteRicefield = async (id) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus lahan ini?",
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
          `http://localhost:3000/api/sawah/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );

        if (response.status === 200) {
          toast.success("Data sawah berhasil dihapus!", {
            position: "top-right",
            autoClose: 1500,
          });
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          toast.error("Data gagal dihapus!" || response.message, {
            position: "top-right",
            autoClose: 1500,
          });
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Terjadi kesalahan";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 1500,
        });
        console.error(err);
      }
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= 3) {
      setActivePage(page);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openUpdateModal = (ricefield) => {
    setCurrentRicefield(ricefield);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setCurrentRicefield(null);
  };

  return (
    <>
      <Sidebar />
      <div className="card4">
        <div className="title4">List Lahan</div>
        <div className="button4">
          <button onClick={openModal}>+ Tambah</button>
        </div>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Gambar</th>
                <th>Nama</th>
                <th>Titik Kordinat</th>
                <th>Deskripsi</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ricefield.length > 0 ? (
                ricefield.map((ricefield) => (
                  <tr key={ricefield.id_sawah}>
                    <td>
                      <img
                        src={`http://localhost:3000/api/fileSawah/${ricefield.foto_lokasi}`}
                        alt="lahan"
                        width="70"
                        height="50"
                      />
                    </td>
                    <td>{ricefield.lokasi}</td>
                    <td className="titik-column">
                      {ricefield.latitude}, {ricefield.longitude}
                    </td>
                    <td className="deskripsi-column">{ricefield.deskripsi}</td>
                    <td>
                      <button
                        className="update4"
                        onClick={() => openUpdateModal(ricefield)}
                      >
                        <span className="icon update-icon4" />
                      </button>
                      <button
                        className="delete4"
                        onClick={() =>
                          handleDeleteRicefield(ricefield.id_sawah)
                        }
                      >
                        <span className="icon delete-icon4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Tidak ada entri</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="entri">
          <p className="entri-text">
            Menampilkan {activePage} dari {ricefield.length} entri
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
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`pagination-button ${
                  activePage === page ? "active" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className={`pagination-button next ${
                activePage === 3 ? "disabled" : ""
              }`}
              onClick={() => handlePageChange(activePage + 1)}
              disabled={activePage === 3}
            >
              »
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay2" onClick={closeModal}>
          <div className="modal-content2" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header2">
              <h5>Tambah Lahan</h5>
              <button className="close-button2" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-body2">
              <div className="form-group2">
                <label htmlFor="lokasi">lokasi</label>
                <input type="text" id="lokasi" placeholder="Masukkan Lokasi" />
              </div>
              <div className="form-group2">
                <label htmlFor="imageLahan">Gambar Lahan</label>
                <input type="file" id="imageLahan" accept="image/*" />
              </div>
              <div className="form-group2">
                <label htmlFor="luasLahan">luas lahan</label>
                <input
                  type="text"
                  id="luasLahan"
                  placeholder="Masukkan Luas Lahan"
                />
              </div>

              <div className="form-group2">
                <label htmlFor="jenisTanah">Jenis Tanah</label>
                <input
                  type="text"
                  id="jenisTanah"
                  placeholder="Masukkan Jenis Tanah"
                />
              </div>
              <div className="form-group2">
                <label htmlFor="hasilPanen">Hasil Panen</label>
                <input
                  type="text"
                  id="hasilPanen"
                  placeholder="Masukkan Hasil Panen"
                />
              </div>
              <div className="form-group2">
                <label htmlFor="produksi">Produksi</label>
                <input
                  type="text"
                  id="produksi"
                  placeholder="Masukkan Produksi"
                />
              </div>
              <div className="form-group2 half-width">
                <label htmlFor="latitude">latitude</label>
                <input
                  type="text"
                  id="latitude"
                  placeholder="Masukkan Garis Lintang"
                />
              </div>
              <div className="form-group2 half-width">
                <label htmlFor="longtitude">longtitude</label>
                <input
                  type="text"
                  id="longitude"
                  placeholder="Masukkan Garis Bujur"
                />
              </div>

              <div className="form-group2 full-width">
                <label htmlFor="description">Deskripsi</label>
                <textarea
                  id="description"
                  placeholder="Masukkan Deskripsi"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div className="modal-footer2">
              <button className="cancel-button1" onClick={closeModal}>
                Kembali
              </button>
              <button className="save-button2" onClick={handleAddRicefield}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className="modal-overlay2" onClick={closeUpdateModal}>
          <div className="modal-content2" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header2">
              <h5>Update Lahan</h5>
              <button className="close-button2" onClick={closeUpdateModal}>
                ×
              </button>
            </div>

            <div className="modal-body2">
              <div className="form-group2">
                <label htmlFor="UpdateLokasi">lokasi</label>
                <input
                  type="text"
                  id="UpdateLokasi"
                  value={currentRicefield.lokasi}
                  onChange={(e) =>
                    setCurrentRicefield({
                      ...currentRicefield,
                      lokasi: e.target.value,
                    })
                  }
                  placeholder="Masukkan Lokasi"
                />
              </div>
              <div className="form-group2">
                <label htmlFor="UpdateImageLahan">Gambar Lahan</label>
                <input type="file" id="UpdateImageLahan" accept="image/*" />
              </div>
              <div className="form-group2">
                <label htmlFor="UpdateLuasLahan">luas lahan</label>
                <input
                  type="text"
                  id="UpdateLuasLahan"
                  value={currentRicefield.luas}
                  onChange={(e) =>
                    setCurrentRicefield({
                      ...currentRicefield,
                      luas: e.target.value,
                    })
                  }
                  placeholder="Masukkan Luas Lahan"
                />
              </div>

              <div className="form-group2">
                <label htmlFor="UpdateJenisTanah">Jenis Tanah</label>
                <input
                  type="text"
                  id="UpdateJenisTanah"
                  value={currentRicefield.jenis_tanah}
                  onChange={(e) =>
                    setCurrentRicefield({
                      ...currentRicefield,
                      jenis_tanah: e.target.value,
                    })
                  }
                  placeholder="Masukkan Jenis Tanah"
                />
              </div>
              <div className="form-group2">
                <img
                  src={`http://localhost:3000/api/fileSawah/${currentRicefield.foto_lokasi}`}
                  alt="Current Product"
                  width={100}
                  height={100}
                />
              </div>
              <div className="form-group2">
                <label htmlFor="UpdateHasilPanen">Hasil Panen</label>
                <input
                  type="text"
                  id="UpdateHasilPanen"
                  value={currentRicefield.hasil_panen}
                  onChange={(e) =>
                    setCurrentRicefield({
                      ...currentRicefield,
                      hasil_panen: e.target.value,
                    })
                  }
                  placeholder="Masukkan Hasil Panen"
                />
              </div>
              <div className="form-group2">
                <label htmlFor="UpdateProduksi">Produksi</label>
                <input
                  type="text"
                  id="UpdateProduksi"
                  value={currentRicefield.produksi}
                  onChange={(e) =>
                    setCurrentRicefield({
                      ...currentRicefield,
                      produksi: e.target.value,
                    })
                  }
                  placeholder="Masukkan Produksi"
                />
              </div>
              <div className="form-group2">
                <label htmlFor="Latitude">latitude</label>
                <input
                  type="text"
                  id="UpdateLatitude"
                  value={currentRicefield.latitude}
                  onChange={(e) =>
                    setCurrentRicefield({
                      ...currentRicefield,
                      latitude: e.target.value,
                    })
                  }
                  placeholder="Masukkan Garis Lintang"
                />
              </div>
              <div className="form-group2">
                <label htmlFor="UpdateLongtitude">longitude</label>
                <input
                  type="text"
                  id="UpdateLongitude"
                  value={currentRicefield.longitude}
                  onChange={(e) =>
                    setCurrentRicefield({
                      ...currentRicefield,
                      longitude: e.target.value,
                    })
                  }
                  placeholder="Masukkan Garis Bujur"
                />
              </div>

              <div className="form-group2 full-width">
                <label htmlFor="UpdateDescription">Deskripsi</label>
                <textarea
                  id="UpdateDescription"
                  value={currentRicefield.deskripsi}
                  onChange={(e) =>
                    setCurrentRicefield({
                      ...currentRicefield,
                      deskripsi: e.target.value,
                    })
                  }
                  placeholder="Masukkan Deskripsi"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div className="modal-footer2">
              <button className="cancel-button2" onClick={closeUpdateModal}>
                Kembali
              </button>
              <button className="save-button2Update" onClick={handleUpdateRicefield}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Petalahan;
