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
  const getSuccessResponse = (rows) => {
    const groupedData = rows.reduce((acc, current) => {
      const key = `${current.id_user}_${current.tgl_memesan}_${current.total_harga}`;
      if (!acc[key]) {
        acc[key] = {
          id_user: current.id_user,
          tgl_memesan: `${new Date(current.tgl_memesan).getDate()}/${new Date(current.tgl_memesan).getMonth() + 1}/${new Date(current.tgl_memesan).getFullYear()} ${new Date(current.tgl_memesan).toLocaleTimeString("en-US", {
            timeZone: "Asia/Jakarta",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}`,
          status: current.status,
          total_harga: current.total_harga,
          items: []
        };
      }
      acc[key].items.push({
        id_produk: current.id_produk,
        nama_produk: current.nama_produk,
        foto_produk: current.foto_produk,
        kuantitas: current.kuantitas
      });
      return acc;
    }, {});

    const responseData = {
      success: Object.keys(groupedData).length > 0,
      code: 200,
      message:
        Object.keys(groupedData).length > 0
          ? "Data pemesanan berhasil diambil"
          : "Data pemesanan tidak tersedia",
      data: Object.values(groupedData),
      pagination: {
        total: Object.keys(groupedData).length,
        per_page: Object.keys(groupedData).length,
        current_page: 1,
        total_pages: 1,
      },
      timestamp: getFormattedTimestamp(),
      errors: null,
    };
    return responseData;
  };

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
    const [rows] = await req.db.promise().query(`
    SELECT 
    memesan.*,
    produk.nama AS nama_produk, 
    produk.foto_produk
    FROM memesan
    LEFT JOIN produk ON produk.id_produk = memesan.id_produk
    WHERE memesan.id_memesan IS NOT NULL;
    `);
    const responseData = getSuccessResponse(rows);
    return res.status(responseData.code).json(responseData);
  } catch (err) {
    console.error(err);
    const responseData = getErrorResponse(err);
    return res.status(responseData.code).json(responseData);
  }
};