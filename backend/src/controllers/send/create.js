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
    createSuccess: (data, message) => ({
      success: true,
      code: 200,
      message,
      data,
      pagination: {
        total: data ? data.length : 0,
        per_page: data ? data.length : 0,
        current_page: 1,
        total_pages: 1,
      },
      timestamp: getFormattedTimestamp(),
      errors: null,
    }),
    createError: (code, message, errors = null) => ({
      success: false,
      code,
      message,
      data: null,
      pagination: null,
      timestamp: getFormattedTimestamp(),
      errors,
    }),
  };

  const validateFields = {
    checkRequired: (data) => {
      const missingFields = Object.entries(data)
        .filter(([, value]) => !value)
        .map(([key]) => key);
      return missingFields.length > 0 ? missingFields : null;
    },
    validateData: (req) => {
      const { id_konsultasi, petani_id, ahli_id, id_sender, message, gambar } =
        req.body;

      const requiredFields = {
        petani_id,
        ahli_id,
        id_sender,
        message,
      };

      const validationData = id_konsultasi
        ? { ...requiredFields, id_konsultasi }
        : requiredFields;

      const missingFields = validateFields.checkRequired(validationData);
      if (missingFields) {
        return {
          isValid: false,
          error: RESPONSE.createError(400, "Beberapa field wajib harus diisi", {
            missingFields: missingFields,
          }),
        };
      }
      return {
        isValid: true,
        data: {
          ...validationData,
          gambar: gambar || null,
        },
      };
    },
  };

  module.exports = async (req, res) => {
    const connection = req.db;

    try {
      const validation = await validateFields.validateData(req);
      if (!validation.isValid) {
        return res.status(validation.error.code).json(validation.error);
      }

      let id_konsultasi;

      const [existingKonsultasi] = await connection
        .promise()
        .query(
          "SELECT id_konsultasi FROM konsultasi WHERE (petani_id = ? AND ahli_id = ?) OR (petani_id = ? AND ahli_id = ?)",
          [
            validation.data.petani_id,
            validation.data.ahli_id,
            validation.data.ahli_id,
            validation.data.petani_id,
          ]
        );

      if (existingKonsultasi.length > 0) {
        id_konsultasi = existingKonsultasi[0].id_konsultasi;
      } else {

        const [konsultasiResult] = await connection
          .promise()
          .query("INSERT INTO konsultasi SET ?", {
            petani_id: validation.data.petani_id,
            ahli_id: validation.data.ahli_id,
          });
        id_konsultasi = konsultasiResult.insertId;
      }

      if (
        validation.data.id_sender !== validation.data.petani_id &&
        validation.data.id_sender !== validation.data.ahli_id
      ) {
        return res
          .status(400)
          .json(
            RESPONSE.createError(
              400,
              "ID Sender harus sesuai dengan ID User atau Ahli"
            )
          );
      }

      const insertData = {
        id_konsultasi: id_konsultasi,
        id_sender: validation.data.id_sender,
        message: validation.data.message,
        ...(validation.data.gambar && { gambar: validation.data.gambar }),
      };

      await connection
        .promise()
        .query("INSERT INTO chatingan SET ?", insertData);

      const responseData = {
        konsultasi: {
          id: id_konsultasi,
          petani_id: validation.data.petani_id,
          ahli_id: validation.data.ahli_id,
        },
        chatingan: {
          id_konsultasi: id_konsultasi,
          id_sender: validation.data.id_sender,
          message: validation.data.message,
          ...(validation.data.gambar && { gambar: validation.data.gambar }),
        },
      };

      return res
        .status(200)
        .json(
          RESPONSE.createSuccess(
            responseData,
            "Data konsultasi berhasil ditambahkan"
          )
        );
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json(RESPONSE.createError(500, "Terjadi kesalahan pada server"));
    }
  };
