import { useNavigate } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import '../css/forgotpage.css'
import backgroundImage5 from "../assets/background_5.jpg";
import backgroundImage6 from "../assets/background_6.jpg";
import backgroundImage7 from "../assets/background_7.jpg";
import Icon from "../assets/AGRI_SYNERGY.png"
import google_icon from "../assets/google_icon.png"

const images = [backgroundImage5, backgroundImage6, backgroundImage7];

const Forgot = () => {
    const navigate = useNavigate()
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="login-container-forgot">
            <div className="image-container-forgot">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Slide ${index + 1}`}
                        className={`side-image ${index === currentIndex ? 'active' : 'inactive'}`}
                        style={{ opacity: index === currentIndex ? 1 : 0 }}
                    />
                ))}
            </div>

            <div className="form-container-forgot form-container">
                <img src={Icon} alt="Logo Agri Synergy" className="logo1" />
                <h2 className="log-h2">Reset Kata Sandi</h2>
                <p className='keterangan'>Kami akan mengirim kode ke email untuk mereset sandi kamu</p>
                <p className='title_input_email'>Masukan Email</p>
                <div class="input-container">
                    <input type="password" placeholder="Masukkan Email" className="input-field-email" />
                    <button class="kode-button">Kirim Kode</button>
                </div>
                <div className="or-container">
                    <div className="line"></div>
                </div>
                <p className='title_input_field'>Masukan Kode</p>
                <input type="password" placeholder="Masukkan kode" className="input-field" />
                <p className='title_input_field'>Kata Sandi Baru</p>
                <input type="email" placeholder="Masukkan kata sandi baru" className="input-field" />
                <p className='title_input_field'>Kata Sandi</p>
                <input type="password" placeholder="Masukkan kata sandi" className="input-field" />
                <button className="submit-button" onClick={() => navigate('/login')}>Ganti Sandi</button>
                <p className="back-login" onClick={() => navigate('/login')}>Kembali ke halaman Login?</p>
            </div>
        </div>
    )
}

export default Forgot