import axios from "@/utils/axios";

export const syncDiscount = () => {
  return axios({
    url: "discount/sync",
    method: "POST",
  });
};


export default {
  syncDiscount,
};
