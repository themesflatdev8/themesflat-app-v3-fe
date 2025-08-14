import type { NextPage } from "next";
import { useCallback } from "react";
import { Page, Text, Link } from "@shopify/polaris";
import Plan from "@/features/charge/components/Plan";
import { StyledContainer } from "@/features/charge/styled-components/choose-plan";
import { CHOOSE_PLAN } from "@/features/charge/constants";

type Props = {};

const PricingPage: NextPage = ({}: Props) => {
  const openUrl = useCallback((url: string) => {
    window.open(url, "_blank");
  }, []);

  return (
    <StyledContainer>
      <Page title="Choose plan" compactTitle>
        <div style={{ flex: "1", marginBottom: "20px" }}>
          <Text as="p" variant="bodyMd" tone="subdued">
            Try app free for 7 days, full refund the first billing if unhappy{" "}
            {` `}
            <Link
              removeUnderline
              onClick={() =>
                openUrl(
                  "https://msell.freshdesk.com/support/solutions/articles/150000095918-30-day-money-back-guarantee-policy"
                )
              }
            >
              Learn more
            </Link>
          </Text>
        </div>
        <Plan page={CHOOSE_PLAN}></Plan>
      </Page>
    </StyledContainer>
  );
};

export default PricingPage;
