// // components/OrderHistoryPage.jsx
// import React from 'react';
// import '../css/OrderHistoryPage.css';

// function OrderHistoryPage() {
//   const orderData = [
//     { id: '#96459761', status: 'IN PROGRESS', date: 'Oct 24, 2024 07:52', total: 'Rp 150.000' },
//     { id: '#71667167', status: 'COMPLETED', date: 'Oct 24, 2019 23:26', total: 'Rp 150.000' }
//   ];

//   return (
//     <div className="order-history-page">
//       <h2 className='dropshipper-page-h2' >Order History</h2>
//       <table className="order-history-table">
//         <thead>
//           <tr>
//             <th>ORDER ID</th>
//             <th>STATUS</th>
//             <th>DATE</th>
//             <th>TOTAL</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orderData.map((order) => (
//             <tr key={order.id}>
//               <td>{order.id}</td>
//               <td className={order.status === 'COMPLETED' ? 'status-completed' : 'status-in-progress'}>
//                 {order.status}
//               </td>
//               <td>{order.date}</td>
//               <td>{order.total}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default OrderHistoryPage;

import React, { useState, useEffect } from "react";
import "../css/OrderHistoryPage.css";


function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch("http://localhost:3000/api/pemesanan");
      const data = await response.json();
      setOrders(data.data);
    };
    fetchOrders();
  }, []);

  return (
    <>
      <div className="order-history-page">
        <h2 className="dropshipper-page-h2">Order History</h2>
        <div className="order-history-cards">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div className="order-card" key={order.id_user}>
                <div className="order-header">
                  <span className="order-date">{order.tgl_memesan}</span>
                  <span
                    className={`order-status ${
                      order.status === "pending"
                        ? "order-status-pending"
                        : order.status === "dikirim"
                        ? "order-status-dikirim"
                        : order.status === "berhasil"
                        ? "order-status-berhasil"
                        : order.status === "batal"
                        ? "order-status-batal"
                        : ""
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id_produk}>
                        <td>
                          <img
                            src={`http://localhost:3000/api/fileProduk/${item.foto_produk}`}
                            alt={item.nama_produk}
                            className="product-image"
                          />
                        </td>
                        <td>{item.nama_produk}</td>
                        <td>{item.kuantitas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="order-total">
                  <span>
                    Total :{" "}
                    {`Rp ${Number(order.total_harga).toLocaleString("id-ID")}. -`}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="card-red">
              <p>Tidak ada history pemesanan</p>
            </div>
          )}
        </div>
      </div>
     
    </>
  );
}

export default OrderHistoryPage;

