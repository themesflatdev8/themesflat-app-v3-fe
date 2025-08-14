import axios from "@/utils/axios";

export const setupGuide = (payload: any) => {
  return axios({
    url: "/dashboard/setup-guide",
    method: "POST",
    data: payload,
  });
};

export default {
  setupGuide,
};
