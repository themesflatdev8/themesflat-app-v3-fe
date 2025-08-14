import React, { createContext, useContext, useReducer } from "react";
import _typeReducer from "@/constants/reducer";

const CommonContext: any = createContext([{}, () => {}]);

const initialState = {
  leavePageConfirm: {
    to: "",
    from: "",
    enable: false,
  },
  loyalty: null,
  filtersBundle: null,
  filtersQuantityBreaks: null,
  isEnableAppBlockProductPage: undefined,
  isEnableAppEmbed: undefined,
  bundleSetting: null,
  volumeDiscountSetting: null,
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case _typeReducer.SET_LEAVE_PAGE_CONFIRM:
      return {
        ...state,
        leavePageConfirm: { ...state.leavePageConfirm, ...action.payload },
      };
    case _typeReducer.SET_LOYALTY:
      return {
        ...state,
        loyalty: state.loyalty
          ? { ...state.loyalty, ...action.payload }
          : { ...action.payload },
      };
    case _typeReducer.SET_FILTERS_BUNDLE:
      return {
        ...state,
        filtersBundle: { ...state.filtersBundle, ...action.payload },
      };
    case _typeReducer.SET_FILTERS_VOLUME_DISCOUNTS:
      return {
        ...state,
        filtersQuantityBreaks: { ...state.filtersBundle, ...action.payload },
      };
    case _typeReducer.SET_ENABLE_APP_BLOCK_PRODUCT_PAGE:
      return {
        ...state,
        isEnableAppBlockProductPage: action.payload ? true : false,
      };
    case _typeReducer.SET_ENABLE_APP_EMBED:
      return {
        ...state,
        isEnableAppEmbed: action.payload ? true : false,
      };
    case _typeReducer.SET_BUNDLE_SETTING:
      return {
        ...state,
        bundleSetting: { ...state.bundleSetting, ...action.payload },
      };
    case _typeReducer.SET_VOLUME_DISCOUNT_SETTING:
      return {
        ...state,
        volumeDiscountSetting: {
          ...state.volumeDiscountSetting,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

type Props = {
  children: React.ReactNode;
};

export const CommonProvider = ({ children }: Props) => {
  const [state, dispatch]: any = useReducer(reducer, initialState);

  return (
    <CommonContext.Provider value={[state, dispatch]}>
      {children}
    </CommonContext.Provider>
  );
};

export const useCommonContext = () => {
  return useContext(CommonContext);
};
