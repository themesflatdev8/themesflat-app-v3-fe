export const getLocalStorage = (key: string) => {
  try {
    let stringValue = localStorage.getItem(key);
    if (stringValue !== null) {
      let obj = JSON.parse(stringValue);
      let expirationDate = new Date(obj.timeout);
      if (expirationDate > new Date()) {
        return obj.data;
      } else {
        localStorage.removeItem(key);
      }
    }
    return null;
  } catch (err) {
    console.log("error", err);
  }
};

// add into session
export const setLocalStorage = (
  key: string,
  value: any,
  expire: number = 999999
) => {
  try {
    let expirationDate = new Date(new Date().getTime() + 60000 * expire);
    let newValue = {
      data: value,
      timeout: expirationDate.toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(newValue));
  } catch (err) {
    console.log("error", err);
  }
};

// add into session
export const removeLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.log("error", err);
  }
};

export const getSessionStorage = (key: string) => {
  try {
    let stringValue = sessionStorage.getItem(key);
    if (stringValue !== null) {
      let obj = JSON.parse(stringValue);
      let expirationDate = new Date(obj.expire);
      if (expirationDate > new Date()) {
        return obj.value;
      } else {
        sessionStorage.removeItem(key);
      }
    }
    return null;
  } catch (err) {
    console.log("error", err);
  }
};

// add into session
export const setSessionStorage = (
  key: string,
  value: any,
  expire: number = 10
) => {
  try {
    let expirationDate = new Date(new Date().getTime() + 60000 * expire);
    let newValue = {
      value: value,
      expire: expirationDate.toISOString(),
    };
    sessionStorage.setItem(key, JSON.stringify(newValue));
  } catch (err) {
    console.log("error", err);
  }
};
