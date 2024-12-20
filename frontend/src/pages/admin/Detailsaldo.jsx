import "../../css/detailsaldo.css";
import Sidebar from "../../components/Sidebar";
import { FaWallet, FaArrowDown, FaArrowUp } from "react-icons/fa6";

const DetailSaldo = () => {
  return (
    <>
      <Sidebar />
      <div className="detail1">
        <h5>Detail Saldo</h5>
      </div>
      <div className="card2">
        <div className="card-content">
          <div className="icon2">
            <FaWallet className="icon-wallet" />
          </div>
          <div className="title2">
            <p>Total Saldo Aktif</p>
            <h5>Rp. 150.000,-</h5>
            <div className="balance-movement">
              <div className="up">
                <FaArrowUp />
                <p>150.000,-</p>
              </div>
              <div className="down">
                <FaArrowDown />
                <p>150.000,-</p>
              </div>
            </div>
          </div>
        </div>
        <div className="btn1">
          <button>Tarik Saldo</button>
        </div>
      </div>

      <div className="card3">
        <div className="title3">
          <h6>Transaksi Sukses</h6>
        </div>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Status</th>
                <th>Date</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#96459761</td>
                <td style={{ color: "green" }}>COMPLETED</td>
                <td>Oct 24, 2019 23:26</td>
                <td>Rp 150.000,-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DetailSaldo;
