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

const UPDATABLE_FIELDS = ["nama"];

const validateFields = {
  validateUpdateData: async (req) => {
    const data = {};

    UPDATABLE_FIELDS.forEach((field) => {
      if (req.body[field] && req.body[field].trim() !== "") {
        data[field] = req.body[field].trim();
      }
    });

    if(!data.nama || data.nama === "") {
      return{
        isValid: false,
        error: RESPONSE.updateError(400, "Kategori tidak boleh kosong!")
      }
    }

    return {
      isValid: true,
      data,
    };
  },
};

const updateKategori = async (db, kategoriId, updateData) => {
  const [rows] = await db
    .promise()
    .query("UPDATE kategori SET ? WHERE id_kategori = ?", [
      updateData,
      kategoriId,
    ]);

  return rows.affectedRows;
};

module.exports = async (req, res) => {
  try {
    const validation = await validateFields.validateUpdateData(req);

    if (!validation.isValid) {
      return res.status(validation.error.code).json(validation.error);
    }

    const affectedRows = await updateKategori(
      req.db,
      req.params.id_kategori,
      validation.data
    );

    if (affectedRows > 0) {
      return res
        .status(200)
        .json(RESPONSE.updateSuccess("Data kategori berhasil diupdate"));
    } else {
      return res
        .status(400)
        .json(RESPONSE.updateError(400, "kategori tidak ditemukan"));
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(RESPONSE.updateError(500, "Terjadi kesalahan pada server"));
  }
};
