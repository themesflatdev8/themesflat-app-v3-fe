import { useState, useCallback, useMemo } from "react";
import {
  Text,
  InlineGrid,
  Card,
  Button,
  Badge,
  Link,
  Box,
  InlineStack,
  InlineError,
  Tooltip,
  Icon,
  BlockStack,
} from "@shopify/polaris";
import { InfoIcon, AppsFilledIcon } from "@shopify/polaris-icons";
import { StyledContainer, StyledModalView } from "./styled-components";
import { Controller } from "react-hook-form";
import { Loading, Switch, Modal, Image } from "@/components/core";
import GuideAddAppEmbed from "@/components/shared/GuideAddAppEmbed";
import { SHOPIFY_THEME_APP_EXTENSION_ID } from "@/config/env";
import _routes from "@/constants/routes";
import guideAppBlockImage from "~/images/guide-app-block.png";

type Props = {
  control: any;
  watch: any;
  setValue: any;
  errors?: any;
  errorsServer?: any;
  isEnableAppEmbed: any;
  verifyAppEmbed: Function;
  isErrorVerifyAppEmbed: boolean;
  isLoadingVerifyAppEmbed: boolean;
};

const General = ({
  control,
  isEnableAppEmbed,
  verifyAppEmbed,
  isLoadingVerifyAppEmbed,
  isErrorVerifyAppEmbed,
}: Props) => {
  const [openGuideAppEmbed, setOpenGuideAppEmbed] = useState(false);
  const [isClickedAppEmbed, setIsClickedAppEmbed] = useState(false);
  const [modalView, setModalView] = useState({ open: false });

  const openUrl = useCallback((path: string) => {
    window.open(`shopify://admin${path}`, "_blank");
  }, []);

  const getTemplateByPageType = useMemo(() => {
    return "product";
  }, []);

  return (
    <StyledContainer>
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="200">
            <Controller
              name="visibility"
              control={control}
              render={({ field: { onChange, value } }) => (
                <InlineStack
                  gap="200"
                  align="space-between"
                  blockAlign="center"
                >
                  <Text variant="bodyMd" as="p" fontWeight="semibold">
                    Visibility
                  </Text>
                  <Switch
                    checked={value}
                    onChange={() => onChange(!value)}
                  ></Switch>
                </InlineStack>
              )}
            />
          </BlockStack>
        </Card>
        {typeof isEnableAppEmbed != "undefined" && !isEnableAppEmbed ? (
          <Card>
            <Box paddingBlockEnd="200">
              <BlockStack gap="100">
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Require enable app
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  Enable app embed to show on store front
                </Text>
              </BlockStack>
            </Box>
            <BlockStack gap="300">
              <Card>
                <InlineStack
                  align="space-between"
                  gap="200"
                  blockAlign="center"
                >
                  <Text as="span" variant="bodyMd" fontWeight="semibold">
                    Product page
                  </Text>
                  {!isEnableAppEmbed ? (
                    <InlineStack gap="200">
                      <Badge tone="attention">Not activated</Badge>
                      <Button
                        size="slim"
                        loading={isLoadingVerifyAppEmbed && isClickedAppEmbed}
                        onClick={() => {
                          setIsClickedAppEmbed(true);
                          verifyAppEmbed();
                        }}
                      >
                        Verify
                      </Button>
                    </InlineStack>
                  ) : (
                    <Badge tone="success">Activated</Badge>
                  )}
                </InlineStack>
              </Card>
            </BlockStack>
          </Card>
        ) : null}
        <Card>
          <Box paddingBlockEnd="200">
            <InlineStack gap="100" wrap={false} align="space-between">
              <Text as="span" variant="bodyMd" fontWeight="semibold">
                Guide enable app embed
              </Text>
              <Button
                variant="plain"
                onClick={() =>
                  setModalView((prev) => ({ ...prev, open: true }))
                }
              >
                View demo
              </Button>
            </InlineStack>
          </Box>
          <BlockStack gap="300">
            <Card>
              <BlockStack gap="200">
                <Text as="p" variant="bodyMd">
                  1. Go to{" "}
                  <Button
                    variant="plain"
                    onClick={() =>
                      openUrl(
                        `/themes/current/editor?context=apps&activateAppId=${SHOPIFY_THEME_APP_EXTENSION_ID}/app-embed`
                      )
                    }
                  >
                    App embeds
                  </Button>{" "}
                  section of your theme settings
                </Text>
                <Text as="p" variant="bodyMd">
                  2. Enable the <strong>M-Sell</strong> app embed
                </Text>
                <Text as="p" variant="bodyMd">
                  3. <strong>Save</strong> your changes
                </Text>
              </BlockStack>
            </Card>
          </BlockStack>
        </Card>
      </BlockStack>

      <Modal
        open={modalView.open}
        width="900px"
        onClose={() => setModalView((prev) => ({ ...prev, open: false }))}
        primaryAction={{
          content: "Got it!",
          onAction: () => {
            setModalView((prev) => ({ ...prev, open: false }));
          },
        }}
      >
        <StyledModalView>
          <Image alt="" root={true} src={guideAppBlockImage.src} fill />
        </StyledModalView>
      </Modal>
    </StyledContainer>
  );
};
export default General;
