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
        ? "Data komunitas berhasil diambil"
        : "Data komunitas tidak tersedia",
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
    // Query komunitas dengan JOIN untuk mengambil nama_user dan role
    const [komunitas] = await req.db.promise().query(`
      SELECT 
        k.*, 
        u.nama AS nama_user, 
        u.role AS role_user 
      FROM komunitas k
      LEFT JOIN user u ON k.id_user = u.id_user
    `);

    const responseData = getSuccessResponse(komunitas);
    return res.status(responseData.code).json(responseData);
  } catch (err) {
    console.error(err);
    const responseData = getErrorResponse(err);
    return res.status(responseData.code).json(responseData);
  }
};
