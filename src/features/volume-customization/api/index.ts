import axios from "@/utils/axios";

export const getCustomization = () => {
  return axios({ url: "manage-offers/settings" });
};

export const update = (payload: any) => {
  return axios({
    url: "manage-offers/settings",
    method: "POST",
    data: payload,
  });
};

export default {
  getCustomization,
  update,
};
