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
  async deletePemesanan(db, pemesananId) {
    const [rows] = await db
      .promise()
      .query("DELETE FROM memesan WHERE id_memesan = ?", [pemesananId]);
    return rows.affectedRows > 0;
  },
};

module.exports = async (req, res) => {
  try {
    const isDeleted = await deleteService.deletePemesanan(
      req.db,
      req.params.id_memesan
    );
    if (!isDeleted) {
      return res.status(400).json(
        RESPONSE.deleteError(400, "pemesanan tidak ditemukan", {
          message: "ID pemesanan tidak ada dalam database",
          code: "PEMESANAN_NOT_FOUND",
        })
      );
    }
    return res
      .status(200)
      .json(RESPONSE.deleteSuccess("Data pemesanan berhasil dihapus"));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(RESPONSE.deleteError(500, "Terjadi kesalahan pada server"));
  }
};
