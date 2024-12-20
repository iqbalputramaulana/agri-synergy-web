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

const UPDATABLE_FIELDS = [
  "id_user",
  "lokasi",
  "luas",
  "foto_lokasi",
  "jenis_tanah",
  "hasil_panen",
  "produksi",
  "deskripsi",
  "latitude",
  "longitude",
];

const validateFields = {
  validateUpdateData: async (req) => {
    const data = {};
    const emptyFields = [];

    for (const field of UPDATABLE_FIELDS) {
      if (field === "foto_lokasi") continue;

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

    if (!req.body.foto_lokasi) {
      const [rows] = await req.db
        .promise()
        .query("SELECT foto_lokasi FROM sawah WHERE id_sawah = ?", [
          req.params.id_sawah,
        ]);

      if (rows.length > 0) {
        data.foto_lokasi = rows[0].foto_lokasi;
      } else {
        return {
          isValid: false,
          error: {
            code: 400,
            message: `Field foto_lokasi kosong!`,
          },
        };
      }
    }

    return {
      isValid: true,
      data,
    };
  },
};

const updateSawah = async (db, sawahId, updateData) => {
  const sawahFields = ["id_user", "lokasi", "luas", "foto_lokasi"];
  const detailSawahFields = [
    "jenis_tanah",
    "hasil_panen",
    "produksi",
    "deskripsi",
    "latitude",
    "longitude",
  ];

  const sawahUpdateData = {};
  const detailSawahUpdateData = {};

  Object.keys(updateData).forEach((field) => {
    if (sawahFields.includes(field)) {
      sawahUpdateData[field] = updateData[field];
    }

    if (detailSawahFields.includes(field)) {
      detailSawahUpdateData[field] = updateData[field];
    }
  });

  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();
    let sawahAffectedRows = 0;
    let detailSawahAffectedRows = 0;

    if (Object.keys(sawahUpdateData).length > 0) {
      const [sawahResult] = await connection.query(
        "UPDATE sawah SET ? WHERE id_sawah = ?",
        [sawahUpdateData, sawahId]
      );

      sawahAffectedRows = sawahResult.affectedRows;
    }

    if (Object.keys(detailSawahUpdateData).length > 0) {
      const [detailSawahResult] = await connection.query(
        "UPDATE detail_sawah SET ? WHERE id_sawah = ?",
        [detailSawahUpdateData, sawahId]
      );

      detailSawahAffectedRows = detailSawahResult.affectedRows;
    }

    await connection.commit();

    return sawahAffectedRows > 0 || detailSawahAffectedRows > 0;
  } catch (err) {
    console.error(err);
    await connection.rollback();
    throw err;
  }
};

module.exports = async (req, res) => {
  try {
    const validation = await validateFields.validateUpdateData(req);

    if (!validation.isValid) {
      return res.status(validation.error.code).json(validation.error);
    }

    const affectedRows = await updateSawah(
      req.db,
      req.params.id_sawah,
      validation.data
    );

    if (affectedRows > 0) {
      return res
        .status(200)
        .json(RESPONSE.updateSuccess("Update sawah berhasil"));
    }

    return res
      .status(400)
      .json(RESPONSE.updateError(400, "Sawah tidak ditemukan"));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(RESPONSE.updateError(500, "Terjadi kesalahan pada server"));
  }
};
