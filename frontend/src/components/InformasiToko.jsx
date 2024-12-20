import React, { useState } from 'react';
import PendingRequest from './PendingRequest';
import '../css/InformasiToko.css';

const InformasiToko = ({ setActivePage }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="informasi-toko">
      <div className="progress-bar">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="circle">1</div>
          <span>Informasi Toko</span>
        </div>
        <div className={`line ${currentStep >= 2 ? 'active' : ''}`}></div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="circle">2</div>
          <span>Upload Produk</span>
        </div>
        <div className={`line ${currentStep === 3 ? 'active' : ''}`}></div>
        <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
          <div className="circle">3</div>
          <span>Pending Request</span>
        </div>
      </div>

      {currentStep === 1 && (
        <form className="form">
          <h2 className='dropshipper-page-h2'>Informasi Toko</h2>
          <div className="form-row">
            <label>
              Nama Toko
              <input type="text" placeholder="Lorem Ipsum" className="form-input-markets" />
            </label>
          </div>
          <div className="form-row">
            <label>
              Alamat
              <input type="text" placeholder="Lorem Ipsum" className="form-input-markets" />
            </label>
            <label>
              Pengiriman
              <select className="form-input-markets">
                <option value="">Select</option>
                <option value="pengiriman1">Pengiriman 1</option>
                <option value="pengiriman2">Pengiriman 2</option>
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>
              Email
              <input type="email" placeholder="Lorem Ipsum" className="form-input-markets" />
            </label>
            <label>
              Nomor Telepon
              <input type="tel" placeholder="Lorem Ipsum" className="form-input-markets" />
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="submit-button next" onClick={handleNextStep}>Lanjut</button>
          </div>
        </form>
      )}

      {currentStep === 2 && (
        <form className="form">
          <h2 className='dropshipper-page-h2'>Upload Produk</h2>
          <div className="form-row">
            <label>
              Gambar
              <input type="file" className="form-input-file"/>
            </label>
          </div>
          <div className="form-row">
            <label>
              Nama
              <input type="text" placeholder="Masukkan nama" className="form-input-markets" />
            </label>
          </div>
          <div className="form-row">
            <label>
              Harga
              <input type="number" placeholder="Harga" className="form-input-markets" />
            </label>
            <label>
              Stok
              <input type="number" placeholder="Stok" className="form-input-markets" />
            </label>
          </div>
          <div className="form-row">
            <label>
              Kategori
              <select className="form-input-markets">
                <option value="">Select</option>
                <option value="kategori1">Kategori 1</option>
                <option value="kategori2">Kategori 2</option>
              </select>
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="submit-button back" onClick={handlePreviousStep}>Kembali</button>
            <button type="button" className="submit-button next" onClick={handleNextStep}>Lanjut</button>
          </div>
        </form>
      )}

      {currentStep === 3 && <PendingRequest setActivePage={setActivePage} />}
    </div>
  );
};

export default InformasiToko;
