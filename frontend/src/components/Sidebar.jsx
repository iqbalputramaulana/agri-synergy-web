import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/AGRI_SYNERGY.png';
import Kategori from '../assets/icons/kategori.png';
import Produk from '../assets/icons/produk.png';
import DetailSaldo from '../assets/icons/detail_saldo.png';
import PetaLahan from '../assets/icons/peta_lahan.png';
import Dropshipper from '../assets/icons/dropshipper.png';
import Logout from '../assets/icons/logout.png';
import Home from '../assets/icons/home.png';
import '../css/sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState('Kategori');

    useEffect(() => {
        switch (location.pathname) {
            case '/kategori':
                setActiveItem('Kategori');
                break;
            case '/produk':
                setActiveItem('Produk');
                break;
            case '/detail-saldo':
                setActiveItem('DetailSaldo');
                break;
            case '/peta-lahan':
                setActiveItem('PetaLahan');
                break;
            case '/drop-shipper':
                setActiveItem('Dropshipper');
                break;
            case '/logout':
                setActiveItem('Logout');
                break;
            default:
                setActiveItem('Kategori'); 
        }
    }, [location.pathname]);

    const handleLogout = (e) => {
        e.preventDefault(); // Mencegah navigasi default sementara
        // Hapus token atau sesi autentikasi pengguna
        localStorage.removeItem('token'); // Contoh: hapus token dari localStorage
        // Arahkan ke halaman login
        navigate('/login');
    };

    return (
        <div className="sidebar1">
            <div className="logo1">
                <img src={Logo} alt="Logo" />
            </div>
            <hr className="separator1" />

            <div className="menu1">
                <ul>
                <li>
                        <Link
                            to="/logout"
                            onClick={() => navigate('/')}
                            className={activeItem === 'Logout' ? 'active' : ''}
                        >
                            <img src={Home} alt="home" /> Kembali
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/kategori"
                            className={activeItem === 'Kategori' ? 'active' : ''}
                        >
                            <img src={Kategori} alt="Kategori" /> Kategori
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/produk"
                            className={activeItem === 'Produk' ? 'active' : ''}
                        >
                            <img src={Produk} alt="Produk" /> Produk
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/detail-saldo"
                            className={activeItem === 'DetailSaldo' ? 'active' : ''}
                        >
                            <img src={DetailSaldo} alt="Detail Saldo" /> Detail Saldo
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/peta-lahan"
                            className={activeItem === 'PetaLahan' ? 'active' : ''}
                        >
                            <img src={PetaLahan} alt="Peta Lahan" /> Peta Lahan
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/drop-shipper"
                            className={activeItem === 'Dropshipper' ? 'active' : ''}
                        >
                            <img src={Dropshipper} alt="Dropshipper" /> Dropshipper
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/logout"
                            onClick={handleLogout}
                            className={activeItem === 'Logout' ? 'active' : ''}
                        >
                            <img src={Logout} alt="Logout" /> Logout
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
