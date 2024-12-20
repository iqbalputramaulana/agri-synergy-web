import React from 'react';
import '../css/PendingRequest.css';

const PendingRequest = ({ setActivePage }) => {
  const handleComplete = () => {
    setActivePage('dropshipper'); // Navigasi kembali ke DropshipperPage
  };

  return (
    <div className="pending-request">
      <div className="status-box">
        <div className="status-icon">✔️</div>
        <h2 className='dropshipper-page-h2'>Permintaan Sudah Dikirim</h2>
        <p>Silakan tunggu proses ACC dari pihak AGRI SYNERGY</p>
      </div>
      <button className="complete-button" onClick={handleComplete}>SELESAI</button>
    </div>
  );
};

export default PendingRequest;
