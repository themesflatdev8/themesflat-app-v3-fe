import { useMemo } from "react";
import { Frame } from "@shopify/polaris";
import Popups from "@/components/shared/Popups";
import QuickSetup from "@/features/quick-setup/components/Main";
import { useAuthContext } from "@/features/auth/contexts";

const Layout = ({ children }: any) => {
  const [{ store }]: any = useAuthContext();

  const requireQuickSetup = useMemo(() => {
    if (!store || !store.setup_guide) return true;
    let obj = store.setup_guide?.quickSetup || null;
    if (!obj) return true;
    if (obj.skip || obj.complete) return false;
    return true;
  }, [store]);

  return (
    <>
      <Frame>

        {children}
        {/* <Popups /> */}
        {/* {requireQuickSetup ? (
          <QuickSetup></QuickSetup>
        ) : (
          <>
            {children}
            <Popups />
          </>
        )} */}
      </Frame>
    </>
  );
};

export default Layout;
