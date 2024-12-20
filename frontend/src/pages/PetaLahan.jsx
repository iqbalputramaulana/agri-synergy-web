import React from 'react';
import MapComponent from '../components/MapComponent';
import 'leaflet/dist/leaflet.css';
import Footer from '../components/footer';
import Header from '../components/Header';
import '../css/mapstyle.css'


function PetaLahan() {
  return (
    <>
    <Header />
    <div className="main-peta-lahan">
      <MapComponent />
    </div>
    <Footer/>
    </>
    
  );
}

export default PetaLahan;
