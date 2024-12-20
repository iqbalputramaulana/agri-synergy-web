const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  uploadMiddleware,
  staticFileMiddleware,
  validateStaticFile,
} = require("../middlewares/upload-fileKomunitas");

const createKomunitas = require("../controllers/komunitas/create");
const readKomunitas = require("../controllers/komunitas/read");
const updateKomunitas = require("../controllers/komunitas/update");

router.use("/fileKomunitas", validateStaticFile, staticFileMiddleware);

router.use("/fileKomunitas/*", (req, res) => {
  res.status(400).json({
    success: false,
    code: 400,
    message: "File tidak ditemukan",
    data: null,
    timestamp: new Date().toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    }),
    errors: null,
  });
});

// router.post("/komunitas", passport.authenticate('jwt', { session: false }), uploadMiddleware, createKomunitas);
// router.get("/komunitas", passport.authenticate("jwt", { session: false }), readKomunitas);
// router.put("/komunitas/:id_komunitas", passport.authenticate("jwt", { session: false }), uploadMiddleware, updateKomunitas);

router.post("/komunitas", uploadMiddleware, createKomunitas);
router.get("/komunitas", readKomunitas);
router.put("/komunitas/:id_komunitas", uploadMiddleware, updateKomunitas);


module.exports = router;
