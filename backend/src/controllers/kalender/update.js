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
  "jenis",
  "judul",
  "tanggal",
  "deskripsi",
  "gambar",
];

const validateFields = {
  validateUpdateData: async (req) => {
    const data = {};
    const emptyFields = [];

    for (const field of UPDATABLE_FIELDS) {
      if (field === "gambar") continue;

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

    if (!req.body.gambar) {
      const [rows] = await req.db
        .promise()
        .query("SELECT gambar FROM kalender WHERE id_kalender = ?", [
          req.params.id_kalender,
        ]);

      if (rows.length > 0) {
        data.gambar = rows[0].gambar;
      } else {
        return {
          isValid: false,
          error: {
            code: 400,
            message: "Gambar tidak ditemukan!",
          },
        };
      }
    } else {
      data.gambar = req.body.gambar;
    }

    return {
      isValid: true,
      data,
    };
  },
};

const updateKalender = async (db, kalenderId, updateData) => {
  const [rows] = await db
    .promise()
    .query("UPDATE kalender SET ? WHERE id_kalender = ?", [
      updateData,
      kalenderId,
    ]);
  return rows.affectedRows;
};

module.exports = async (req, res) => {
  try {
    const validation = await validateFields.validateUpdateData(req);

    if (!validation.isValid) {
      return res
        .status(validation.error.code)
        .json(
          RESPONSE.updateError(validation.error.code, validation.error.message)
        );
    }

    const affectedRows = await updateKalender(
      req.db,
      req.params.id_kalender,
      validation.data
    );

    if (affectedRows > 0) {
      return res
        .status(200)
        .json(RESPONSE.updateSuccess("Data kalender berhasil diupdate"));
    } else {
      return res
        .status(400)
        .json(RESPONSE.updateError(400, "Kalender tidak ditemukan"));
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(RESPONSE.updateError(500, "Terjadi kesalahan pada server"));
  }
};
