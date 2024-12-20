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
        ? "Data chatingan berhasil diambil"
        : "Data chatingan tidak tersedia",
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
    const [konsultasi] = await req.db
      .promise()
      .query("SELECT * FROM konsultasi");

    const konsultasiWithSend = await Promise.all(
      konsultasi.map(async (kon) => {
        const [send] = await req.db.promise().query(
          `
          SELECT
          kk.id_chat,
          kk.id_sender,
          kk.gambar AS file,
          u.nama AS nama_pengguna,
          u.foto,
          u.role,
          kk.message,
          kk.sent_at
          FROM chatingan kk
          JOIN user u ON kk.id_sender = u.id_user
          WHERE kk.id_konsultasi = ?`,
          [kon.id_konsultasi]
        );

        return {
          ...kon,
          send,
        };
      })
    );

    const responseData = getSuccessResponse(konsultasiWithSend);
    return res.status(responseData.code).json(responseData);
  } catch (err) {
    console.error(err);
    const responseData = getErrorResponse(err);
    return res.status(responseData.code).json(responseData);
  }
};
