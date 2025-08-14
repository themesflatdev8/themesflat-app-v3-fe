import React, { useCallback, useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Page, Card, Text, Icon, Tooltip } from "@shopify/polaris";
import { 
  RewardIcon, PaymentIcon, ProductIcon, ButtonPressIcon, ClockIcon,
  ProductReturnIcon, DatabaseIcon, DeliveryIcon, CartSaleIcon,
  CartIcon,
  SettingsIcon,
} from "@shopify/polaris-icons";
import styled from "styled-components";
import _routes from "@/constants/routes";
import { Container } from "@/components/core";
import { useAuthContext } from "@/features/auth/contexts";
import { isEmpty } from "@/utils/lodash";
import ProductBundles from "@/features/product-bundles/components/Main";
import ProductBundleForm from "@/features/product-bundles/components/Form";
import ProductBundleCustomization from "@/features/bundle-customization/components/Main";
import VolumeDiscounts from "@/features/volume-discounts/components/Main";
import VolumeDiscountCustomization from "@/features/volume-customization/components/Main";
import FormTrustBadges from "@/features/trust-badges/components/Form"
import FormPaymentBadges from "@/features/payment-badges/components/Form"
import FormTrustBadgesOnCart from "@/features/trust-badges-on-cart/components/Form";
import FormPaymentBadgesOnCart from "@/features/payment-badges-on-cart/components/Form";
import FormSocialMediaButtons from "@/features/social-media-buttons/components/Form";
import FormSalesPopup from "@/features/sales-popup/components/Form";
import FormCountdownTimerBar from "@/features/countdown-timer-bar/components/Form";
import FormCountdownTimerBarOnCart from "@/features/countdown-timer-bar-on-cart/components/Form";
import FormStockCountdown from "@/features/stock-countdown/components/Form";
import { 
  FEATURE_TYPE_TRUST_BADGES,
  FEATURE_TYPE_PAYMENT_BADGES,
  FEATURE_TYPE_TRUST_BADGES_ON_CART,
  FEATURE_TYPE_PAYMENT_BADGES_ON_CART,
  FEATURE_TYPE_SOCIAL_MEDIA_BUTTONS,
  FEATURE_TYPE_SALES_POPUP,
  FEATURE_TYPE_COUNTDOWN_TIMER_BAR,
  FEATURE_TYPE_COUNTDOWN_TIMER_BAR_ON_CART,
  FEATURE_TYPE_STOCK_COUNTDOWN,
  FEATURE_TYPE_FREE_SHIPPING_BAR,
  FEATURE_TYPE_PRODUCT_BUNDLES,
  FEATURE_TYPE_PRODUCT_BUNDLES_ON_CART,
  FEATURE_TYPE_PRODUCT_BUNDLES_CUSTOMIZATION,
  FEATURE_TYPE_QUANTITY_BREAKS,
  FEATURE_TYPE_QUANTITY_BREAKS_CUSTOMIZATION,
} from "@/constants/settings";
import { PAGE_TYPE_CART, PAGE_TYPE_PRODUCT } from "@/features/product-bundles/constants";

const FeaturesPage: NextPage = () => {
  const router = useRouter();
  const [{ store }]: any = useAuthContext();

  const tabs = useMemo(() => {
    return [
      {
        title: "Frequent bought together",
        children: [
          {
            id: 110,
            title: "Product page",
            type: FEATURE_TYPE_PRODUCT_BUNDLES,
            icon: ProductIcon,
          },
          {
            id: 111,
            title: "Cart page/drawer",
            type: FEATURE_TYPE_PRODUCT_BUNDLES_ON_CART,
            icon: CartIcon,
          },
          {
            id: 112,
            title: "Display settings",
            type: FEATURE_TYPE_PRODUCT_BUNDLES_CUSTOMIZATION,
            icon: SettingsIcon,
          },
        ]
      },
      {
        title: "Volume discounts",
        children: [
          {
            id: 210,
            title: "Product page",
            type: FEATURE_TYPE_QUANTITY_BREAKS,
            icon: ProductIcon,
          },
          {
            id: 211,
            title: "Display settings",
            type: FEATURE_TYPE_QUANTITY_BREAKS_CUSTOMIZATION,
            icon: SettingsIcon,
          },
        ]
      },
      {
        title: "Social proof",
        children: [
          {
            id: 11,
            title: "Trust Badges on Product page",
            type: FEATURE_TYPE_TRUST_BADGES,
            icon: RewardIcon,
          },
          {
            id: 12,
            title: "Payment Badges on Product page",
            type: FEATURE_TYPE_PAYMENT_BADGES,
            icon: PaymentIcon,
          },
          {
            id: 13,
            title: "Trust Badges on Cart",
            type: FEATURE_TYPE_TRUST_BADGES_ON_CART,
            icon: RewardIcon,
          },
          {
            id: 14,
            title: "Payment Badges on Cart",
            type: FEATURE_TYPE_PAYMENT_BADGES_ON_CART,
            icon: PaymentIcon,
          },
          // {
          //   id: 15,
          //   title: "Sales Pop Up",
          //   type: FEATURE_TYPE_SALES_POPUP,
          //   icon: CartSaleIcon,
          // },
          {
            id: 16,
            title: "Social Media Buttons",
            type: FEATURE_TYPE_SOCIAL_MEDIA_BUTTONS,
            icon: ButtonPressIcon,
          },
        ],
      },
      {
        title: "Conversion",
        children: [
          {
            id: 21,
            title: "Countdown Timer Bar on Product page",
            type: FEATURE_TYPE_COUNTDOWN_TIMER_BAR,
            icon: ProductReturnIcon,
          },
          {
            id: 22,
            title: "Countdown Timer Bar on Cart",
            type: FEATURE_TYPE_COUNTDOWN_TIMER_BAR_ON_CART,
            icon: ClockIcon,
          },
          {
            id: 23,
            title: "Stock Countdown on Product page",
            type: FEATURE_TYPE_STOCK_COUNTDOWN,
            icon: DatabaseIcon,
          },
          // {
          //   id: 24,
          //   title: "Free Shipping Bar",
          //   type: FEATURE_TYPE_FREE_SHIPPING_BAR,
          //   icon: DeliveryIcon,
          // },
        ]
      },
    ];
  }, [])

  const [activeMenu, setActiveMenu] = useState(FEATURE_TYPE_PRODUCT_BUNDLES);

  const onActiveMenu = useCallback(async (type: string) => {
    await shopify.saveBar?.leaveConfirmation?.();
    setActiveMenu(type)
  }, []);

  return (
    <Container size="xl">
      <Page 
        fullWidth 
        title="Features"
        subtitle="Seamlessly integrating powerful tools for both store design customization and effective marketing strategies, empowering merchants to enhance their store's aesthetics and drive conversions effortlessly"
      >
        <StyledTabs>
          <StyledMenu>
            {tabs.map((item, index) => (
              <div key={index}>
                <StyledMenuTitle>{item.title}</StyledMenuTitle>
                {item.children.map((item) => (
                  <StyledMenuItem key={item.type}>
                    <StyledTabItem
                      active={activeMenu == item.type}
                      onClick={() => onActiveMenu(item.type)}
                    >
                      <Icon source={item.icon}></Icon>
                      <Tooltip hoverDelay={300} content={item.title}>
                        <Text as="span" variant="bodyMd" truncate>{item.title}</Text>
                      </Tooltip>
                    </StyledTabItem>
                  </StyledMenuItem>
                ))}
              </div>
            ))}
          </StyledMenu>
          <StyledTabContainer>
            <StyledTabContent>
              { activeMenu == FEATURE_TYPE_PRODUCT_BUNDLES ? (
                <ProductBundles 
                  pageType={PAGE_TYPE_PRODUCT} 
                  onRedirect={({type = ""}) => {
                    if(type == "customization"){
                      onActiveMenu(FEATURE_TYPE_PRODUCT_BUNDLES_CUSTOMIZATION)
                    }
                  }}
                />
              ) : null }
              { activeMenu == FEATURE_TYPE_PRODUCT_BUNDLES_ON_CART ? (
                <ProductBundleForm 
                  pageType={PAGE_TYPE_CART}
                  formId=""
                  onAction={({ type = ""} ) => {
                    if(type == "customization"){
                      onActiveMenu(FEATURE_TYPE_PRODUCT_BUNDLES_CUSTOMIZATION)
                    }else if(type == "list"){
                      onActiveMenu(FEATURE_TYPE_PRODUCT_BUNDLES)
                    }
                  }}  
                />
              ) : null }
              { activeMenu == FEATURE_TYPE_PRODUCT_BUNDLES_CUSTOMIZATION ? (
                <ProductBundleCustomization />
              ) : null }

              { activeMenu == FEATURE_TYPE_QUANTITY_BREAKS ? (
                <VolumeDiscounts
                  onRedirect={({type = ""}) => {
                    if(type == "customization"){
                      onActiveMenu(FEATURE_TYPE_QUANTITY_BREAKS_CUSTOMIZATION)
                    }
                  }}
                />
              ) : null }
              { activeMenu == FEATURE_TYPE_QUANTITY_BREAKS_CUSTOMIZATION ? (
                <VolumeDiscountCustomization />
              ) : null }
              
              { activeMenu == FEATURE_TYPE_TRUST_BADGES ? (
                <FormTrustBadges />
              ) : null }
              { activeMenu == FEATURE_TYPE_PAYMENT_BADGES ? (
                <FormPaymentBadges />
              ) : null }
              { activeMenu == FEATURE_TYPE_TRUST_BADGES_ON_CART ? (
                <FormTrustBadgesOnCart />
              ) : null }
              { activeMenu == FEATURE_TYPE_PAYMENT_BADGES_ON_CART ? (
                <FormPaymentBadgesOnCart />
              ) : null }
              { activeMenu == FEATURE_TYPE_SALES_POPUP ? (
                <FormSalesPopup />
              ) : null }
              { activeMenu == FEATURE_TYPE_SOCIAL_MEDIA_BUTTONS ? (
                <FormSocialMediaButtons />
              ) : null }
              { activeMenu == FEATURE_TYPE_COUNTDOWN_TIMER_BAR ? (
                <FormCountdownTimerBar />
              ) : null }
              { activeMenu == FEATURE_TYPE_COUNTDOWN_TIMER_BAR_ON_CART ? (
                <FormCountdownTimerBarOnCart />
              ) : null }
              { activeMenu == FEATURE_TYPE_STOCK_COUNTDOWN ? (
                <FormStockCountdown />
              ) : null }
            </StyledTabContent>
          </StyledTabContainer>
        </StyledTabs>
      </Page>
    </Container>
  );
};

const StyledTabs = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  height: 100%;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-basis: 250px;
  min-width: 250px;
  padding: 20px 12px;
  border-radius: 12px;
  background: var(--p-color-bg-surface);
  box-shadow:
    1px 0px 0px 0px rgba(0, 0, 0, 0.13) inset,
    -1px 0px 0px 0px rgba(0, 0, 0, 0.13) inset,
    0px -1px 0px 0px rgba(0, 0, 0, 0.17) inset,
    0px 1px 0px 0px rgba(204, 204, 204, 0.5) inset;
  @media (max-width: 992px) {
    flex-basis: unset;
    width: 100%;
  }
`;

const StyledMenuTitle = styled.h4`
  color: var(--p-color-text-secondary, #616161);
  font-size: 12px;
  font-style: normal;
  font-weight: 650;
  line-height: 16px;
  margin-bottom: 12px;
`;

const StyledMenuItem = styled.div`
  /* gap: 8px; */
  display: flex;
  flex-direction: column;
  @media (max-width: 992px) {
    align-items: flex-start;
  }
`;

const StyledTabItem = styled.div<any>`
  padding: 6px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 8px;
  border-radius: 4px;
  transition: background-color .2s linear;
  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .Polaris-Icon {
    margin: unset;
    min-width: 20px;
  }
  &:hover{
    background-color: #f1f1f1;
  }
  ${props => props.active ? `
    background-color: #f1f1f1;
  ` : ""}
`;

const StyledTabContainer = styled.div`
  flex-grow: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (max-width: 992px) {
    width: 100%;
  }
`;

const StyledTabContent = styled.div`
  width: 100%;
`;


export default FeaturesPage;
