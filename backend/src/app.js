const express = require("express");
const cors = require("cors");
const injectDb = require("./middlewares/injectDb");
const bodyParser = require("body-parser");
const passport = require("passport");

const userRoutes = require("./routes/userRoutes");
const produkRoutes = require("./routes/produkRoutes");
const kalenderRoutes = require("./routes/kalenderRoutes");
const sawahRoutes = require("./routes/sawahRoutes");
const keranjangRoutes = require("./routes/keranjangRoutes");
const pemesananRoutes = require("./routes/pemesananRoutes");
const pengirimanRoutes = require("./routes/pengirimanRoutes");
const riwayatTransaksiRoutes = require("./routes/riwayat_transaksiRoutes");
const kategoriRoutes = require("./routes/kategoriRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const komunitasRoutes = require("./routes/komunitasRoutes");
const komentatorRoutes = require("./routes/komentatorRoutes");
const sendRoutes = require("./routes/sendRoutes");

const loginRoutes = require("./routes/loginRoutes");

const app = express();

app.use(passport.initialize());
require("./middlewares/passport");

app.use(cors());
app.use(bodyParser.json());
app.use(injectDb);

const apiRoutes = express.Router();
apiRoutes.use("/auth", loginRoutes);
apiRoutes.use(userRoutes);
apiRoutes.use(produkRoutes);
apiRoutes.use(kalenderRoutes);
apiRoutes.use(sawahRoutes);
apiRoutes.use(keranjangRoutes);
apiRoutes.use(pemesananRoutes);
apiRoutes.use(pengirimanRoutes);
apiRoutes.use(riwayatTransaksiRoutes);
apiRoutes.use(kategoriRoutes);
apiRoutes.use(reviewRoutes);
apiRoutes.use(komunitasRoutes);
apiRoutes.use(komentatorRoutes);
apiRoutes.use(sendRoutes);

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

module.exports = app;
