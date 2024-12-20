const express = require("express");
const router = express.Router();
const passport = require("passport");

const createKomentator = require("../controllers/komentator/create");
const readKomentator = require("../controllers/komentator/read");
const updateKomentator = require("../controllers/komentator/update");
const deleteKomentator = require("../controllers/komentator/delete");

// router.post("/komentator", passport.authenticate('jwt', { session: false }), createKomentator);
// router.get("/komentator", passport.authenticate('jwt', { session: false }), readKomentator);
// router.put("/komentator/:id_komentator", passport.authenticate('jwt', { session: false }), updateKomentator);
// router.delete("/komentator/:id_komentator", passport.authenticate('jwt', { session: false }), deleteKomentator);


router.post("/komentator", createKomentator);
router.get("/komentator", readKomentator);
router.put("/komentator/:id_komentator", updateKomentator);
router.delete("/komentator/:id_komentator", deleteKomentator);

module.exports = router;