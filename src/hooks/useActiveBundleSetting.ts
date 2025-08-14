import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/features/bundle-customization/api";
import verifyAppApi from "@/api/verify-app";
import { _queryKey } from "@/constants/react-query";
import {
  PAGE_TYPE_PRODUCT,
  PAGE_TYPE_CART,
  PAGE_TYPE_SEARCH,
} from "@/features/product-bundles/constants";
import { useCommonContext } from "@/contexts/common";
import _typeReducer from "@/constants/reducer";
import {
  FEATURE_TYPE_PRODUCT_BUNDLES,
} from "@/constants/settings";

type Props = {
  pageType: string;
};

export const useActiveBundleSetting = ({ pageType = "" }) => {
  let [
    { isEnableAppBlockProductPage, isEnableAppEmbed, bundleSetting },
    dispatch,
  ]: any = useCommonContext();

  useQuery(
    [_queryKey.getCustomization, { hook: true, pageType: "product" }],
    async () => {
      let res = await api.getCustomization();
      let { status = false, data = null } = res;
      if (status && data) {
        dispatch({ type: _typeReducer.SET_BUNDLE_SETTING, payload: data });
        return data;
      }
      return res;
    },
    {
      staleTime: undefined,
      cacheTime: undefined,
      enabled: !bundleSetting ? true : false,
    }
  );

  useQuery(
    [_queryKey.verifyAppBlock, { type: FEATURE_TYPE_PRODUCT_BUNDLES }],
    async () => {
      let res = await verifyAppApi.verifyAppBlock({
        type: FEATURE_TYPE_PRODUCT_BUNDLES,
      });
      let { status = false, verify = false } = res;
      dispatch({
        type: _typeReducer.SET_ENABLE_APP_BLOCK_PRODUCT_PAGE,
        payload: verify,
      });
      return verify;
    },
    {
      enabled:
        isEnableAppBlockProductPage == undefined &&
        pageType == PAGE_TYPE_PRODUCT,
    }
  );

  useQuery(
    [_queryKey.verifyAppEmbed],
    async () => {
      let res = await verifyAppApi.verifyAppEmbed();
      let { status = false, verify = false } = res;
      dispatch({ type: _typeReducer.SET_ENABLE_APP_EMBED, payload: verify });
      return verify;
    },
    {
      enabled: isEnableAppEmbed == undefined,
    }
  );

  const isEnableProduct = useMemo(() => {
    if (typeof isEnableAppBlockProductPage == "undefined" || !bundleSetting) {
      return true;
    }
    if (bundleSetting?.settings?.visibility && isEnableAppBlockProductPage) {
      return true;
    }
    return false;
  }, [isEnableAppBlockProductPage, bundleSetting]);

  const isEnableCart = useMemo(() => {
    if (typeof isEnableAppEmbed == "undefined" || !bundleSetting) {
      return true;
    }
    if (bundleSetting?.settings?.visibility && isEnableAppEmbed) {
      return true;
    }
    return false;
  }, [isEnableAppEmbed, bundleSetting]);

  return {
    isEnableProduct,
    isEnableCart,
  };
};
