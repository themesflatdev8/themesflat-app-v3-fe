import {
  Card,
  Button,
  InlineStack,
  Box,
  Banner,
  Text,
  Badge,
  Link,
  BlockStack,
} from "@shopify/polaris";
import {
  StyledContainer,
  StyledContent,
  StyledSteps,
  StyledStep,
} from "./styled-components";
import { useCallback } from "react";
import { Image } from "@/components/core"
import { DEEP_LINK_APP_BLOCK_PRODUCT_PAGE } from "@/constants/deep-link"
import logoImage from "~/images/logo-circle.png"

type Props = {
  loading?: boolean;
  onVerify: () => void;
};

const AppBlockRequired = ({
  loading = false,
  onVerify,
}: Props) => {
  
  const openUrl = useCallback((path: string) => {
    window.open(`shopify://admin${path}`, "_blank");
  }, []);

  return (
    <StyledContainer>
      <Card padding="500">
        <StyledContent>
          <BlockStack gap="100" inlineAlign="center">
            <Image
              root={true}
              alt=""
              src={logoImage.src}
              width="40"
              height="40"
            />
            <Text as="h3" variant="headingSm">App block is required</Text>
            <Text as="p" variant="bodyMd" tone="subdued">Please follow the steps below to activate this feature</Text>
          </BlockStack>
          <StyledSteps>
            <StyledStep>
              <Badge tone="info">1</Badge>
              <Text variant="bodyMd" as="p">
              Go to your Product template page via the{" "}
                <Link
                  onClick={() =>
                    openUrl(
                      `${DEEP_LINK_APP_BLOCK_PRODUCT_PAGE}`
                    )
                  }
                  removeUnderline
                >
                  Themes Editor
                </Link>
              </Text>
            </StyledStep>
            <StyledStep>
              <Badge tone="info">2</Badge>
              <Text variant="bodyMd" as="p">
                Click <strong>Add block</strong> in desired supported section (e.g. Product information)
              </Text>
            </StyledStep>
            <StyledStep>
              <Badge tone="info">3</Badge>
              <Text variant="bodyMd" as="p">
                Find and select the block labeled <strong>“M-Sell widgets”</strong>
              </Text>
            </StyledStep>
            <StyledStep>
              <Badge tone="info">4</Badge>
              <Text variant="bodyMd" as="p">
                Drag-and-drop M-Sell widget block to your preferred position
              </Text>
            </StyledStep>
            <StyledStep>
              <Badge tone="info">5</Badge>
              <Text variant="bodyMd" as="p">
                Click <strong>Save</strong> at the top right of the screen to apply the changes
              </Text>
            </StyledStep>
            <StyledStep>
              <Badge tone="info">6</Badge>
              <Text variant="bodyMd" as="p">
                Revisit your Product page to ensure the M-Sell widget displays correctly
              </Text>
            </StyledStep>
          </StyledSteps>
          <Box paddingBlockStart="500">
            <Banner tone="info">
              <Text as="p" variant="bodyMd" tone="base">
                Note: If you are using more than one product template, ensure that you add the widget to the template assigned to the product you want to display. Otherwise, the widget wont be visible.
              </Text>
            </Banner>
          </Box>
          <Box paddingBlockStart="500">
            <InlineStack align="center">
              <Button
                variant="primary"
                loading={loading}
                onClick={() => onVerify()}
              >
                Verify now
              </Button>
            </InlineStack>
          </Box>
        </StyledContent>
      </Card>
    </StyledContainer>
  );
};

export default AppBlockRequired;
