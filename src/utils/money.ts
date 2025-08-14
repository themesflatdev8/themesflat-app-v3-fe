export const convertMoney = (value: any) => {
  if (!value) return "";
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatMoney = (value: any, fixed = 2) => {
  if (!value) return 0;
  return Number(Number(value).toFixed(fixed));
};

export const getMoneyByDiscountPercent = (price: any, value: any) => {
  if (!price || !value) return 0;
  return (Number(price) * Number(value)) / 100;
};

export const getMoneyByDiscountAmount = (price: any, value: any) => {
  if (!price || !value) return 0;
  return (Number(value) / Number(price)) * 100;
};

export const getMoneyRemaining = (price: any, value: any) => {
  if (!price || !value) return 0;
  return formatMoney(Number(price) - Number(value));
};

export const formatInputPrice = (val: any) => {
  if (!val) return "";
  return `${val}`.replace(/\D/gi, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatOutputPrice = (val: any) => {
  if (!val) return "";
  let newVal = `${val}`.replace(/[^\d.]/g, "");
  return Number.parseFloat(newVal).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  }); // "1,234.57"
};

export const getOnlyDigit = (val: any) => {
  if (!val) return "";
  return `${val}`.replace(/[^\d]/g, "");
};

export const getOnlyNumeric = (val: any) => {
  if (!val) return "";
  return `${val}`.replace(/[^\d.]/g, "");
};

export const getOnlyAmount = (val: any) => {
  if (!val) return "";
  return `${val}`.replace(/[^\d,.]/g, "");
};

export const getOnlyPercent = (val: any) => {
  if (!val) return "";
  let newVal = `${val}`.replace(/[^\d.]/g, "");
  return `${+Number.parseFloat(newVal).toFixed(2)}`;
};
