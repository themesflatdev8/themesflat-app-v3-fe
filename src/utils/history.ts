import qs from "qs";
export const routerReplace = (url: string, query: any) => {
  let newQuery = qs.stringify(query);
  let newUrl = `${url}${newQuery ? `?${newQuery}` : ""}`;
  window.history.replaceState(
    { ...window.history.state, as: newUrl, url: newUrl },
    "",
    newUrl
  );
};
