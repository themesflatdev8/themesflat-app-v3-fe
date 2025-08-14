import axios from "@/utils/axios";

export const verifyAppBlock = (payload: any) => {
  return axios({
    url: "settings/verify-app-block",
    method: "POST",
    data: payload,
  });
};

export const verifyAppEmbed = () => {
  return axios({ url: "settings/verify-app-embed", method: "POST" });
};

export const verifyAppBlockQuantityBreak = () => {
  return axios({ url: "manage-offers/verify-app-block", method: "POST" });
};

export default {
  verifyAppBlock,
  verifyAppEmbed,
  verifyAppBlockQuantityBreak,
};
