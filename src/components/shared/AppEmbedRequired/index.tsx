import {
  Card,
  Button,
  InlineStack,
  Box,
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
import { DEEP_LINK_APP_EMBED } from "@/constants/deep-link"
import logoImage from "~/images/logo-circle.png"

type Props = {
  loading?: boolean;
  onVerify: () => void;
};

const AppEmbedRequired = ({
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
            <Text as="h3" variant="headingSm">App embed is required</Text>
            <Text as="p" variant="bodyMd" tone="subdued">Please follow the steps below to activate this feature</Text>
          </BlockStack>
          <StyledSteps>
            <StyledStep>
              <Badge tone="info">1</Badge>
              <Text variant="bodyMd" as="p">
              Go to {" "}
                <Link
                  onClick={() =>
                    openUrl(
                      `${DEEP_LINK_APP_EMBED}`
                    )
                  }
                  removeUnderline
                >
                  App embed
                </Link>
              {` `} in your Theme Editor
              </Text>
            </StyledStep>
            <StyledStep>
              <Badge tone="info">2</Badge>
             
            </StyledStep>
            <StyledStep>
              <Badge tone="info">3</Badge>
              <Text variant="bodyMd" as="p">
                Click <strong>Save</strong> at top right corner
              </Text>
            </StyledStep>
            <StyledStep>
              <Badge tone="info">4</Badge>
              <Text variant="bodyMd" as="p">
                Click below button to verify your settings
              </Text>
            </StyledStep>
          </StyledSteps>
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

export default AppEmbedRequired;
