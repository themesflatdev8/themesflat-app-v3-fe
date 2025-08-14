import axios from "@/utils/axios";

export const auth = (data: any) => {
  return axios({ url: "exchange-token", method: "POST", data });
};

export default {
  auth,
};
