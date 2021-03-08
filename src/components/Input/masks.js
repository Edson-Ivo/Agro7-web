export const masks = {
  cnpj: v => {
    v = v.replace(/\D/g, '');
    v = v.replace(/^(\d{2})(\d)/, '$1.$2');
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');

    return v;
  },

  cpf: v => {
    v = v.replace(/\D/g, '');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    return v;
  },

  cpf_cnpj: v =>
    v.replace(/[^0-9]/g, '').length <= 11 ? masks.cpf(v) : masks.cnpj(v),

  phone: v => {
    v = v.replace(/\D/g, '');
    v = v.replace(/(.{0})(\d)/, '$1($2');
    v = v.replace(/(.{3})(\d)/, '$1) $2');

    if (v.length === 10) {
      v = v.replace(/(.{1})$/, '-$1');
    } else if (v.length === 11) {
      v = v.replace(/(.{2})$/, '-$1');
    } else if (v.length === 12) {
      v = v.replace(/(.{3})$/, '-$1');
    } else if (v.length === 13) {
      v = v.replace(/(.{4})$/, '-$1');
    } else if (v.length >= 14) {
      v = v.replace(/(.{4})$/, '-$1');
    }

    return v;
  }
};
