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
    message: rows.length > 0 
      ? "Data produk berhasil diambil" 
      : "Data produk tidak tersedia",
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

    const [countResult] = await req.db.promise().query(`
      SELECT COUNT(*) AS total 
      FROM produk p
      JOIN kategori k ON p.id_kategori = k.id_kategori
    `);
    const total = countResult[0].total;

    const [produk] = await req.db.promise().query(`
      SELECT 
        p.*,
        k.nama AS nama_kategori
      FROM produk p
      JOIN kategori k ON p.id_kategori = k.id_kategori
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const produkWithReviews = await Promise.all(
      produk.map(async (prod) => {
        const [reviews] = await req.db.promise().query(
          `
            SELECT 
              r.id_review,
              r.id_user,
              r.rating,
              r.koment AS komentar,
              u.nama AS nama_user
            FROM review r
            JOIN user u ON r.id_user = u.id_user
            WHERE r.id_produk = ?
          `,
          [prod.id_produk]
        );

        return {
          ...prod,
          reviews,
        };
      })
    );

    const responseData = getSuccessResponse(produkWithReviews, total);
    return res.status(responseData.code).json(responseData);
  } catch (err) {
    console.error(err);
    const responseData = getErrorResponse(err);
    return res.status(responseData.code).json(responseData);
  }
};