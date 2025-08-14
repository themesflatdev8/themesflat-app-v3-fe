import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "@/features/auth/contexts";
import {
  Text,
  Box,
  Banner,
  Button,
  Link,
  InlineStack,
  InlineError,
  Tooltip,
  Icon,
  BlockStack,
  Card,
  Badge,
} from "@shopify/polaris";
import { InfoIcon, AlertCircleIcon } from "@shopify/polaris-icons";
import {
  StyledContainer,
  StyledType,
  StyledBanner,
  StyledModalView,
} from "./styled-components";
import { Controller } from "react-hook-form";
import { Loading, Switch, Modal, Image } from "@/components/core";
import Analyze from "@/components/shared/Analyze";
import { SHOPIFY_THEME_APP_EXTENSION_ID } from "@/config/env";
import _routes from "@/constants/routes";
import Icon1 from "@/features/bundle-customization/assets/icon-1.svg";
import { useCommonContext } from "@/contexts/common";
import {
  PAGE_TYPE_PRODUCT,
  PAGE_TYPE_CART,
  PAGE_TYPE_SEARCH,
} from "@/features/product-bundles/constants";
import guideAppBlockImage from "~/images/guide-app-block.png";

type Props = {
  control: any;
  watch: any;
  setValue: any;
  errors?: any;
  errorsServer?: any;
  isEnableAppBlock: boolean;
  isLoadingVerifyAppBlock: boolean;
  verifyAppBlock: Function;
  isEnableAppEmbed: boolean;
  isLoadingVerifyAppEmbed: boolean;
  verifyAppEmbed: Function;
  isErrorVerifyAppBlock: boolean;
  isErrorVerifyAppEmbed: boolean;
  totalBundlePublish: any;
  hasAppEmbed: boolean;
  hasAppBlock: boolean;
  pageType: string;
};

const General = ({
  control,
  watch,
  setValue,
  errors,
  errorsServer,
  isEnableAppEmbed,
  verifyAppEmbed,
  isLoadingVerifyAppEmbed,
  isEnableAppBlock,
  verifyAppBlock,
  isLoadingVerifyAppBlock,
  isErrorVerifyAppBlock,
  isErrorVerifyAppEmbed,
  totalBundlePublish,
  hasAppEmbed,
  hasAppBlock,
  pageType,
}: Props) => {
  const router = useRouter();

  const [{ store }]: any = useAuthContext();
  let [{ loyalty }]: any = useCommonContext();

  const isLoyalty = useMemo(() => {
    if (!loyalty) return false;
    if (loyalty.isComplete) return true;
    return false;
  }, [loyalty]);

  const [isClickedAppBlockProduct, setIsClickedAppBlockProduct] =
    useState(false);
  const [isClickedAppEmbedProduct, setIsClickedAppEmbedProduct] =
    useState(false);
  const [modalView, setModalView] = useState({ open: false });

  const getNameByPageType = useMemo(() => {
    if ([PAGE_TYPE_CART].includes(pageType)) {
      return "Cart";
    }
    if ([PAGE_TYPE_SEARCH].includes(pageType)) {
      return "Search";
    }
    return "Product";
  }, [pageType]);

  const getTemplateByPageType = useMemo(() => {
    if ([PAGE_TYPE_CART].includes(pageType)) {
      return "cart";
    }
    return "product";
  }, [pageType]);

  const openUrl = useCallback((path: string) => {
    window.open(`shopify://admin${path}`, "_blank");
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
        {(hasAppBlock &&
          typeof isEnableAppBlock != "undefined" &&
          !isEnableAppBlock) ||
        (hasAppEmbed &&
          typeof isEnableAppEmbed != "undefined" &&
          !isEnableAppEmbed) ? (
          <Card>
            <Box paddingBlockEnd="200">
              <BlockStack gap="100">
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Require enable app
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  Enable app block/app embed to show on store front
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
                  {!isEnableAppBlock ? (
                    <InlineStack gap="200" blockAlign="center">
                      <Badge tone="attention">Not activated</Badge>
                      <Button
                        size="slim"
                        loading={
                          isLoadingVerifyAppBlock && isClickedAppBlockProduct
                        }
                        onClick={() => {
                          setIsClickedAppBlockProduct(true);
                          verifyAppBlock();
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
              <Card>
                <InlineStack
                  align="space-between"
                  gap="200"
                  blockAlign="center"
                >
                  <Text as="span" variant="bodyMd" fontWeight="semibold">
                    Cart page/drawer
                  </Text>
                  {!isEnableAppEmbed ? (
                    <InlineStack gap="200" blockAlign="center">
                      <Badge tone="attention">Not activated</Badge>
                      <Button
                        size="slim"
                        loading={
                          isLoadingVerifyAppEmbed && isClickedAppEmbedProduct
                        }
                        onClick={() => {
                          setIsClickedAppEmbedProduct(true);
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
        <Card>
          <Box paddingBlockEnd="200">
            <InlineStack gap="100" wrap={false} align="space-between">
              <Text as="span" variant="bodyMd" fontWeight="semibold">
                Guide enable app block
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
                        `/themes/current/editor?template=${getTemplateByPageType}&addAppBlockId=${SHOPIFY_THEME_APP_EXTENSION_ID}/bundle&target=mainSection`
                      )
                    }
                  >
                    Product page
                  </Button>{" "}
                  on Themes Editor
                </Text>
                <Text as="p" variant="bodyMd">
                  2. Click add block section of your theme settings and select{" "}
                  <strong>M-Sell Bundles</strong>
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
