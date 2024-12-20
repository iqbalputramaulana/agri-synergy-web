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

module.exports = async (req, res) => {
  const getSuccessResponse = (rows) => ({
    success: rows.length > 0,
    code: 200,
    message:
      rows.length > 0
        ? "Data user berhasil diambil"
        : "Data user tidak tersedia",
    data: rows,
    pagination: {
      total: rows.length,
      per_page: rows.length,
      current_page: 1,
      total_pages: 1,
    },
    timestamp: getFormattedTimestamp(),
    errors: null,
  });

  const getErrorResponse = (err) => ({
    success: false,
    code: 500,
    message: "Terjadi kesalahan pada server",
    data: null,
    pagination: null,
    timestamp: getFormattedTimestamp(),
    errors: {
      message: err.message,
      code: err.code || "INTERNAL_SERVER_ERROR",
    },
  });

  try {
    const idUser = req.headers["id_user"];
    if (!idUser) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "id_user tidak ditemukan dalam permintaan",
        data: null,
        pagination: null,
        timestamp: getFormattedTimestamp(),
        errors: {
          message: "id_user harus disertakan dalam header",
          code: "BAD_REQUEST",
        },
      });
    }

    const [rows] = await req.db
      .promise()
      .query(idUser === "all"
        ? "SELECT * FROM user WHERE role = 'petani'"
        : "SELECT * FROM user WHERE id_user = ?",
      idUser === "all" ? [] : [idUser]);

    const responseData = getSuccessResponse(rows);
    return res.status(responseData.code).json(responseData);
  } catch (err) {
    console.error(err);
    const responseData = getErrorResponse(err);
    return res.status(responseData.code).json(responseData);
  }
};
