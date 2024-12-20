import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ChatSidebar from "../components/ChatSidebar";
import ExpertSidebar from "../components/ExpertSidebar";
import "../css/Chatstyless.css";
import Header from "../components/Header";
import Footer from "../components/footer";

function MainChat() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [currentConsultationId, setCurrentConsultationId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [experts] = useState([
    {
      id: 1,
      name: "Ahmad Rizal",
      avatar: "src/assets/profile/profile3.jpg",
      online: true,
    },
    {
      id: 2,
      name: "Diana Lestari",
      avatar: "src/assets/profile/profile4.jpg",
      online: true,
    },
    {
      id: 3,
      name: "Budi Santoso",
      avatar: "src/assets/profile/profile5.jpg",
      online: true,
    },
  ]);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("jwtToken");
      const userId = localStorage.getItem("id_user");
      const userRole = localStorage.getItem("role");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const responseAhli = await axios.get("http://localhost:3000/api/ahli");

        if (responseAhli.data.data.length > 0) {
          const transformedUsers = responseAhli.data.data.map((ahli) => ({
            id: ahli.id_user,
            name: ahli.nama,
            avatar: `http://localhost:3000/api/fileUsers/${ahli.foto}`,
            online: true,
          }));
          setUsers(transformedUsers);
        }

        const response = await axios.get("http://localhost:3000/api/send");

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("jwtToken");
          navigate("/");
          return;
        }

        if (response.data?.data && response.data.data.length > 0) {
          const filteredConsultations = response.data.data.filter(
            (konsultasi) => {
              if (userRole === "petani") {
                return konsultasi.petani_id == userId;
              } else if (userRole === "ahli") {
                return konsultasi.ahli_id == userId;
              }
            }
          );

          if (filteredConsultations.length > 0) {
            // setCurrentConsultationId(filteredConsultations[0].id_konsultasi);
            setCurrentConsultationId(filteredConsultations[0]);
          }

          const transformedMessages = filteredConsultations.flatMap(
            (konsultasi) =>
              konsultasi.send.map((message) => ({
                id: message.id_chat,
                text: message.message,
                sender: message.id_sender == userId ? "user" : "expert",
                senderName: message.nama_pengguna,
                senderRole: message.role,
                sentAt: message.sent_at,
                avatar: message.foto,
                file: message.file,
              }))
          );

          setMessages(transformedMessages);
        } else {
          setMessages([]);
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

    checkAuthentication();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    const Pesan = document.getElementById("message").value;
    const idUser = localStorage.getItem("id_user");
    const userRole = localStorage.getItem("role");
    let petaniId;

    try {
      const responseAhli = await axios.get("http://localhost:3000/api/ahli");

      if (responseAhli.data.data.length === 0) {
        alert("Tidak ada ahli yang tersedia");
        toast.error("Tidak ada ahli yang tersedia", {
          position: "top-right",
          autoClose: 1500,
        });
        return;
      }

      const idAhli = responseAhli.data.data[0].id_user;

      if (!Pesan.trim()) {
        toast.error("Pesan tidak boleh kosong!", {
          position: "top-right",
          autoClose: 1500,
        });
        return;
      }

      const formData = new FormData();
      if (userRole === "petani") {
        formData.append("petani_id", idUser);
        formData.append("ahli_id", idAhli);
      } else if (userRole === "ahli") {
        formData.append("ahli_id", idUser);
        petaniId = currentConsultationId
          ? currentConsultationId?.petani_id
          : idUser;
        formData.append("petani_id", petaniId);
      }

      formData.append("id_sender", idUser);
      formData.append("message", Pesan);

      if (currentConsultationId) {
        formData.append("id_konsultasi", currentConsultationId);
      }

      formData.append("gambar", selectedFile);

      const respons = await axios.post(
        "http://localhost:3000/api/send",
        formData
      );

      window.location.reload();

      if (!currentConsultationId) {
        setCurrentConsultationId(respons.data.data.konsultasi.id);
      }

      document.getElementById("message").value = "";
      setSelectedFile(null);
      setImagePreview(null);

      setMessages([
        ...messages,
        {
          id: respons.data.data.chatingan.id_konsultasi,
          text: Pesan,
          sender: "user",
          senderName: respons.data.data.konsultasi.petani_id,
          sentAt: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Terjadi kesalahan pada server";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 1500,
      });
    }
  };

  const addEmojiToInput = (emoji) => {
    setInputText(inputText + emoji);
    setShowEmojiBar(false);
  };

  const removeImagePreview = () => {
    setSelectedFile(null);
    setImagePreview(null);
    
    const fileInput = document.getElementById("imageUpload");
    if (fileInput) {
      fileInput.value = "";
    }
  };
  return (
    <>
      <Header />
      <div className="app">
        <ChatSidebar users={users} onLogout={() => alert("Logout")} />
        <div className="rectangles-kalender"></div>

        <div className="chat-area">
          <div className="chat-boxes">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                {message.sender === "expert" && (
                  <>
                    <img
                      src={`http://localhost:3000/api/fileUsers/${message.avatar}`}
                      alt="Expert Avatar"
                      className="avatar"
                    />
                    <div className="message-content expert-bubble">
                      {message.isImage ? (
                        <img
                          src={message.text}
                          alt="User uploaded"
                          className="message-image"
                        />
                      ) : (
                        message.text
                      )}
                      {message.file && (
                        <div className="file-attachment">
                          <img
                            src={`http://localhost:3000/api/fileChat/${message.file}`}
                            alt="File attachment"
                            className="file-image"
                            width="100px"
                            height="100px"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
                {message.sender === "user" && (
                  <>
                    <img
                      src={`http://localhost:3000/api/fileUsers/${message.avatar}`}
                      alt="User Avatar"
                      className="avatar"
                    />
                    <div className="message-content user-bubble">
                      {message.isImage ? (
                        <img
                          src={message.text}
                          alt="User uploaded"
                          className="message-image"
                        />
                      ) : (
                        message.text
                      )}
                      {message.file && (
                        <div className="file-attachment">
                          <img
                            src={`http://localhost:3000/api/fileChat/${message.file}`}
                            alt="File attachment"
                            className="file-image"
                            width="100px"
                            height="100px"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="message-input">
            <button>
              <label htmlFor="imageUpload" className="image-upload-button">
                <img src="src/assets/chain.png" alt="Upload" />
              </label>
            </button>

            <button
              className="emoji-button"
              title="Add emoji"
              onClick={() => setShowEmojiBar(!showEmojiBar)}
            >
              <img
                src="src/assets/emot.png"
                alt="Emoji"
                className="emoji-icon"
              />
            </button>

            {imagePreview && (
              <div
                className="image-preview"
                style={{
                  position: "relative",
                  marginRight: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img src={imagePreview} alt="Preview" className="img-chat" />
                <button onClick={removeImagePreview} className="btn-img-send">
                  ✕
                </button>
              </div>
            )}

            <input
              type="text"
              id="message"
              placeholder="Ketik pesan Anda di sini..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="imageUpload"
              onChange={handleFileSelect}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>

          {showEmojiBar && (
            <div className="emoji-bar">
              <button className="emoji" onClick={() => addEmojiToInput("😊")}>
                😊
              </button>
              <button className="emoji" onClick={() => addEmojiToInput("😂")}>
                😂
              </button>
              <button className="emoji" onClick={() => addEmojiToInput("❤️")}>
                ❤️
              </button>
              <button className="emoji" onClick={() => addEmojiToInput("😎")}>
                😎
              </button>
              <button className="emoji" onClick={() => addEmojiToInput("😢")}>
                😢
              </button>
            </div>
          )}
        </div>

        <div className="rectangles-kalender"></div>
        <ExpertSidebar experts={experts} />
      </div>
      <Footer />
    </>
  );
}

export default MainChat;
