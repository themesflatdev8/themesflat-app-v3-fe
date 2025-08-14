import axios from "@/utils/axios";

export const getStatistics = (params: any) => {
  return axios({ url: "logs", params });
};

export default {
  getStatistics,
};
