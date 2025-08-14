import axios from "@/utils/axios";

export const getCustomization = () => {
  return axios({ url: "settings" });
};

export const update = (payload: any) => {
  return axios({ url: "settings", method: "POST", data: payload });
};

export default {
  getCustomization,
  update,
};
