import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './footer';
import '../css/CommunityPage.css';

const SavedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="community-page">
            <Header />

            <div className="content-container">
                {/* Sidebar Kiri */}
                <div className="sidebar-left">
                    <button className="sidebar-button" onClick={() => navigate('/community')}>
                        <i className="fas fa-users"></i> Community
                    </button>
                    <button 
                        className="sidebar-button" 
                        onClick={() => navigate('/your-threads')}
                    >
                        <i className="fas fa-hashtag"></i> Your Threads
                    </button>
                    <button className="sidebar-button active">
                        <i className="fas fa-bookmark"></i> Saved
                    </button>
                    <button className="sidebar-button" onClick={() => navigate('/login')}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>

                {/* Konten Utama SavedPage */}
                <div className="main-content">
                    <h1>Saved Posts</h1>
                    <p>This is the content of the Saved page, where you can view your saved posts.</p>
                    {/* Tambahkan konten atau komponen untuk menampilkan postingan yang disimpan */}
                </div>

                {/* Sidebar Kanan */}
                <div className="sidebar-right">
                    <button className="login-button" onClick={() => navigate('/login')}>Login</button>
                    <div className="community-list">
                        <h3>Anggota Komunitas</h3>
                        <ul>
                            <li>Yanto Pratama</li>
                            <li>Siti Marlina</li>
                            <li>Rudi Santoso</li>
                            <li>Wahyu Nugroho</li>
                            <li>Fifi Rahayu</li>
                            <li>Devi Anggraini</li>
                        </ul>
                    </div>
                    
                    <div className="trending-topics">
                        <h3>Trending Topik</h3>
                        <ul>
                            <li>#Jagung Manis</li>
                            <li>#Tanaman Padi</li>
                            <li>#HapusGuna</li>
                        </ul>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default SavedPage;
