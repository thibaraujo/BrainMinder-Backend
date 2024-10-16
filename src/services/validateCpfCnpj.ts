'use strict';

function calculateDigit(value: string) {
  const len = value.length;
  let sum = 0;
  for (let i = 0; i < len; i++) {
    sum += +value[len - i - 1] * (i + 2);
  }
  if (sum % 11 < 2) return 0;
  return 11 - (sum % 11);
}

export function validateCPF(cpfRaw: string) {
  let cpf = cpfRaw.substring(0, cpfRaw.length - 2).replace(/\D/g, '');
  if (cpf.length !== 9) {
    return false;
  }
  cpf = cpf + calculateDigit(cpf);
  cpf = cpf + calculateDigit(cpf);
  return cpf === cpfRaw.replace(/\D/g, '');
}

export function validateCNPJ(cnpj: string) {
  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj === '') return false;
  if (cnpj.length !== 14) return false;

  const invalidCNPJs = [
    '00000000000000',
    '11111111111111',
    '22222222222222',
    '33333333333333',
    '44444444444444',
    '55555555555555',
    '66666666666666',
    '77777777777777',
    '88888888888888',
    '99999999999999'
  ];

  if (invalidCNPJs.includes(cnpj)) return false;

  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let position = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += +numbers.charAt(size - i) * position--;
    if (position < 2) position = 9;
  }

  const result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== +digits.charAt(0)) return false;

  size += 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  position = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += +numbers.charAt(size - i) * position--;
    if (position < 2) position = 9;
  }

  const secondDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (secondDigit !== +digits.charAt(1)) return false;

  return true;
}
