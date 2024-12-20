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

const UPDATABLE_FIELDS = ["id_memesan", "status", "tgl_pengiriman", "tgl_penerima", "harga"];

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

const updatePengiriman = async (db, pengirimanId, updateData) => {
  const [rows] = await db
    .promise()
    .query("UPDATE pengiriman SET ? WHERE id_pengiriman = ?", [
      updateData,
      pengirimanId,
    ]);

  return rows.affectedRows;
};

module.exports = async (req, res) => {
  try {
    const validation = await validateFields.validateUpdateData(req);

    if (!validation.isValid) {
      return res.status(validation.error.code).json(validation.error);
    }

    const affectedRows = await updatePengiriman(
      req.db,
      req.params.id_pengiriman,
      validation.data
    );

    if (affectedRows > 0) {
      return res
        .status(200)
        .json(RESPONSE.updateSuccess("Pengiriman behasil"));
    } else {
      return res
        .status(400)
        .json(RESPONSE.updateError(400, "Pengiriman tidak ditemukan"));
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(RESPONSE.updateError(500, "Terjadi kesalahan pada server"));
  }
};
