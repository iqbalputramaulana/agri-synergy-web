const bcrypt = require("bcrypt");
const {
  validasiEmail,
  validasiKatasandi,
  validasiHandphone,
} = require("../../utils/validation");

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
  updateSuccess: (message) => ({
    success: true,
    code: 200,
    message,
    data: null,
    timestamp: getFormattedTimestamp(),
    errors: null,
  }),

  updateError: (code, message, errors = null) => ({
    success: false,
    code,
    message,
    data: null,
    timestamp: getFormattedTimestamp(),
    errors,
  }),
};

const validateFields = {
  validateUpdateData: async (req, db) => {
    const { 
      nama, 
      alamat, 
      email, 
      no_hp, 
      provinsi, 
      kota, 
      kodepos,
      katasandi 
    } = req.body;
    const userId = req.params.id_user;

    const validations = [
      {
        condition: email && !validasiEmail(email),
        errorMessage: "Email tidak valid",
      },
      {
        condition: no_hp && !validasiHandphone(no_hp),
        errorMessage: "Nomor handphone tidak valid",
      },
    ];

    if (!provinsi || !kota || !kodepos) {
      const addressValidations = [
        {
          condition: !provinsi,
          errorMessage: "Provinsi harus diisi!",
        },
        {
          condition: !kota,
          errorMessage: "Kota harus diisi!",
        },
        {
          condition: !kodepos,
          errorMessage: "Kode pos harus diisi!",
        },
      ];

      validations.push(...addressValidations);
    }

    if (katasandi) {
      validations.push({
        condition: !validasiKatasandi(katasandi),
        errorMessage: "Kata sandi tidak valid",
      });
    }

    for (const validation of validations) {
      if (validation.condition) {
        return {
          isValid: false,
          error: RESPONSE.updateError(400, validation.errorMessage),
        };
      }
    }

    const [currentUser] = await db
      .promise()
      .query("SELECT email, no_hp FROM user WHERE id_user = ?", [userId]);

    if (currentUser.length === 0) {
      return {
        isValid: false,
        error: RESPONSE.updateError(400, "User tidak ditemukan"),
      };
    }

    if (email) {
      const [emailExists] = await db
        .promise()
        .query(
          "SELECT id_user FROM user WHERE email = ? AND id_user != ?", 
          [email, userId]
        );
      
      if (emailExists.length > 0) {
        return {
          isValid: false,
          error: RESPONSE.updateError(400, "Email sudah digunakan oleh user lain"),
        };
      }
    }

    if (no_hp) {
      const [phoneExists] = await db
        .promise()
        .query(
          "SELECT id_user FROM user WHERE no_hp = ? AND id_user != ?", 
          [no_hp, userId]
        );
      
      if (phoneExists.length > 0) {
        return {
          isValid: false,
          error: RESPONSE.updateError(400, "Nomor handphone sudah digunakan"),
        };
      }
    }
    

    const updateData = {
      ...(nama && { nama }),
      ...(alamat && { alamat }),
      ...(email && { email }),
      ...(no_hp && { no_hp }),
      ...(provinsi && { provinsi }),
      ...(kota && { kota }),
      ...(kodepos && { kodepos })
    };

    if (katasandi) {
      updateData.katasandi = await bcrypt.hash(katasandi, 10);
    }

    return {
      isValid: true,
      data: updateData,
    };
  },
};

module.exports = async (req, res) => {
  try {
    const validation = await validateFields.validateUpdateData(req, req.db);

    if (!validation.isValid) {
      return res.status(validation.error.code).json(validation.error);
    }

    if (Object.keys(validation.data).length === 0) {
      return res.status(400).json(RESPONSE.updateError(400, "Tidak ada data untuk diupdate"));
    }

    const [rows] = await req.db
      .promise()
      .query("UPDATE user SET ? WHERE id_user = ?", [
        validation.data,
        req.params.id_user,
      ]);

    if (rows.affectedRows > 0) {
      return res
        .status(200)
        .json(RESPONSE.updateSuccess("Data user berhasil diupdate"));
    }

    return res
      .status(400)
      .json(RESPONSE.updateError(400, "User tidak ditemukan"));

  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(RESPONSE.updateError(500, "Terjadi kesalahan pada server"));
  }
};