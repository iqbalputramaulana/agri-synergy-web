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
  "id_kategori",
  "nama",
  "harga",
  "stok",
  "deskripsi",
  "tanggal_diposting",
  "foto_produk",
];

const validateFields = {
  validateUpdateData: async (req) => {
    const data = {};
    const emptyFields = [];

    for (const field of UPDATABLE_FIELDS) {
      if (field === "foto_produk") continue;

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

    if (!req.body.foto_produk) {
      const [rows] = await req.db
        .promise()
        .query("SELECT foto_produk FROM produk WHERE id_produk = ?", [
          req.params.id_produk,
        ]);

      if (rows.length > 0) {
        data.foto_produk = rows[0].foto_produk;
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
      data.foto_produk = req.body.foto_produk;
    }

    return {
      isValid: true,
      data,
    };
  },
};

const updateProduct = async (db, productId, updateData) => {
  const [rows] = await db
    .promise()
    .query("UPDATE produk SET ? WHERE id_produk = ?", [updateData, productId]);

  return rows.affectedRows;
};

module.exports = async (req, res) => {
  try {
    const validation = await validateFields.validateUpdateData(req);

    if (!validation.isValid) {
      return res.status(validation.error.code).json(validation.error);
    }

    const affectedRows = await updateProduct(
      req.db,
      req.params.id_produk,
      validation.data
    );

    if (affectedRows > 0) {
      return res
        .status(200)
        .json(RESPONSE.updateSuccess("Data produk berhasil diupdate"));
    }

    return res
      .status(400)
      .json(RESPONSE.updateError(400, "Produk tidak ditemukan"));
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(RESPONSE.updateError(500, "Terjadi kesalahan pada server"));
  }
};
