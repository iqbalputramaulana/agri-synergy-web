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
  deleteSuccess: (message) => ({
    success: true,
    code: 200,
    message: message,
    data: null,
    pagination: null,
    timestamp: getFormattedTimestamp(),
    errors: null,
  }),
  deleteError: (code, message, errors) => ({
    success: false,
    code: code,
    message: message,
    data: null,
    pagination: null,
    timestamp: getFormattedTimestamp(),
    errors: errors,
  }),
};

const deleteService = {
  async deleteKeranjang(db, keranjangId) {
    const [rows] = await db
      .promise()
      .query("DELETE FROM keranjang WHERE id_keranjang = ?", [keranjangId]);
    return rows.affectedRows > 0;
  },
};

module.exports = async (req, res) => {
  try {
    const isDeleted = await deleteService.deleteKeranjang(
      req.db,
      req.params.id_keranjang
    );
    if (!isDeleted) {
      return res.status(400).json(
        RESPONSE.deleteError(400, "keranjang tidak ditemukan", {
          message: "ID keranjang tidak ada dalam database",
          code: "KERANJANG_NOT_FOUND",
        })
      );
    }
    return res
      .status(200)
      .json(RESPONSE.deleteSuccess("Data keranjang berhasil dihapus"));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(RESPONSE.deleteError(500, "Terjadi kesalahan pada server"));
  }
};
