import React, { useState } from 'react';
import Navbar from '../components/Header';
import Sidebar from '../components/SidebarProfile';
import Footer from '../components/footer';
import DropshipperPage from '../components/DropshipperPage';
import OrderHistoryPage from '../components/OrderHistoryPage';
import ProfilePage from '../components/ProfilePage';
import InformasiToko from '../components/InformasiToko';
import PendingRequest from '../components/PendingRequest';
import '../css/indexdropship.css'

function MainDropship() {
  const [activePage, setActivePage] = useState('dropshipper'); // Set awal ke Dropshipper

  return (
    <>
    <Navbar />
    <div className="App">
      
      <div className="content">
        <Sidebar setActivePage={setActivePage} />
        {activePage === 'profile' && <ProfilePage />}
        {activePage === 'orderHistory' && <OrderHistoryPage />}
        {activePage === 'dropshipper' && <DropshipperPage setActivePage={setActivePage} />}
        {activePage === 'informasiToko' && <InformasiToko setActivePage={setActivePage} />}
        {activePage === 'pendingRequest' && <PendingRequest setActivePage={setActivePage} />}
      </div>
      
    </div>
    <Footer />
    </>
    
  );
}

export default MainDropship;
