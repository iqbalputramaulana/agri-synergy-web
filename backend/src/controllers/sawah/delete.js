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
  async deleteSawah(db, sawahId) {
    const connection = await db.promise().getConnection();
    try {
      await connection.beginTransaction();

      const [deleteSawahResult] = await connection.query(
        "DELETE FROM sawah WHERE id_sawah = ?",
        [sawahId]
      );

      if (deleteSawahResult.affectedRows > 0) {
        await connection.commit();
        return true;
      }

      await connection.rollback();
      return false;
    } catch (err) {
      console.error(err);
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
};

module.exports = async (req, res) => {
  try {
    const isDeleted = await deleteService.deleteSawah(
      req.db,
      req.params.id_sawah
    );

    if (!isDeleted) {
      return res.status(400).json(
        RESPONSE.deleteError(400, "Sawah tidak ditemukan", {
          message: "ID sawah tidak ada dalam database",
          code: "SAWAH_NOT_FOUND",
        })
      );
    }

    return res
      .status(200)
      .json(RESPONSE.deleteSuccess("Data sawah berhasil dihapus"));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(RESPONSE.deleteError(500, "Terjadi kesalahan pada server"));
  }
};
