import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/footer";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/CalendarStyles.css";
import { useNavigate, useParams } from "react-router-dom";

function CalenderView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [detail, setDetail] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
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
          const selectedCalendar = response.data.data.find(
            (item) => item.id_kalender === parseInt(id)
          );
          setDetail(selectedCalendar);
        }
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("jwtToken");
          navigate("/");
          return;
        }
        console.log("Error validating token:", error);
      }
    };

    fetchDetail();
  }, [id, navigate]);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        navigate("/");
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.delete(`http://localhost:3000/api/kalender/${id}`);

      if (response.status === 200) {
        setShowDeleteModal(false);
        navigate("/calendar");
      }
    } catch (error) {
      console.log("Error deleting calendar event:", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", options);
  };

  return (
    <>
      <Header />
      <div className="custom-calendar-container">
        {detail ? (
          <div className="custom-content-card">
            <h3>{detail?.judul}</h3>
            <img
              src={`http://localhost:3000/api/fileKalender/${detail?.gambar}`}
              alt="Placeholder"
              className="custom-content-image"
            />
            <p>{formatDate(detail?.tanggal)}</p>
            <p>{detail?.deskripsi}</p>
            <div className="custom-button-group">
              <button
                className="custom-edit-button"
                onClick={() => navigate(`/calendaredit/${detail?.id_kalender}`)}
              >
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="custom-delete-button"
              >
                Hapus
              </button>
            </div>
          </div>
        ) : (
          <div className="card-red">
            <p>Detail kalender yang Anda cari tidak tersedia.</p>
          </div>
        )}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-icon">
              {/* Tambahkan tanda seru di sini */}
              <span className="exclamation-icon">!</span>
            </div>
            <h2>Are you sure?</h2>
            <p>You won't be able to revert this!</p>
            <button onClick={confirmDelete} className="modal-confirm-button">
              Yes, delete it!
            </button>
            <button onClick={cancelDelete} className="modal-cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default CalenderView;
