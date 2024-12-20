const express = require("express");
const router = express.Router();
const passport = require("passport");
const { uploadMiddleware, staticFileMiddleware, validateStaticFile } = require("../middlewares/upload-fileUsers");

const readUser = require("../controllers/user/read");
const createUser = require("../controllers/user/create");
const updateUser = require("../controllers/user/update");
const deleleteUser = require("../controllers/user/delete");

router.use("/fileUsers", validateStaticFile, staticFileMiddleware);

router.use('/fileUsers/*', (req, res) => {
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

router.get("/users/:id_user", readUser);
// router.get("/users", readUser);
router.post("/users", createUser);
router.put("/users/:id_user", uploadMiddleware, updateUser);
router.delete("/users/:id_user", deleleteUser);

module.exports = router;

