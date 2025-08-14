import React, { useEffect, useState, useCallback, useMemo } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import { NavMenu } from "@shopify/app-bridge-react";
import { useAuthContext } from "@/features/auth/contexts";
import { useCommonContext } from "@/contexts/common";
import { Loading } from "@/components/core";
import LayoutEmpty from "@/components/layouts/Empty";
import api from "@/features/auth/api";
import apiCommon from "@/api";
import _routes from "@/constants/routes";
import { _typeReducer } from "@/features/auth/constants";
import _typeReducerCommon from "@/constants/reducer";
import { isEmpty } from "@/utils/lodash";
import { IS_TEST } from "@/config/env";
import { _navigationMenu, _navigationMenuBlock } from "@/constants/navigation";

type Props = {
  children: React.ReactNode;
};

const MiddlewareAuth = ({ children }: Props) => {
  const router = useRouter();
  const { query, route } = router;
  const [isLoading, setLoading] = useState(true);
  const [isLoadedAuth, setIsLoadedAuth] = useState(false);
  let [{ store }, dispatch]: any = useAuthContext();
  let [, dispatchCommon]: any = useCommonContext();

  useEffect(() => {
    (async () => {
      let queryTemp = { ...query };
      queryTemp["id"] && delete queryTemp["id"];
      const storeRes: any = await api.auth(queryTemp);
      let { status = false, data = null } = storeRes;
      if (status) {
        if (IS_TEST) {
          data.bl = true;
        }
        dispatch({ type: _typeReducer.SET_STORE, payload: data });
        // apiCommon.getLoyalty().then((res: any) => {
        //   if (res) {
        //     let obj = {
        //       one: res.quest_review,
        //       two: res.quest_ext,
        //       three: res.quest_bundle,
        //       isComplete: res.loyalty,
        //       apply: res.apply || false,
        //       congratulationsStatus: res.congratulations_status ? true : false,
        //       email: res.email || ""
        //     }
        //     dispatchCommon({type: _typeReducerCommon.SET_LOYALTY, payload: obj})
        //   }
        // })
        setIsLoadedAuth(true);
      }
    })();
  }, []);

  function authCheck(url: string) {
    const path = url.split("?")[0];

    // if (path == _routes.CONTACT) {
    //   if(!(!store.test && (store.shopify_plan.includes("affiliate") || store.shopify_plan.includes("partner") || store.shopify_plan.includes("sandbox")))){
    //     router.push(_routes.HOME)
    //     return
    //   }
    //   setLoading(false)
    //   return
    // }

    // if(path == _routes.CHOOSE_PLAN){
    //   if(store.app_plan){
    //     router.push(_routes.HOME)
    //     return
    //   }
    //   setLoading(false)
    //   return
    // }

    // if (!store.test && (store.shopify_plan.includes("affiliate") || store.shopify_plan.includes("partner") || store.shopify_plan.includes("sandbox"))) {
    //   router.push(_routes.CONTACT)
    //   return
    // }

    // if(!store.app_plan){
    //   router.push(_routes.CHOOSE_PLAN)
    //   return
    // }

    if (!isEmpty(store.bl) && path == _routes.LOYALTY) {
      router.push(_routes.HOME);
      return;
    }

    setLoading(false);
  }

  const navigation = useMemo(() => {
    // if (!store) return [];
    // if (!isEmpty(store?.bl)) {
    //   return _navigationMenuBlock;
    // }
    return _navigationMenu;
  }, [store]);

  const nav = useCallback(
    (key: string) => {
      return (
        <NavMenu key={key}>
          <a
            href="/"
            rel="home"
            onClick={(e) => {
              e.preventDefault();
              router.push("/");
            }}
          >
            Home
          </a>
          {navigation.map((item: any) => (
            <a
              key={item.destination}
              href={item.destination}
              onClick={(e) => {
                e.preventDefault();
                router.push(item.destination);
              }}
            >
              {item.label}
            </a>
          ))}
        </NavMenu>
      );
    },
    [navigation]
  );

  useEffect(() => {
    if (store) {
      authCheck(route);
    }
  }, [store, route]);

  useEffect(() => {
    const onStartChangeRoute = (pathName: string) => {
      const path = pathName.split("?")[0];
      if (path != "/") {
        setLoading(true);
      }
    };
    router.events.on("routeChangeStart", onStartChangeRoute);
    return () => {
      router.events.off("routeChangeStart", onStartChangeRoute);
    };
  }, []);

  return (
    <>
      {!isLoading ? nav("first") : nav("last")}

      {!isLoadedAuth ? <Loading /> : isLoading ? <Loading /> : children}
    </>
  );
};
export default MiddlewareAuth;
