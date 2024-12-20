const validasiEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validasiKatasandi = (katasandi) => {
  const katasandiRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return katasandiRegex.test(katasandi);
};

const validasiHandphone = (no_hp) => {
    const no_hpRegex = /^(?:\+62|62|0)\d{9,13}$/;
    return no_hpRegex.test(no_hp);
  };
  

module.exports = { validasiEmail, validasiKatasandi, validasiHandphone };
