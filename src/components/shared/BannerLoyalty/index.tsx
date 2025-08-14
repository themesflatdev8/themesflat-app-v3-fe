import React, { useCallback } from "react";
import { useRouter } from "next/router";
import _routes from "@/constants/routes";
import { ButtonGroup, CalloutCard, Text, Button } from "@shopify/polaris";
import { StyledBanner } from "./styled-components";
import { useAuthContext } from "@/features/auth/contexts";
import bannerImage from "@/assets/images/banner-loyalty.png";

type Props = {
  onClose: Function;
};

const BannerLoyalty = ({ onClose }: Props) => {
  const router = useRouter();

  const [{ store }]: any = useAuthContext();

  const openUrl = useCallback((url: string) => {
    window.open(url, "_blank");
  }, []);

  return (
    <StyledBanner>
      <CalloutCard
        title="Join our Loyalty Program to gain exclusive access to M-Sell AI, propel business to new heights"
        illustration={bannerImage.src}
        primaryAction={{
          content: "Join now",
          onAction: () => router.push(_routes.LOYALTY),
        }}
        onDismiss={() => onClose()}
      >
        <Text as="p" variant="bodyMd">
          {`M-Sell AI, a cutting-edge AI recommendation engine that continuously learns from millions of products and orders worldwide, leverages your store's historical and real-time data to generate tailored product recommendations, meticulously crafted to maximize conversion rates.`}
        </Text>
        <ButtonGroup>
          <Button
            variant="primary"
            onClick={() => {
              router.push(_routes.LOYALTY);
            }}
          >
            Join now
          </Button>
        </ButtonGroup>
      </CalloutCard>
    </StyledBanner>
  );
};

export default BannerLoyalty;
