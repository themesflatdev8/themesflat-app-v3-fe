export const STATUS_ACTIVE = "active";

export const TYPE_SPECIFIC = "specific";
export const TYPE_COLLECTION = "collection";
export const TYPE_GENERAL = "general";

export const STRATEGY_AI = "ai";
export const STRATEGY_MANUAL_PICK = "manual";

export const SWAPPABLE_OPTION_CROSS = "cross";
export const SWAPPABLE_OPTION_FIXED = "fixed";

export const PAGE_TYPE_PRODUCT = "product";
export const PAGE_TYPE_CART = "cart";
export const PAGE_TYPE_SEARCH = "search";

export const DISCOUNT_CONTENT_AMOUNT =
  "Buy {minimum_bundle_amount} to get {discount_value} OFF";
export const DISCOUNT_CONTENT_FREESHIPING =
  "Buy {minimum_bundle_amount} to get free shipping fee";
export const DISCOUNT_CONTENT_GIFT =
  "Buy {minimum_bundle_amount} to get {discount_value} off on gift product";

export const _formDefault = {
  name: "",
  status: 1,
  type: TYPE_SPECIFIC,
  list_default_ids: [],
  mode: STRATEGY_MANUAL_PICK,
  list_commendations: [],
  maxProduct: 10,
  selectable: 1, // 1,2,3
  useDiscount: 0,
  minimumAmount: "",
  promotionType: "discount", //freeship
  discountType: "percent", // percent/amount
  discountValue: "",
  discountContent: "Buy {minimum_bundle_amount} to get {discount_value} OFF",
  discountOncePer: 1,
  discountFreeshipType: "free",
  discountFreeshipContent:
    "Buy {minimum_bundle_amount} to get free shipping fee",
  discountFreeshipValue: "",
  countdownTimerActive: 0,
  countdownTimerValue: 30,
  countdownTimerSession: 15,
  countdownTimerReaches: 25,
  templateDesktop: "1",
  templateMobile: "1",
};
