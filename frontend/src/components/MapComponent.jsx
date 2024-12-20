import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "../css/mapstyle.css";
import { useNavigate } from "react-router-dom";

function FlyToLocation({ position }) {
  const map = useMap();
  map.flyTo(position, 12, { animate: true });
  return null;
}

function MapComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [position, setPosition] = useState([-7.5568, 112.2328]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarData, setSidebarData] = useState(null);
  const [sawahData, setSawahData] = useState([]);
  const navigate = useNavigate();

  const checkAuthentication = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get("http://localhost:3000/api/sawah", {
        validateStatus: (status) => status < 500,
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("jwtToken");
        navigate("/");
        return;
      }

      if (response.data?.data) {
        setSawahData(response.data.data);
        const firstData = response.data.data[0];
        setSidebarData(firstData);
      }
    } catch (error) {
      console.error("Error validating token:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("jwtToken");
        navigate("/");
        return;
      }
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;

    const matchedLocation = sawahData.find((data) => 
      data.lokasi.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchedLocation) {
      const newPos = [parseFloat(matchedLocation.latitude), parseFloat(matchedLocation.longitude)];
      setPosition(newPos);

      setSidebarData(matchedLocation);
      setShowSidebar(true);
    } else {
      toast.error("Lokasi tidak ditemukan!");
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSearch();
    }
  };
  
  const handleMarkerClick = (data) => {
    setShowSidebar(true);
    setSidebarData(data);

    setPosition([parseFloat(data.latitude), parseFloat(data.longitude)]);
  };

  return (
    <div style={{ position: "relative" }}>
      {showSidebar && sidebarData && (
        <div className="sidebar-info">
          <img
            src={`http://localhost:3000/api/fileSawah/${sidebarData.foto_lokasi}`}
            alt={sidebarData.lokasi}
            className="sidebar-image"
          />
          <button className="close-btn" onClick={() => setShowSidebar(false)}>
            ✖
          </button>
          <h2>{sidebarData.lokasi}</h2>
          <div className="sidebar-content">
            <p>
              <strong>Informasi Lahan:</strong>
            </p>
            <ul>
              <li>Luas tanah: {sidebarData.luas} Hektar</li>
              <li>Jenis Tanah: {sidebarData.jenis_tanah}</li>
            </ul>
            <p>
              <strong>Analytics:</strong>
            </p>
            <ul>
              <li>Hasil Panen: {sidebarData.hasil_panen}</li>
            </ul>
            <p>
              <strong>Deskripsi:</strong>
            </p>
            <p>{sidebarData.deskripsi}</p>
          </div>
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Cari lokasi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown} // Menambahkan event listener untuk keydown
        />
        <button onClick={handleSearch}>Cari</button>
      </div>

      <MapContainer center={position} zoom={12} className="map-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {sawahData.map((data) => (
          <Marker
            key={data.id_sawah}
            position={[parseFloat(data.latitude), parseFloat(data.longitude)]}
            eventHandlers={{
              click: () => handleMarkerClick(data),
            }}
          >
            <Popup>{data.lokasi}</Popup>
          </Marker>
        ))}

        <FlyToLocation position={position} />
      </MapContainer>
    </div>
  );
}

export default MapComponent;
