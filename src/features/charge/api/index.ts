import axios from "@/utils/axios";

export const getPlans = () => {
  return axios({ url: "plans" });
};

export const charge = (payload: any) => {
  return axios({ url: "/charge", method: "POST", data: payload });
};

export default {
  charge,
  getPlans,
};
