import axios from "@/utils/axios";

export const getPopup = () => {
  return axios({ url: "popup" });
};

export const closePopup = (data: any) => {
  return axios({ url: "popup", method: "POST", data });
};

export const getFlagList = () => {
  return axios({ url: "/lang/all-flags" });
};

export const getPopupWhatNews = (params: any) => {
  return axios({ url: "/popup/release-modal", params });
};

export const crawlHtml = (data: any) => {
  return axios({ url: "/theme", method: "POST", data });
};

export const getProducts = (params: any) => {
  return axios({ url: "products", params });
};

export const syncProducts = () => {
  return axios({ url: "/products/sync", method: "POST" });
};

export const completeQuestLoyalty = (data: any) => {
  return axios({ url: "membership", method: "POST", data });
};

export const applyLoyalty = () => {
  return axios({ url: "membership/apply", method: "POST" });
};

export const checkBundleLoyalty = () => {
  return axios({ url: "membership/check-bundle" });
};

export const getLoyalty = () => {
  return axios({ url: "membership" });
};

export default {
  getPopup,
  closePopup,
  getFlagList,
  getPopupWhatNews,
  crawlHtml,
  getProducts,
  syncProducts,
  getLoyalty,
  completeQuestLoyalty,
  checkBundleLoyalty,
  applyLoyalty,
};
