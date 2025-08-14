export const clone = (val: any) => {
  return JSON.parse(JSON.stringify(val));
};

export const includes = (arr: any, value: any) => {
  if (!arr) return false;
  return arr.some((v: any) => v == value);
};

export const isEqual = (val1: any, val2: any) => {
  let newVal1 = JSON.stringify(val1);
  let newVal2 = JSON.stringify(val2);
  return newVal1 == newVal2 ? true : false;
};

export const isEmpty = (val: any) => {
  if (!val) return true;
  if (typeof val == "object") {
    return !Object.keys(val).length;
  }
  if (typeof val == "string") {
    return !val;
  }
  return !val;
};

export const copy = (text: string) => {
  const elem = document.createElement("textarea");
  elem.value = text;
  document.body.appendChild(elem);
  elem.select();
  document.execCommand("copy");
  document.body.removeChild(elem);
};

export default {
  clone,
  includes,
  isEqual,
  isEmpty,
  copy,
};
