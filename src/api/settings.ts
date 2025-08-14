import axios from "@/utils/axios";

export const getSettings = (params: any) => {
  return axios({ url: "all-settings", params });
};


export const updateSettings = (payload: any) => {
  return axios({ url: "all-settings", method: "POST", data: { type: payload.type, settings: payload.form} });
};
export default {
  getSettings,
  updateSettings,
};
