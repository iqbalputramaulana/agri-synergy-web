import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import BRIIcon from "../assets/payment/BRIVA.jpg";
import GoPayIcon from "../assets/payment/GOPAY.jpg";
import ShopeePayIcon from "../assets/payment/SHOPEEPAY.png";
import "../css/PaymentModal.css";
import { useNavigate } from "react-router-dom";

const PaymentModal = ({ onClose, totalAmount, updateUser, keranjang }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const idUser = localStorage.getItem("id_user");

  const handlePaymentMethodSelect = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    updateUser();

    try {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("jwtToken")}`;

      const getFormattedTimestamp = () => {
        return new Date().toLocaleString("en-US", {
          timeZone: "Asia/Jakarta",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
      };

      const indonesiaTime = getFormattedTimestamp();
      const tanggal = indonesiaTime.replace(
        /(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})/,
        "$3-$1-$2 $4:$5:$6"
      );

      const paymentData = keranjang.map((item) => ({
        id_user: idUser,
        id_produk: item.id_produk,
        kuantitas: item.total_produk,
        total_harga: totalAmount,
        tgl_memesan: tanggal,
        status: "pending",
      }));

      if(paymentData.length === 0) {
        toast.error("Keranjang kosong!", {
          position: "top-right",
          autoClose: 1500,
        });
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/pemesanan",
        paymentData
      );

      if (response.status === 200) {
        const result = await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Pemesanan berhasil!",
          confirmButtonText: "Lihat Order",
          cancelButtonText: "Kembali ke Home",
          showCancelButton: true,
        });

        if (result.isConfirmed) {
          navigate("/orderhistory");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2 className="payment-amount">{`Rp ${totalAmount.toLocaleString(
          "id-ID"
        )}. -`}</h2>

        <h3>Last payment method</h3>
        <div
          className="payment-method"
          onClick={() => handlePaymentMethodSelect("BRI")}
        >
          <img src={BRIIcon} alt="BRI" className="payment-icon" />
          <p>BRI Virtual Account</p>
        </div>

        <h3>All payment methods</h3>
        <div
          className="payment-method"
          onClick={() => handlePaymentMethodSelect("GoPay")}
        >
          <img src={GoPayIcon} alt="GoPay" className="payment-icon" />
          GoPay
        </div>
        <div
          className="payment-method"
          onClick={() => handlePaymentMethodSelect("ShopeePay")}
        >
          <img src={ShopeePayIcon} alt="ShopeePay" className="payment-icon" />
          ShopeePay
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
