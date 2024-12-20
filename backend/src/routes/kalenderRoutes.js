const express = require("express");
const router = express.Router();
const passport = require("passport");
const { uploadMiddleware, staticFileMiddleware, validateStaticFile } = require("../middlewares/upload-fileKalender");

const createKalender = require("../controllers/kalender/create");
const readKalender = require("../controllers/kalender/read");
const updateKalender = require("../controllers/kalender/update");
const deleteKalender = require("../controllers/kalender/delete");

router.use("/fileKalender", validateStaticFile, staticFileMiddleware);

router.use('/fileKalender/*', (req, res) => {
  res.status(400).json({
    success: false,
    code: 400,
    message: "File tidak ditemukan",
    data: null,
    timestamp: new Date().toLocaleString("en-US", {
      timeZone: "Asia/Jakarta"
    }),
    errors: null
  });
});

// router.get("/kalender", passport.authenticate('jwt', { session: false }), readKalender);
// router.post("/kalender", passport.authenticate('jwt', { session: false }), createKalender);
// router.put("/kalender/:id_kalender", passport.authenticate('jwt', { session: false }), updateKalender);
// router.delete("/kalender/:id_kalender", passport.authenticate('jwt', { session: false }), deleteKalender);

router.get("/kalender", readKalender);
router.post("/kalender",  uploadMiddleware, createKalender);
router.put("/kalender/:id_kalender",  uploadMiddleware, updateKalender);
router.delete("/kalender/:id_kalender", deleteKalender);

module.exports = router;