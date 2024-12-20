import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/footer";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/CalendarStyles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function CalenderEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    jenis: "",
    judul: "",
    deskripsi: "",
    img: "",
    tanggal: "",
  });

  useEffect(() => {
    const fetchCalendarData = async () => {
      const idUser = localStorage.getItem("id_user");
      const token = localStorage.getItem("jwtToken");
      if (!token || !idUser) {
        navigate("/");
        return;
      }

      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get("http://localhost:3000/api/kalender", {
          validateStatus: function (status) {
            return status < 500;
          },
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("jwtToken");
          navigate("/");
        }

        if (response.data?.token) {
          localStorage.setItem("jwtToken", response.data.token);
        }

        if (response.data?.data) {
          const selectedCalendar = response.data.data.find(
            (item) => item.id_kalender === parseInt(id)
          );

          if (selectedCalendar) {
            const calendarDate = new Date(selectedCalendar.tanggal);
            setFormData({
              id: selectedCalendar.id_kalender,
              jenis: selectedCalendar.jenis,
              judul: selectedCalendar.judul,
              deskripsi: selectedCalendar.deskripsi,
              img: `http://localhost:3000/api/fileKalender/${selectedCalendar.gambar}`,
              tanggal: calendarDate,
            });
            setSelectedDate(calendarDate);
          }
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Terjadi kesalahan pada server";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 1500,
        });
        console.log("Error:", err);
      }
    };

    fetchCalendarData();
  }, [id, navigate]);

  const handleCalendarDateChange = (selectedDate) => {
    setSelectedDate(selectedDate);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDatePickerChange = (date) => {
    setSelectedDate(date);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        gambar: file,
        img: URL.createObjectURL(file),
      });
    }
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formattedDate =
      selectedDate.getFullYear() +
      "-" +
      ("0" + (selectedDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + selectedDate.getDate()).slice(-2);

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

      const token = localStorage.getItem("jwtToken");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.put(
        `http://localhost:3000/api/kalender/${id}`,
        formDataToSend
      );
      if (response.data.success) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => navigate("/calendar"), 1500);

      } else {
        toast.error(
          response.data.message || "Terjadi kesalahan saat mendaftar",
          {
            position: "top-right",
            autoClose: 1500,
          }
        );
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Terjadi kesalahan";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
      });
      console.error("Registration error:", err);
    }
  };

  const handleCancel = () => {
    navigate("/calendar");
  };

  return (
    <>
      <Header />
      <div className="custom-calendar-container">
        <div className="calendar-add-form__container">
          <div className="calendar-add-form__form">
            <div className="calendar-add-form__group">
              <label>Gambar</label>
              {formData.img && (
                <img
                  src={formData.img}
                  alt="img field"
                  className="calendar-add-form__img-preview"
                />
              )}
              <input
                type="file"
                name="gambar"
                accept="image/*"
                onChange={handleImageChange}
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
                  <option disabled>Select</option>
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
                selected={selectedDate}
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
                onClick={handleCancel}
                className="calendar-add-form__cancel-button"
              >
                Batal
              </button>
              <button
                type="button"
                className="calendar-add-form__submit-button"
                onClick={handleUpdate}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
        <div className="rectangles-kalender"></div>
        <div className="custom-calendar-wrapper">
          <Calendar
            onChange={handleCalendarDateChange}
            value={selectedDate}
            next2Label={null}
            prev2Label={null}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CalenderEdit;
