import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../../css/DropshipperAdmin.css";

const products = [
  {
    image: "src/assets/products/produk-4.png",
    pemilik: "lorem imsun",
    produk: "Tepung Jagung Organik",
    price: "150.000",
    stock: 25,
  },
  {
    image: "src/assets/products/produk-2.png",
    pemilik: "lorem imsun",
    produk: "Popcorn Jagung Premium",
    price: "120.000",
    stock: 15,
  },
];

const toko = [
  {
    username: "lorem imsun",
    namaToko: "lorem imsun",
    alamatToko: "lorem imsun",
    emailToko: "1lorem imsun@gmail.com",
  },
  {
    username: "lorem imsun",
    namaToko: "lorem imsun",
    alamatToko: "lorem imsun",
    emailToko: "2loremimsun@gmail.com",
  },
];

const ButtonApproved = ({ onClick, disabled }) => {
  return (
    <button className="approved" onClick={onClick} disabled={disabled}>
      Disetujui
    </button>
  );
};

const Dropshipper = () => {
  const [approvedToko, setApprovedToko] = useState(Array(toko.length).fill(false));

  const [approvedProduct, setApprovedProduct] = useState(Array(products.length).fill(false));

  const handleApproveToko = (index) => {
    const updatedApproved = [...approvedToko];
    updatedApproved[index] = true;
    setApprovedToko(updatedApproved);
  };

  const handleApproveProduct = (index) => {
    const updatedApproved = [...approvedProduct];
    updatedApproved[index] = true;
    setApprovedProduct(updatedApproved);
  };

  return (
    <>
      <Sidebar />
      <div className="card5">
        <div className="title5">Permintaan Toko</div>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Nama Toko</th>
                <th>Alamat Toko</th>
                <th>Email Toko</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {toko.map((tokoItem, index) => (
                <tr key={index}>
                  <td>{tokoItem.username}</td>
                  <td>{tokoItem.namaToko}</td>
                  <td>{tokoItem.alamatToko}</td>
                  <td>{tokoItem.emailToko}</td>
                  <td>
                    <ButtonApproved
                      onClick={() => handleApproveToko(index)}
                      disabled={approvedToko[index]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card5">
        <div className="title5">Permintaan Produk</div>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Gambar</th>
                <th>Nama Toko</th>
                <th>Nama</th>
                <th>Stok</th>
                <th>Harga</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={product.image}
                      alt={product.produk}
                      width="50"
                      height="50"
                    />
                  </td>
                  <td>{product.pemilik}</td>
                  <td>{product.produk}</td>
                  <td>{product.stock}</td>
                  <td>{product.price}</td>
                  <td>
                    <ButtonApproved
                      onClick={() => handleApproveProduct(index)}
                      disabled={approvedProduct[index]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dropshipper;
