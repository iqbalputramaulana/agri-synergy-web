const express = require("express");
const router = express.Router();
const passport = require("passport");

const readPengiriman = require("../controllers/pengiriman/read");
const createPengiriman = require("../controllers/pengiriman/create");
const updatePengiriman = require("../controllers/pengiriman/update");
const deletePengiriman = require("../controllers/pengiriman/delete");

// router.get("/pengiriman", passport.authenticate('jwt', { session: false }), readPengiriman);
// router.post("/pengiriman", passport.authenticate('jwt', { session: false }), createPengiriman);
// router.put("/pengiriman/:id_pengiriman", passport.authenticate('jwt', { session: false }), updatePengiriman);
// router.delete("/pengiriman/:id_pengiriman", passport.authenticate('jwt', { session: false }), deletePengiriman);

router.get("/pengiriman", readPengiriman);
router.post("/pengiriman", createPengiriman);
router.put("/pengiriman/:id_pengiriman", updatePengiriman);
router.delete("/pengiriman/:id_pengiriman", deletePengiriman);

module.exports = router;