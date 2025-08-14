import { default as instance } from "axios";
import { ROOT_API } from "@/config/env";
// import { getSessionToken } from "@shopify/app-bridge-utils";
import { isShopifyEmbedded } from "@shopify/app-bridge-utils";
import { inIframe } from "./iframe";

let AxiosConfig = {
  baseURL: ROOT_API + "/api" || "",
  timeout: 60 * 1000,
  validateStatus: function (status: any) {
    return status >= 200 && status <= 500;
  },
};

let axiosInstance: any = instance.create(AxiosConfig);
axiosInstance.CancelToken = instance.CancelToken;
axiosInstance.isCancel = instance.isCancel;

axiosInstance.interceptors.request.use(async function (config: any) {
  let token = "";
  let session = "";
  if (isShopifyEmbedded()) {
    // token = typeof(window) != 'undefined' && await getSessionToken((window as any).appBridge) || ""
    token = await (window as any).shopify.idToken();
    session = typeof window != "undefined" && (window as any).sessionShopify;
  }
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  if (session) {
    config.headers["session"] = session;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  function (res: any) {
    let { status, data } = res;
    handleHttpError(status, data);
    return {
      ...data,
      status: status == 200,
      statusCode: status,
    };
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

const handleHttpError = (status: number, data: any) => {
  if (status) {
    switch (status) {
      case 500:
        console.log("error Internal Server Error 500");
        // if(data.sentryId){
        // 	router.push(`${routes.ERROR_SERVER}?sentryId=${data.sentryId}`)
        // }
        break;
      case 429:
        console.log("error API LIMIT REQUEST");
        break;
      case 404:
        console.log("error API Not Found");
        // router.push(routes.ERROR_PAGE_NOT_FOUND)
        break;
      case 400:
        console.log("error Bad Request 400");
        break;
      case 401:
        if (data && typeof data.data == "string") {
          if (inIframe()) {
            window.open(data.data, "_top");
          } else if (typeof window != "undefined") {
            window.location.href = data.data;
          }
        }
        console.log("error Unauthorized 401");
        // redirect auth
        break;
      case 403:
        console.log("error Forbidden 403");
        break;
    }
  }
};

export default axiosInstance;
