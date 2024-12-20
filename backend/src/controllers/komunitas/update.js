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

const UPDATABLE_FIELDS = ["like_count", "dislike_count"];

const validateFields = {
  validateUpdateData: async (req) => {
    const data = {};
    const emptyFields = [];

    // Validasi hanya untuk like_count dan dislike_count
    for (const field of UPDATABLE_FIELDS) {
      if (req.body[field] !== undefined && req.body[field] !== null) {
        if (
          typeof req.body[field] === "string" &&
          req.body[field].trim() === ""
        ) {
          emptyFields.push(field);
        } else {
          data[field] = req.body[field];
        }
      }
    }

    if (emptyFields.length > 0) {
      return {
        isValid: false,
        error: {
          code: 400,
          message: `Field ${emptyFields.join(", ")} kosong!`,
        },
      };
    }

    return {
      isValid: true,
      data,
    };
  },
};

const updateKomunitas = async (db, komunitasId, updateData) => {
  // Ambil data like_count dan dislike_count yang ada
  const [rows] = await db
    .promise()
    .query(
      "SELECT like_count, dislike_count FROM komunitas WHERE id_komunitas = ?",
      [komunitasId]
    );

  const currentLikeCount = rows[0].like_count || 0;
  const currentDislikeCount = rows[0].dislike_count || 0;

  // Menggunakan data yang diterima hanya untuk like_count dan dislike_count
  const updatedData = {
    like_count:
      updateData.like_count !== undefined
        ? currentLikeCount + updateData.like_count
        : currentLikeCount,
    dislike_count:
      updateData.dislike_count !== undefined
        ? currentDislikeCount + updateData.dislike_count
        : currentDislikeCount,
  };

  // Lakukan update hanya pada like_count dan dislike_count
  const [updateResult] = await db
    .promise()
    .query(
      "UPDATE komunitas SET like_count = ?, dislike_count = ? WHERE id_komunitas = ?",
      [updatedData.like_count, updatedData.dislike_count, komunitasId]
    );

  return updateResult.affectedRows;
};

module.exports = async (req, res) => {
  try {
    // Validasi data yang diterima
    const validation = await validateFields.validateUpdateData(req);

    if (!validation.isValid) {
      return res
        .status(validation.error.code)
        .json(
          RESPONSE.updateError(validation.error.code, validation.error.message)
        );
    }

    if (Object.keys(validation.data).length === 0) {
      return res
        .status(400)
        .json(RESPONSE.updateError(400, "Tidak ada data yang diupdate"));
    }

    // Proses pembaruan data komunitas
    const affectedRows = await updateKomunitas(
      req.db,
      req.params.id_komunitas,
      validation.data
    );

    if (affectedRows > 0) {
      return res
        .status(200)
        .json(RESPONSE.updateSuccess("Data komunitas berhasil diupdate"));
    } else {
      return res
        .status(400)
        .json(RESPONSE.updateError(400, "Komunitas tidak ditemukan"));
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(RESPONSE.updateError(500, "Terjadi kesalahan pada server"));
  }
};
