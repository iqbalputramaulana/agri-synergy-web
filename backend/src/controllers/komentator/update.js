const update = require("../user/update");

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

const RESPONSE = {
  updateSuccess: (message) => ({
    success: true,
    code: 200,
    message,
    data: null,
    timestamp: getFormattedTimestamp(),
    errors: null,
  }),

  updateError: (code, message, errors = null) => ({
    success: false,
    code,
    message,
    data: null,
    timestamp: getFormattedTimestamp(),
    errors,
  }),
};

const UPDATABLE_FIELDS = ["id_user", "id_komunitas", "deskripsi", "type"];

const validateFields = {
  validateUpdateData: (req) => {
    const data = {};

    UPDATABLE_FIELDS.forEach((field) => {
        if (field === 'id_user' || field === 'id_komunitas') {
            if (req.body[field] && req.body[field].trim() !== "") {
              data[field] = req.body[field].trim();
            }
          } else {
            if (req.body[field] !== undefined) {
              data[field] = req.body[field] === '' ? null : req.body[field].trim();
            }
          }
    });

    return {
      isValid: true,
      data,
    };
  },
};

const updateKomentator = async (db, komentatorId, updateData) => {
  const [rows] = await db
    .promise()
    .query("UPDATE komentator SET ? WHERE id_komentator = ?", [
      updateData,
      komentatorId,
    ]);

  return rows.affectedRows > 0;
};

module.exports = async (req, res) => {
  try {
    const validation = await validateFields.validateUpdateData(req);

    if (!validation.isValid) {
      return res.status(validation.error.code).json(validation.error);
    }

    const affectedRows = await updateKomentator(
      req.db,
      req.params.id_komentator,
      validation.data
    );

    if (affectedRows > 0) {
      return res
        .status(200)
        .json(RESPONSE.updateSuccess("Data komentator berhasil diupdate"));
    } else {
      return res
        .status(400)
        .json(RESPONSE.updateError(400, "komentator tidak ditemukan"));
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(RESPONSE.updateError(500, "Terjadi kesalahan pada server"));
  }
};
