import { useState, useEffect } from "react";
import { useRouter } from "next/router";

type Props = {
  children: React.ReactNode;
};

export function SessionProvider({ children }: Props) {
  const { query } = useRouter();

  // const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // session shopify
    (window as any).sessionShopify = query.session || "";
    // (async () => {
    //   const session = await getSessionToken(app);
    //   if (!session) {
    //     window.location.pathname = `/api/auth/shopify/login`;
    //   }
    //   setIsLoading(false)
    // })();
  }, []);

  // if(isLoading){
  //   return (
  //     <></>
  //   )
  // }

  return <>{children}</>;
}
