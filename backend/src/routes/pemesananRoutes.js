const express = require("express");
const router = express.Router();
const passport = require("passport");

const readPemesanan = require("../controllers/pemesanan/read");
const createPemesanan = require("../controllers/pemesanan/create");
const updatePemesanan = require("../controllers/pemesanan/update");
const deletePemesanan = require("../controllers/pemesanan/delete");

// router.get("/pemesanan", passport.authenticate('jwt', { session: false }), readPemesanan);
// router.post("/pemesanan", passport.authenticate('jwt', { session: false }), createPemesanan);
// router.put("/pemesanan/:id_memesan", passport.authenticate('jwt', { session: false }), updatePemesanan);
// router.delete("/pemesanan/:id_memesan", passport.authenticate('jwt', { session: false }), deletePemesanan);

router.get("/pemesanan", readPemesanan);
router.post("/pemesanan", createPemesanan);
router.put("/pemesanan/:id_memesan", updatePemesanan);
router.delete("/pemesanan/:id_memesan", deletePemesanan);

module.exports = router;