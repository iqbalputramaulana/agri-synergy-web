import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/footer";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/CalendarStyles.css";
import NotificationCard from "../components/NotificationCard";
import { useNavigate } from "react-router-dom";

function Calender() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [kalender, setKalender] = useState([]);

  const checkAuthentication = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
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
        setKalender(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("jwtToken");
        navigate("/");
        return;
      }
      console.log("Error Vakidating token:", error);
    }
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <>
      <Header />
      <div className="custom-calendar-container">
        <div className="calendar-notif-list">
          <div
            className="calendar-notif-add-button"
            onClick={() => navigate("/calendaradd")}
          >
            +
          </div>
          {kalender.length > 0 ? (
            kalender.map((kalender) => (
              <NotificationCard
                key={kalender.id_kalender}
                id={kalender.id_kalender}
                title={kalender.judul}
                message={kalender.deskripsi}
                image={`http://localhost:3000/api/fileKalender/${kalender.gambar}`}
              />
            ))
          ) : (
            <p className="card-red">
              Anda belum memasukkan data pertanian. Mohon untuk membuat data
              terlebih dahulu agar notifikasi dapat ditampilkan.
            </p>
          )}
        </div>
        <div className="rectangles-kalender"></div>
        <div className="custom-calendar-wrapper">
          <Calendar
            onChange={handleDateChange}
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

export default Calender;
