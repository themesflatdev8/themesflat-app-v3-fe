export const STATUS_ACTIVE = "active";

export const TIER_DETAIL_MSG_USE_DISCOUNT =
  "Buy {quantity} and get a {discount_value} OFF";
export const TIER_DETAIL_MSG_NOT_USE_DISCOUNT = "";

export const _formDefault = {
  name: "",
  product_id: "",
  status: 1,
  mostPopularActive: 1,
  mostPopularPosition: "1",
  tiers: [
    {
      name: "Single",
      quantity: "1",
      message: "Buy {quantity} and get a {discount_value} OFF",
      useDiscount: 0,
      discountType: "percent", // percent/amount
      discountValue: "",
    },
  ],
  countdownTimerActive: 0,
  countdownTimerValue: 30,
  countdownTimerSession: 15,
  countdownTimerReaches: 25,
};
