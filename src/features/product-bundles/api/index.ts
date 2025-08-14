import axios from "@/utils/axios";

export const getList = (payload: any) => {
  let {
    page = 1,
    limit = 10,
    keyword = "",
    bundle_type,
    status,
    pageType = "",
  } = payload;
  let params: any = {
    page,
    limit,
    pageType,
  };
  keyword && (params["keyword"] = keyword);
  bundle_type && bundle_type.length && (params["bundle_type"] = bundle_type);
  // cross_option && cross_option.length && (params['cross_option'] = cross_option)
  // mode && (params['mode'] = mode)
  status && (params["status"] = status);
  return axios({ url: "manage-bundles", params });
};

export const getDetail = (id: any = 0, params: any) => {
  return axios({ url: `manage-bundles/detail/${id}`, params });
};

export const getFirstProductBundlePublish = (id: any = 0) => {
  return axios({ url: `manage-bundles/first-publish` });
};

export const checkDiscountLimit = (id: any = 0) => {
  return axios({
    url: `manage-bundles/check-discount-limit`,
    params: { bundle_id: id },
  });
};

export const create = (payload: any) => {
  return axios({ url: "manage-bundles/create", method: "POST", data: payload });
};

export const update = ({ id = 0, form }: any) => {
  return axios({
    url: `manage-bundles/edit/${id}`,
    method: "POST",
    data: form,
  });
};

export const generate = (payload: any) => {
  return axios({
    url: `manage-bundles/bulk-generate`,
    method: "POST",
    data: payload,
  });
};

export const generateAll = () => {
  return axios({ url: `manage-bundles/generate-bundles`, method: "POST" });
};

export const generateAi = (payload: any) => {
  return axios({
    url: `manage-bundles/generate-ai`,
    method: "POST",
    data: payload,
  });
};

export const publish = (payload: any) => {
  let url = payload.isPublish
    ? "manage-bundles/bulk-publish"
    : "manage-bundles/bulk-unpublish";
  return axios({
    url,
    method: "POST",
    data: { ids: payload.ids, type: payload.type },
  });
};

export const remove = (payload: any) => {
  return axios({ url: "manage-bundles/delete", method: "POST", data: payload });
};

export const syncProducts = () => {
  return axios({ url: `manage-bundles/sync-products`, method: "POST" });
};

export const getProductList = (payload: any) => {
  let { page = 1, limit = 10, keyword = "", idExclude = "" } = payload;
  let params: any = {
    page,
    limit,
  };
  keyword && (params["product_title"] = keyword);
  idExclude && (params["product_bundle_id"] = idExclude);
  return axios({ url: "manage-bundles/list-products", params });
};

export const getCollectionList = (payload: any) => {
  let { page = 1, limit = 10, keyword = "" } = payload;
  let params: any = {
    page,
    limit,
  };
  keyword && (params["title"] = keyword);
  return axios({ url: "manage-bundles/list-collections", params });
};

export default {
  getList,
  getDetail,
  create,
  update,
  generate,
  generateAll,
  syncProducts,
  getProductList,
  getCollectionList,
  publish,
  getFirstProductBundlePublish,
  checkDiscountLimit,
  remove,
  generateAi,
};
