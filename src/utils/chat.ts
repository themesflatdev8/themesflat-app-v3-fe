export const openChat = () => {
  (window as any).FreshworksWidget && (window as any).FreshworksWidget("open");
};
