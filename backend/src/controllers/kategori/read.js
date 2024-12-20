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
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const getSuccessResponse = (rows, total) => ({
    success: rows.length > 0,
    code: 200,
    message:
      rows.length > 0
        ? "Data kategori berhasil diambil"
        : "Data kategori tidak tersedia",
    data: rows,
    pagination: {
      total: total,
      per_page: limit,
      current_page: page,
      total_pages: Math.ceil(total / limit),
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
    const [countResult] = await req.db
      .promise()
      .query("SELECT COUNT(*) AS total FROM kategori");
    const total = countResult[0].total;

    const [rows] = await req.db
      .promise()
      .query("SELECT * FROM kategori LIMIT ? OFFSET ?", [limit, offset]);

    const responseData = getSuccessResponse(rows, total);
    return res.status(responseData.code).json(responseData);
  } catch (err) {
    console.error(err);
    const responseData = getErrorResponse(err);
    return res.status(responseData.code).json(responseData);
  }
};
