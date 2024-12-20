const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
    uploadMiddleware,
    staticFileMiddleware,
    validateStaticFile,
  } = require("../middlewares/upload-fileChat");

const readSend = require("../controllers/send/read");
const createSend = require("../controllers/send/create");
const readAhli = require("../controllers/send/readAhli");

router.use("/fileChat", validateStaticFile, staticFileMiddleware);

router.use("/fileChat/*", (req, res) => {
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

// router.get("/send", passport.authenticate('jwt', { session: false }), readSend);
// router.post("/send", passport.authenticate('jwt', { session: false }), uploadMiddleware, createSend);
// router.get("/ahli", passport.authenticate('jwt', { session: false }), readAhli);

router.get("/ahli", readAhli);
router.get("/send", readSend);
router.post("/send", uploadMiddleware, createSend);

module.exports = router;