import { ROOT_CDN } from "@/config/env";

export const getImgFromServer = (path: string, name: string) => {
  if (!path || !name) return "";
  const pathIcons = path.replace("/storefront/", "");
  return `${ROOT_CDN}/${pathIcons}/${name}`;
};