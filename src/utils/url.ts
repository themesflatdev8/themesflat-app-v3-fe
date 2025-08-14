import { ROOT_API } from "@/config/env";

export function getURL(path = "") {
  return `${ROOT_API || "http://localhost:3000"}${path}`;
}

export function getMedia(url: string) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }
  return url.startsWith("/") ? getURL(url) : url;
}
