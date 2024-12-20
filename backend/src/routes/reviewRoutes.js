const express = require("express");
const router = express.Router();
const passport = require("passport");

const createReview = require("../controllers/review/create");
const readReview = require("../controllers/review/read");
const updateReview = require("../controllers/review/update");
const deleteReview = require("../controllers/review/delete");

// router.post("/review", passport.authenticate('jwt', { session: false }), createReview);
// router.get("/review", passport.authenticate('jwt', { session: false }), readReview);
// router.put("/review/:id_review", passport.authenticate('jwt', { session: false }), updateReview);
// router.delete("/review/:id_review", passport.authenticate('jwt', { session: false }), deleteReview);

router.post("/review", createReview);
router.get("/review", readReview);
router.put("/review/:id_review", updateReview);
router.delete("/review/:id_review", deleteReview);

module.exports = router;