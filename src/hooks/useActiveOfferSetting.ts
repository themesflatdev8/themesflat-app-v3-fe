import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/features/volume-customization/api";
import verifyAppApi from "@/api/verify-app";
import { _queryKey } from "@/constants/react-query";
import { useCommonContext } from "@/contexts/common";
import _typeReducer from "@/constants/reducer";

type Props = {};

export const useActiveOfferSetting = () => {
  let [{ isEnableAppEmbed, volumeDiscountSetting }, dispatch]: any =
    useCommonContext();

  useQuery(
    [_queryKey.getCustomizationQuantityBreaks, { hook: true }],
    async () => {
      let res = await api.getCustomization();
      let { status = false, data = null } = res;
      if (status && data) {
        dispatch({
          type: _typeReducer.SET_VOLUME_DISCOUNT_SETTING,
          payload: data,
        });
        return data;
      }
      return res;
    },
    {
      staleTime: 0,
      cacheTime: 0,
      enabled: !volumeDiscountSetting ? true : false,
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
    if (typeof isEnableAppEmbed == "undefined" || !volumeDiscountSetting) {
      return true;
    }
    if (volumeDiscountSetting?.settings?.visibility && isEnableAppEmbed) {
      return true;
    }
    return false;
  }, [isEnableAppEmbed, volumeDiscountSetting]);

  return {
    isEnableProduct,
  };
};
