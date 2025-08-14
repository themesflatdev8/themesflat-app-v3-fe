import { useEffect } from "react";
import { useRouter } from "next/router";

export const useRouteChangeLoader = () => {
  const router = useRouter();

  /**
   * Subscribe Next.js route update events (start, complete and error)
   * dispatch app-bridge loading actions approapreatly to start/finish shoing progressbar
   */
  useEffect(() => {
    const routeChangeStart = () => {
      shopify.loading(true);
    };

    const routeChangeEnd = () => {
      shopify.loading(false);
    };

    router.events.on("routeChangeStart", routeChangeStart);
    router.events.on("routeChangeComplete", routeChangeEnd);
    router.events.on("routeChangeError", routeChangeEnd);

    // If the component is unmounted, unsubscribe route events listeners
    return () => {
      router.events.off("routeChangeStart", routeChangeStart);
      router.events.off("routeChangeComplete", routeChangeEnd);
      router.events.off("routeChangeError", routeChangeEnd);
    };
  }, [router]);
};
