import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Header from './Header';
import Footer from './footer';
import '../css/CommunityPage.css';

const YourThreadsPage = () => {
    const navigate = useNavigate();
    const [komunitas, setKomunitas] = useState([]);
    const [petaniList, setPetaniList] = useState([]);

    const checkAuthentication = async () => {
        const token = localStorage.getItem("jwtToken");
        const userId = parseInt(localStorage.getItem("id_user"), 10);

        if (!token || isNaN(userId)) {
            navigate("/");
            return;
        }

        try {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const response = await axios.get("http://localhost:3000/api/komunitas");

            if (response.status === 200 && Array.isArray(response.data?.data)) {
                const filteredData = response.data.data.filter(
                    (item) => item.id_user === userId
                ).map(item => ({
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

                setKomunitas(filteredData);
            } else {
                handleLogout();
            }
        } catch (error) {
            console.error("Error fetching komunitas:", error.message);
            handleLogout();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        navigate("/");
    };

    const handleLike = async (id) => {
        try {
            await axios.post(`http://localhost:3000/api/like/${id}`);
            checkAuthentication();
        } catch (error) {
            console.error("Error liking post:", error.message);
        }
    };

    const handleDislike = async (id) => {
        try {
            await axios.post(`http://localhost:3000/api/dislike/${id}`);
            checkAuthentication();
        } catch (error) {
            console.error("Error disliking post:", error.message);
        }
    };

    const fetchPetani = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/users/:id_user", {
                headers: { id_user: "all" },
            });
    
            if (response.status === 200 && Array.isArray(response.data?.data)) {
                // Menggunakan semua data pengguna tanpa filter berdasarkan role
                const allUsers = response.data.data;
    
                allUsers.forEach(user => {
                    console.log(`User: ${user.nama}, Role: ${user.role}`);
                });
    
                setPetaniList(allUsers);
            }
        } catch (error) {
            console.error("Error fetching petani data:", error.message);
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
                    <button className="sidebar-button" onClick={() => navigate('/community')}>
                        <i className="fas fa-users"></i> Community
                    </button>
                    <button className="sidebar-button active">
                        <i className="fas fa-hashtag"></i> Your Threads
                    </button>
                    {/* <button className="sidebar-button" onClick={() => navigate('/saved')}>
                        <i className="fas fa-bookmark"></i> Saved
                    </button> */}
                    <button className="sidebar-button" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>

                <div className="main-content">
                    <h1 className='your-threads-title'>Your Threads</h1>
                    <div className="post-container">
                        {komunitas.length > 0 ? (
                            komunitas.map((item) => (
                                <div className="post" key={item.id_komunitas}>
                                    <div className="post-header">
                                        <p><strong>{item.nama_user}, {item.role_user}</strong></p>
                                        <span>{item.waktu}</span>
                                    </div><br />
                                    <img src={`http://localhost:3000/api/fileKomunitas/${item.gambar}`} alt="imgKomunitas" /> <br /> <br />
                                    <p>{item.deskripsi}</p>
                                    <p><strong>{item.topic}</strong></p>
                                    <br />
                                    <div className="post-actions">
                                        <button className="like-button" onClick={() => handleLike(item.id_komunitas)}>
                                            {item.like_count}<i className="fas fa-thumbs-up"></i> Like
                                        </button>
                                        <button className="unlike-button" onClick={() => handleDislike(item.id_komunitas)}>
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
                                    <li key={index}>{petani.nama} - {petani.role}</li>
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
                                <li>Belum ada topik yang terdaftar</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default YourThreadsPage;
