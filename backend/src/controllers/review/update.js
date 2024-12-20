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

const UPDATABLE_FIELDS = ["id_user", "id_produk", "rating", "koment"];

const validateFields = {
  validateUpdateData: async (req) => {
    const data = {};

    UPDATABLE_FIELDS.forEach((field) => {
      if (req.body[field]) {
        data[field] = req.body[field];
      }
    });

    return {
      isValid: true,
      data,
    };
  },
};

const updateReview = async (db, reviewId, updateData) => {
  const UpdateData = {
    ...updateData,
    tgl_masuk : new Date(),
  }

  const [rows] = await db
    .promise()
    .query("UPDATE review SET ? WHERE id_review = ?", [UpdateData, reviewId]);

  return rows.affectedRows;
};

module.exports = async (req, res) => {
  try {
    const validation = await validateFields.validateUpdateData(req);

    if (!validation.isValid) {
      return res.status(validation.error.code).json(validation.error);
    }

    const affectedRows = await updateReview(
      req.db,
      req.params.id_review,
      validation.data
    );

    if (affectedRows > 0) {
      return res
        .status(200)
        .json(RESPONSE.updateSuccess("Data review berhasil diupdate"));
    }

    return res
      .status(400)
      .json(RESPONSE.updateError(400, "Review tidak ditemukan"));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(RESPONSE.updateError(500, "Terjadi kesalahan pada server"));
  }
};
