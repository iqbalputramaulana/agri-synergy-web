const express = require("express");
const router = express.Router();
const passport = require("passport");

const readKategori = require("../controllers/kategori/read");
const createKategori = require("../controllers/kategori/create");
const updateKategori = require("../controllers/kategori/update");
const deleteKategori = require("../controllers/kategori/delete");

// router.get("/kategori", passport.authenticate('jwt', { session: false }), readKategori);
// router.post("/kategori", passport.authenticate('jwt', { session: false }), createKategori);
// router.put("/kategori/:id_kategori", passport.authenticate('jwt', { session: false }), updateKategori);
// router.delete("/kategori/:id_kategori", passport.authenticate('jwt', { session: false }), deleteKategori);

router.get("/kategori", readKategori);
router.post("/kategori", createKategori);
router.put("/kategori/:id_kategori", updateKategori);
router.delete("/kategori/:id_kategori", deleteKategori);

module.exports = router;