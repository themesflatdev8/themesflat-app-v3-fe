export const TYPE_WELCOME_POPUP = "welcome";
export const TYPE_WHATNEW_POPUP = "whatnew";
export const TYPE_AFFILIATE_POPUP = "affiliate";
export const TYPE_PLAN_POPUP = "plan";

export const _popups = [
  {
    type: TYPE_WELCOME_POPUP,
  },
  {
    type: TYPE_WHATNEW_POPUP,
    multiRoute: true,
    closeRequest: true,
  },
  {
    type: TYPE_PLAN_POPUP,
  },
  {
    type: TYPE_AFFILIATE_POPUP,
    closeRequest: true,
  },
  // {
  //     functionName: 'openModalNewUpdateLimit',
  //     type: 'new_update_limit',
  //     multiRoute: true,
  //     closeRequest: true
  // },
  // {
  //     functionName: 'openModalPromotionEnded',
  //     type: 'promotion_ended'
  // }
];
