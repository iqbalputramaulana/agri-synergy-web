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
    const { id_user, id_komunitas, deskripsi, type } = req.body;
    const requiredFields = {
      id_user,
      id_komunitas,
      deskripsi: deskripsi || null,
      type: type || null,
    };

    const missingFieldsResult = validateFields.checkRequired({
      id_user,
      id_komunitas,
    });

    if (missingFieldsResult) {
      return {
        isValid: false,
        error: RESPONSE.createError(400, "Semua field harus diisi", {
          missingFields: missingFieldsResult,
        }),
      };
    }

    return {
      isValid: true,
      data: requiredFields,
    };
  },
};

module.exports = async (req, res) => {
  try {
    const validation = validateFields.validateData(req);
    if (!validation.isValid) {
      return res.status(validation.error.code).json(validation.error);
    }

    let query = "INSERT INTO komentator (id_user, id_komunitas";
    let values = [validation.data.id_user, validation.data.id_komunitas];

    if (validation.data.deskripsi) {
      query += ", deskripsi";
      values.push(validation.data.deskripsi);
    }

    if (validation.data.type) {
      query += ", type";
      values.push(validation.data.type);
    }

    query += ") VALUES (?, ?";
    if (validation.data.deskripsi) {
      query += ", ?";
    }
    if (validation.data.type) {
      query += ", ?";
    }

    query += ")";

    const [rows] = await req.db.promise().query(query, values);

    if (rows.affectedRows > 0) {
      return res
        .status(200)
        .json(
          RESPONSE.createSuccess(rows, "Data komentator berhasil ditambahkan")
        );
    } else {
      return res
        .status(400)
        .json(RESPONSE.createError(400, "Data komentator gagal ditambahkan"));
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(RESPONSE.createError(500, "Terjadi kesalahan pada server"));
  }
};
