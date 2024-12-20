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

  validateData: (req) => {
    const { id_memesan, status, tgl_pengiriman, tgl_penerima, harga } =
      req.body;

    const requiredFields = {
      id_memesan,
      tgl_pengiriman,
      harga,
    };

    const missingFieldsResult = validateFields.checkRequired(requiredFields);
    if (missingFieldsResult) {
      return {
        isValid: false,
        error: RESPONSE.createError(400, "Semua field harus diisi", {
          missingFields: missingFieldsResult,
        }),
      };
    }

    const validatedData = {
      ...requiredFields,
      status: status || "pending",
      tgl_penerima: tgl_penerima || null,
    };

    return {
      isValid: true,
      data: validatedData,
    };
  },
};

module.exports = async (req, res) => {
  try {
    const validation = await validateFields.validateData(req);

    if (!validation.isValid) {
      return res.status(validation.error.code).json(validation.error);
    }

    const [rows] = await req.db
      .promise()
      .query("INSERT INTO pengiriman SET ?", validation.data);

    if (rows.affectedRows > 0) {
      return res
        .status(200)
        .json(
          RESPONSE.createSuccess(rows, "Data pengiriman berhasil ditambahkan")
        );
    } else {
      return res
        .status(400)
        .json(RESPONSE.createError(400, "Data pengiriman gagal ditambahkan"));
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(RESPONSE.createError(500, "Terjadi kesalahan pada server"));
  }
};
