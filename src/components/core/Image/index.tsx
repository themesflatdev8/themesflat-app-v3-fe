import NextImage from "next/image";
import { ROOT_URL } from "@/config/env";

export function getURL(path = "") {
  return `${ROOT_URL || "http://localhost:3000"}${path}`;
}

export function getMedia(url: string) {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }
  return url.startsWith("/") ? getURL(url) : url;
}

export default function Image({ src, root, ...rest }: any) {
  return <NextImage {...rest} src={root ? src : getMedia(src)} />;
}
