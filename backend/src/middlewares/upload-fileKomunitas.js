const multer = require("multer");
const path = require("path");
const fs = require("fs");
const express = require("express");
const { ERROR_MESSAGES } = require("../utils/imageValidation");

const getFormattedTimestamp = () => {
  return new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const FILE_TYPES = {
  ALLOWED_MIMETYPES: ["image/png", "image/jpg", "image/jpeg"],
  MAX_SIZE: 2 * 1024 * 1024,
  UPLOAD_PATH: path.join(__dirname, "../../files/komunitas"),
};

const RESPONSE = {
  createSuccess: (data, message) => ({
    success: true,
    code: 200,
    message,
    data,
    pagination: {
      total: data ? data.length : 0,
      per_page: data ? data.length : 0,
      current_page: 1,
      total_pages: 1,
    },
    timestamp: getFormattedTimestamp(),
    errors: null,
  }),

  createError: (code, message, errors = null) => ({
    success: false,
    code,
    message,
    data: null,
    pagination: null,
    timestamp: getFormattedTimestamp(),
    errors,
  }),
};

if (!fs.existsSync(FILE_TYPES.UPLOAD_PATH)) {
  fs.mkdirSync(FILE_TYPES.UPLOAD_PATH, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FILE_TYPES.UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}${path
      .extname(file.originalname)
      .toLowerCase()}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (!FILE_TYPES.ALLOWED_MIMETYPES.includes(file.mimetype)) {
    return cb(new Error(ERROR_MESSAGES.INVALID_FORMAT), false);
  }
  cb(null, true);
};

const imageUploader = multer({
  storage: storage,
  limits: {
    fileSize: FILE_TYPES.MAX_SIZE,
  },
  fileFilter: fileFilter,
});

const uploadMiddleware = (req, res, next) => {
  const upload = imageUploader.single("gambar");

  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json(RESPONSE.createError(400, ERROR_MESSAGES.FILE_TOO_LARGE));
        }
      }
      return res.status(400).json(RESPONSE.createError(400, err.message));
    }

    if (!req.file) {
      req.body.gambar = null; 
      return next();
    }

    req.body.gambar = req.file.filename;
    next();
  });
};

const validateStaticFile = (req, res, next) => {
  if (req.path === "/") {
    return next();
  }

  const ext = path.extname(req.path).toLowerCase();
  const allowedExt = [".jpg", ".jpeg", ".png"];

  if (!allowedExt.includes(ext)) {
    return res
      .status(403)
      .json(RESPONSE.createError(403, "Format file tidak diizinkan"));
  }
  next();
};

const staticFileMiddleware = (req, res, next) => {
  express.static(FILE_TYPES.UPLOAD_PATH)(req, res, (err) => {
    if (err) {
      return res
        .status(500)
        .json(RESPONSE.createError(500, "Error mengambil file"));
    }
    next();
  });
};

module.exports = {
  uploadMiddleware,
  validateStaticFile,
  staticFileMiddleware,
};