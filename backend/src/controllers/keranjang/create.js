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

const validateFields = {
  checkRequired: (data) => {
    const missingFields = Object.entries(data)
      .filter(([, value]) => !value)
      .map(([key]) => key);
    return missingFields.length > 0 ? missingFields : null;
  },

  validateData: async (req, db) => {
    const { id_produk, id_user, total_produk } = req.body;
    const requiredFields = { id_produk, id_user, total_produk };

    const missingFieldsResult = validateFields.checkRequired(requiredFields);
    if (missingFieldsResult) {
      return {
        isValid: false,
        error: RESPONSE.createError(400, "total produk tidak boleh kurang dari 1", {
          missingFields: missingFieldsResult,
        }),
      };
    }

    if (total_produk < 1) {
      return {
        isValid: false,
        error: RESPONSE.createError(400, "Jumlah produk minimal 1"),
      };
    }

    const [product] = await db.promise().query(
      "SELECT * FROM produk WHERE id_produk = ?",
      [id_produk]
    );

    if (product.length === 0) {
      return {
        isValid: false,
        error: RESPONSE.createError(400, "Produk tidak ditemukan"),
      };
    }

    const availableStock = product[0].kuantitas;
    const productPrice = product[0].harga;

    if (total_produk > availableStock) {
      return {
        isValid: false,
        error: RESPONSE.createError(400, `Stok produk tidak mencukupi. Stok tersedia ${availableStock}`),
      };
    }

    const total_harga = total_produk * productPrice;

    return {
      isValid: true,
      data: {
        id_produk, 
        id_user, 
        total_produk, 
        total_harga
      },
    };
  },
};

module.exports = async (req, res) => {
  try {
    const validation = await validateFields.validateData(req, req.db);

    if (!validation.isValid) {
      return res.status(validation.error.code).json(validation.error);
    }

    const [rows] = await req.db
      .promise()
      .query("INSERT INTO keranjang SET ?", validation.data);

    if (rows.affectedRows > 0) {
      return res
        .status(200)
        .json(
          RESPONSE.createSuccess(rows, "Data keranjang berhasil ditambahkan")
        );
    } else {
      return res
        .status(400)
        .json(RESPONSE.createError(400, "Data keranjang gagal ditambahkan"));
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(RESPONSE.createError(500, "Terjadi kesalahan pada server"));
  }
};