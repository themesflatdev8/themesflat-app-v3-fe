import { CheckIcon, XSmallIcon } from "@shopify/polaris-icons";

export const PLAN_FREE = "free";
export const PLAN_ESSENTIAL = "essential";
export const PLAN_PREMIUM = "premium";

export const PRICING = "pricing";
export const CHOOSE_PLAN = "choose-plan";

export const _downgradePlan: any = {
  [`${PLAN_PREMIUM}_${PLAN_FREE}`]: [
    {
      icon: XSmallIcon,
      description: `Bundle Discount`,
    },
    {
      icon: XSmallIcon,
      description: "Customizable Storefront",
    },
    {
      icon: XSmallIcon,
      description: `Access to additional widget styles`,
    },
    {
      icon: XSmallIcon,
      description: "Unlimited number of orders with Free commission",
    },
    {
      icon: XSmallIcon,
      description: "Loyalty membership benefits",
    },
  ],
  [`${PLAN_PREMIUM}_${PLAN_FREE}_REVIEWED`]: [
    {
      icon: XSmallIcon,
      description: `Bundle Discount`,
    },
    {
      icon: XSmallIcon,
      description: "Customizable Storefront",
    },
    {
      icon: XSmallIcon,
      description: `Access to additional widget styles`,
    },
    {
      icon: XSmallIcon,
      description: "Unlimited number of orders with Free commission",
    },
  ],
  [`${PLAN_PREMIUM}_${PLAN_ESSENTIAL}`]: [
    {
      icon: XSmallIcon,
      description: `Unlimited number of orders`,
    },
    {
      icon: XSmallIcon,
      description: "Free commission per order",
    },
    {
      icon: XSmallIcon,
      description: `Access to Dedicated Servers`,
    },
  ],
  [`${PLAN_ESSENTIAL}_${PLAN_FREE}`]: [
    {
      icon: XSmallIcon,
      description: `Bundle Discount`,
    },
    {
      icon: XSmallIcon,
      description: "Customizable Storefront",
    },
    {
      icon: XSmallIcon,
      description: `Access to additional widget styles`,
    },
    {
      icon: XSmallIcon,
      description: "Loyalty membership benefits",
    },
  ],
  [`${PLAN_ESSENTIAL}_${PLAN_FREE}_REVIEWED`]: [
    {
      icon: XSmallIcon,
      description: `Bundle Discount`,
    },
    {
      icon: XSmallIcon,
      description: "Customizable Storefront",
    },
    {
      icon: XSmallIcon,
      description: `Access to additional widget styles`,
    },
  ],
};

export const _planList = [
  {
    name: "Free",
    code: PLAN_FREE,
    subtitle:
      "Perfect for businesses that are just starting out and want to test the waters with the app.",
    price: "0",
    perOrder: "",
    order: 1,
    features: {
      title: "Here's what you get",
      list: [
        {
          icon: CheckIcon,
          description: "Unlimited number of products and traffic",
        },
        {
          icon: CheckIcon,
          description: "Intelligent Personalization",
        },
        {
          icon: CheckIcon,
          description: "AI Product Recommendations",
        },
        {
          icon: CheckIcon,
          description: "Manual Product Recommendations",
        },
        {
          icon: CheckIcon,
          description: "Compatible with Online Store 2.0 themes",
        },
        {
          icon: CheckIcon,
          description: "Mobile friendly",
        },
        {
          icon: CheckIcon,
          description: "Email support",
        },
      ],
    },
  },
  {
    name: "Essential",
    code: PLAN_ESSENTIAL,
    subtitle:
      "Great for small businesses and want to save money compared to the Free Plan.",
    price: "9",
    perOrder: "",
    order: 2,
    features: {
      title: "Here's what you get",
      list: [
        {
          icon: CheckIcon,
          description: "All in Free",
        },
        {
          icon: CheckIcon,
          description: "Bundle Discount",
        },
        {
          icon: CheckIcon,
          description: "Customizable Storefront",
        },
        {
          icon: CheckIcon,
          description: "Exclusive access to additional widget styles",
        },
        {
          icon: CheckIcon,
          description: "Priority Support",
        },
      ],
    },
  },
];
