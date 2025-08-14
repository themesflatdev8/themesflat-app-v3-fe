import axios from "@/utils/axios";

export const getList = (payload: any) => {
  let { page = 1, limit = 10, keyword = "", status } = payload;
  let params: any = {
    page,
    limit,
  };
  keyword && (params["keyword"] = keyword);
  status && status.length && (params["status"] = status);
  return axios({ url: "manage-offers", params });
};

export const getDetail = (id: any = 0) => {
  return axios({ url: `manage-offers/detail/${id}` });
};

export const create = (payload: any) => {
  return axios({ url: "manage-offers/create", method: "POST", data: payload });
};

export const update = ({ id = 0, form }: any) => {
  return axios({ url: `manage-offers/edit/${id}`, method: "POST", data: form });
};

export const publish = (payload: any) => {
  let url = payload.isPublish
    ? "manage-offers/bulk-publish"
    : "manage-offers/bulk-unpublish";
  return axios({
    url,
    method: "POST",
    data: { ids: payload.ids, type: payload.type },
  });
};

export const remove = (payload: any) => {
  return axios({ url: "manage-offers/delete", method: "POST", data: payload });
};

export const getProductList = (payload: any) => {
  let { page = 1, limit = 10, keyword = "" } = payload;
  let params: any = {
    page,
    limit,
  };
  keyword && (params["product_title"] = keyword);
  return axios({ url: "manage-offers/list-products", params });
};

export default {
  getList,
  getDetail,
  create,
  update,
  getProductList,
  publish,
  remove,
};
