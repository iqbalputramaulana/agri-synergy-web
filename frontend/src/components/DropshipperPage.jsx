import React from 'react';

const DropshipperPage = ({ setActivePage }) => {
  const handleJoinClick = () => {
    setActivePage('informasiToko'); // Navigasi ke InformasiToko
  };

  return (
    <div className="dropshipper-page">
      <h2 className='dropshipper-page-h2'>Gabung Jadi Dropshipper di AGRI SYNERGI, Raih Penghasilan Tambahan Tanpa Ribet!</h2>
      <p>Ingin memulai bisnis tanpa modal besar? Bergabunglah bersama kami sebagai dropshipper! Kami menawarkan:</p>
      <ul>
        <li> Produk Berkualitas</li>
        <li> Support dan Panduan Terbaik</li>
        <li> Keuntungan Menarik</li>
      </ul>
      <p>Jadikan bisnis impianmu nyata tanpa harus repot stok barang atau mengurus pengiriman. Daftar sekarang dan mulai hasilkan uang.</p>
      <button className="join-button" onClick={handleJoinClick}>Gabung Sekarang</button>
    </div>
  );
};

export default DropshipperPage;
