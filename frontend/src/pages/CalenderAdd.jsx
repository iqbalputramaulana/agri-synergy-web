import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Header from "../components/Header";
import Footer from "../components/footer";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/CalendarStyles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CalendarAdd() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());

  const [formData, setFormData] = useState({
    jenis: "",
    judul: "",
    deskripsi: "",
    tanggal: "",
    id_user: "",
    gambar: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const idUser = localStorage.getItem("id_user");
    if (!idUser) {
      toast.error("Anda harus login terlebih dahulu", {
        position: "top-right",
        autoClose: 1500,
      });
      navigate("/login");
    } else {
      setFormData((prevState) => ({
        ...prevState,
        id_user: idUser,
      }));
    }
  }, [navigate]);

  const handleCalendarDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDatePickerChange = (tanggal) => {
    setFormData((prevState) => ({
      ...prevState,
      tanggal: tanggal ? tanggal.toISOString() : "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({
      ...prevState,
      gambar: file,
    }));
  };

  const validateForm = () => {
    if (
      !formData.jenis ||
      !formData.judul ||
      !formData.deskripsi ||
      !formData.tanggal ||
      isNaN(new Date(formData.tanggal).getTime()) 
    ) {
      toast.error("Semua field harus diisi dengan benar", {
        position: "top-right",
        autoClose: 1500,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const localDate = new Date(formData.tanggal);
    const formattedDate =
      localDate.getFullYear() +
      "-" +
      ("0" + (localDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + localDate.getDate()).slice(-2);

    try {
      const idUser = localStorage.getItem("id_user");
      const formDataToSend = new FormData();

      formDataToSend.append("jenis", formData.jenis);
      formDataToSend.append("judul", formData.judul);
      formDataToSend.append("deskripsi", formData.deskripsi);
      formDataToSend.append("tanggal", formattedDate);
      formDataToSend.append("id_user", idUser);
      if (formData.gambar) {
        formDataToSend.append("gambar", formData.gambar, formData.gambar.name);
      }

      const response = await axios.post(
        "http://localhost:3000/api/kalender",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => navigate("/calendar"), 1500);
      } else {
        toast.error(response.data.message || "Terjadi kesalahan saat Input", {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="custom-calendar-container">
        <div className="calendar-add-form__container">
          <div className="calendar-add-form__form">
            <div className="calendar-add-form__group">
              <label>Gambar</label>
              <input
                type="file"
                name="gambar"
                onChange={handleFileChange}
                accept="image/*"
                className="calendar-add-form__file-input"
              />
            </div>

            <div className="calendar-add-form__row">
              <div className="calendar-add-form__group">
                <label>Jenis</label>
                <select
                  name="jenis"
                  value={formData.jenis}
                  onChange={handleChange}
                  className="calendar-add-form__select"
                >
                  <option value="">Pilih Jenis</option>
                  <option value="pengingat">Pengingat</option>
                  <option value="peringatan">Peringatan</option>
                </select>
              </div>
              <div className="calendar-add-form__group">
                <label>Judul</label>
                <input
                  type="text"
                  name="judul"
                  value={formData.judul}
                  onChange={handleChange}
                  className="calendar-add-form__input"
                />
              </div>
            </div>

            <div className="calendar-add-form__group">
              <label>Tanggal</label>
              <DatePicker
                selected={formData.tanggal ? new Date(formData.tanggal) : null}
                onChange={handleDatePickerChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YY"
                className="calendar-add-form__datepicker"
              />
            </div>

            <div className="calendar-add-form__group">
              <label>Deskripsi</label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                className="calendar-add-form__textarea"
              ></textarea>
            </div>

            <div className="calendar-add-form__buttons">
              <button
                type="button"
                onClick={() => navigate("/calendar")}
                className="calendar-add-form__cancel-button"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="calendar-add-form__submit-button"
              >
                {loading ? "Loading..." : "Tambah"}
              </button>
            </div>
          </div>
        </div>
        <div className="rectangles-kalender"></div>
        <div className="custom-calendar-wrapper">
          <Calendar
            onChange={handleCalendarDateChange}
            value={date}
            next2Label={null}
            prev2Label={null}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CalendarAdd;
