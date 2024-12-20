const express = require("express");
const router = express.Router();
const passport = require("passport");
const { uploadMiddleware, staticFileMiddleware, validateStaticFile } = require("../middlewares/upload-filePetalahan");

const readSawah = require("../controllers/sawah/read");
const createSawah = require("../controllers/sawah/create");
const updateSawah = require("../controllers/sawah/update");
const deleteSawah = require("../controllers/sawah/delete");

router.use("/fileSawah", validateStaticFile, staticFileMiddleware);

router.use('/fileSawah/*', (req, res) => {
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

// router.get("/sawah", passport.authenticate('jwt', { session: false }), readSawah);
// router.post("/sawah", passport.authenticate('jwt', { session: false }), createSawah);
// router.put("/sawah/:id_sawah", passport.authenticate('jwt', { session: false }), updateSawah);
// router.delete("/sawah/:id_sawah", passport.authenticate('jwt', { session: false }), deleteSawah);

router.get("/sawah", readSawah);
router.post("/sawah", uploadMiddleware, createSawah);
router.put("/sawah/:id_sawah", uploadMiddleware,updateSawah);
router.delete("/sawah/:id_sawah", deleteSawah);

module.exports = router;