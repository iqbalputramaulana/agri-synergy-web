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
    message,
    data: null,
    timestamp: getFormattedTimestamp(),
    errors: null,
  }),

  deleteError: (code, message, errors = null) => ({
    success: false,
    code,
    message,
    data: null,
    timestamp: getFormattedTimestamp(),
    errors,
  }),
};

const deleteService = {
  async deleteReview(db, reviewId) {
    const [rows] = await db
      .promise()
      .query("DELETE FROM review WHERE id_review = ?", [reviewId]);
    return rows.affectedRows > 0;
  },
};

module.exports = async (req, res) => {
  try {
    const isDeleted = await deleteService.deleteReview(
      req.db,
      req.params.id_review
    );

    if (!isDeleted) {
      return res.status(400).json(
        RESPONSE.deleteError(400, "Review tidak ditemukan", {
          message: "ID review tidak ada dalam database",
          code: "REVIEW_NOT_FOUND",
        })
      );
    }

    return res
      .status(200)
      .json(RESPONSE.deleteSuccess("Data review berhasil dihapus"));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(RESPONSE.deleteError(500, "Terjadi kesalahan pada server"));
  }
};
