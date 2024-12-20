const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  getSuccess: (data, message) => ({
    success: true,
    code: 200,
    message,
    data,
    timestamp: getFormattedTimestamp(),
    errors: null,
  }),

  getError: (code, message, errors = null) => ({
    success: false,
    code,
    message,
    data: null,
    timestamp: getFormattedTimestamp(),
    errors,
  }),
};

module.exports = async (req, res) => {
    const { email, katasandi } = req.body;

    if (!email || !katasandi) {
        const errorResponse = RESPONSE.getError(400, "Email dan Katasandi harus diisi");
        return res.status(errorResponse.code).json(errorResponse);
    }

    try {
        const [rows] = await req.db
            .promise()
            .query("SELECT * FROM user WHERE email = ?", [email]);

        if (rows.length === 0) {
            const errorResponse = RESPONSE.getError(400, "Email tidak ditemukan");
            return res.status(errorResponse.code).json(errorResponse);
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(katasandi, user.katasandi);

        if (!isMatch) {
            const errorResponse = RESPONSE.getError(401, "Email atau Katasandi salah");
            return res.status(errorResponse.code).json(errorResponse);
        }

        const token = jwt.sign({ id_user: user.id_user }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        const successResponse = RESPONSE.getSuccess(
            { token, user },
            "Login berhasil"
        );
        return res.status(successResponse.code).json(successResponse);
        
    } catch (err) {
        console.error(err);
        const errorResponse = RESPONSE.getError(500, "Terjadi kesalahan server");
        return res.status(errorResponse.code).json(errorResponse);
    }
}