import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import {
  Page,
  Card,
  Text,
  InlineGrid,
  Icon,
  Button,
  Box,
  InlineStack,
  BlockStack,
} from "@shopify/polaris";
import {
  ArrowRightIcon,
  ProductIcon,
  CartIcon,
  PackageIcon,
} from "@shopify/polaris-icons";
import { StyledContainer, StyledItem, StyledClose } from "./styled-components";
import _routes from "@/constants/routes";
import { openChat } from "@/utils/chat";
import { useAuthContext } from "@/features/auth/contexts";
import { STORAGE_CLOSE_CARD_ONBOARDING_DASHBOARD } from "@/constants/storage";
import { getLocalStorage, setLocalStorage } from "@/utils/storage";
import { SHOPIFY_THEME_APP_EXTENSION_ID } from "@/config/env";

const listFeature = [
  {
    id: "1",
    title: "Product Bundles on Product page",
    icon: ProductIcon,
    description:
      "Drive sales by offering discounted bundles directly on the Product page, encouraging customers to add more",
    route: `${_routes.BUNDLE_PRODUCT_PAGE}`,
    action: "Create bundle now",
    isNext: false,
    disabled: false,
  },
  {
    id: "2",
    title: "Product Bundles on Cart page",
    icon: CartIcon,
    description:
      "Increase AOV by showcasing bundle offers in the cart, prompting customers to add additional items before checkout",
    route: `${_routes.BUNDLE_LIST_CART_PAGE}`,
    action: "Add bundle offer",
    isNext: false,
    disabled: false,
  },
  {
    id: "3",
    title: "Volume Discounts",
    icon: PackageIcon,
    description:
      "Incentivize bulk buying with tiered discounts, giving customers more value as they purchase higher quantities",
    route: `${_routes.VOLUME_DISCOUNTS}`,
    action: "Set up now",
    disabled: false,
    isNext: false,
    // onAction: () => openChat()
  },
];

export default function Feature({}) {
  const router = useRouter();
  const [{ store }]: any = useAuthContext();

  const [active, setActive]: any = useState(0);
  const [closeOBD, setCloseOBD]: any = useState(false);

  const onclose = useCallback(() => {
    setLocalStorage(
      `${STORAGE_CLOSE_CARD_ONBOARDING_DASHBOARD}`,
      "ms",
      60 * 24 * 3
    );
    setCloseOBD(true);
  }, []);

  if (
    getLocalStorage(`${STORAGE_CLOSE_CARD_ONBOARDING_DASHBOARD}`) ||
    closeOBD
  ) {
    return null;
  }

  return (
    <StyledContainer>
      <Card>
        <Box paddingBlockEnd="400">
          <Text as="h3" variant="headingMd">
            Onboarding
          </Text>
          <Text as="p" variant="bodyMd" tone="subdued">
            Provide you fast access to apps common functionalities
          </Text>
        </Box>
        <InlineGrid columns={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }} gap="600">
          {listFeature.map((item, index) => (
            <StyledItem key={index} active={active == index + 1}>
              <Card padding="300">
                <BlockStack gap="400">
                  <BlockStack gap="200">
                    <InlineStack gap="100">
                      <span>
                        <Icon source={item.icon} />
                      </span>
                      <Text variant="headingMd" as="h2">
                        {item.title}
                      </Text>
                    </InlineStack>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      {item.description}
                    </Text>
                  </BlockStack>
                  <div>
                    <Button
                      onClick={() => {
                        router.push(item.route);
                      }}
                      textAlign="left"
                      external
                      disabled={item.disabled}
                      icon={item.isNext ? ArrowRightIcon : undefined}
                    >
                      {item.action}
                    </Button>
                  </div>
                </BlockStack>
              </Card>
            </StyledItem>
          ))}
        </InlineGrid>
      </Card>
      {/* <StyledClose onClick={() => onclose()}>
        <Icon source={CancelMajor}></Icon>
      </StyledClose> */}
    </StyledContainer>
  );
}
