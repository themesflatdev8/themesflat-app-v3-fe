import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "@/features/auth/contexts";
import {
  Text,
  Box,
  Button,
  InlineStack,
  BlockStack,
  Card,
  Badge,
  InlineError,
  Link,
} from "@shopify/polaris";
import GuideAddAppBlock from "@/components/shared/GuideAddAppBlock";
import GuideAddAppEmbed from "@/components/shared/GuideAddAppEmbed";
import {
  StyledContainer,
} from "./styled-components";
import { Controller } from "react-hook-form";
import { Switch } from "@/components/core";
import _routes from "@/constants/routes";
import { useCommonContext } from "@/contexts/common";

type Props = {
  control: any;
  isEnableAppBlock: boolean;
  isLoadingVerifyAppBlock: boolean;
  verifyAppBlock: Function;
  isEnableAppEmbed: boolean;
  isLoadingVerifyAppEmbed: boolean;
  verifyAppEmbed: Function;
  hasAppEmbed: boolean;
  hasAppBlock: boolean;
  isErrorVerifyAppBlock: boolean;
  isErrorVerifyAppEmbed: boolean;
};

const General = ({
  control,
  isEnableAppEmbed,
  verifyAppEmbed,
  isLoadingVerifyAppEmbed,
  isEnableAppBlock,
  verifyAppBlock,
  isLoadingVerifyAppBlock,
  hasAppEmbed,
  hasAppBlock,
  isErrorVerifyAppBlock,
  isErrorVerifyAppEmbed,
}: Props) => {
  const router = useRouter();

  const [{ store }]: any = useAuthContext();
  let [{ loyalty }]: any = useCommonContext();

  const [openGuideAppBlock, setOpenGuideAppBlock] = useState(false);
  const [openGuideAppEmbed, setOpenGuideAppEmbed] = useState(false);
  const [isClickedAppBlockProduct, setIsClickedAppBlockProduct] =
    useState(false);
  const [isClickedAppEmbedProduct, setIsClickedAppEmbedProduct] =
    useState(false);

  return (
    <StyledContainer>
      <BlockStack gap="300">
        <Card>
          <Controller
            name="visibility"
            control={control}
            render={({ field: { onChange, value } }) => (
              <InlineStack
                gap="400"
                align="space-between"
                blockAlign="start"
                wrap={false}
              >
                <BlockStack gap="100">
                  <Text as="h3" variant="headingMd">Trust Badges on Product page</Text>
                  <Text as="p" variant="bodyMd" tone="subdued">Enhance customers' confidence, help alleviate any concerns they may have about making a purchase</Text>
                </BlockStack>
                <Switch
                  checked={value}
                  onChange={() => onChange(!value)}
                ></Switch>
              </InlineStack>
            )}
          />
        </Card>
        {(hasAppBlock &&
          typeof isEnableAppBlock != "undefined" &&
          !isEnableAppBlock) ? (
          <Card>
            <Box paddingBlockEnd="200">
              <BlockStack gap="050">
                <Text as="h3" variant="headingMd">
                  Require enable app
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  Enable app block to show on store front
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
                  <Button
                    onClick={() => {
                      setOpenGuideAppBlock(true);
                    }}
                  >
                    Add widget
                  </Button>
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
                        variant="plain"
                      >
                        Verify now
                      </Button>
                    </InlineStack>
                  ) : (
                    <Badge tone="success">Activated</Badge>
                  )}
                </InlineStack>
                {isErrorVerifyAppEmbed && isClickedAppEmbedProduct && (
                  <div>
                    <InlineError
                      fieldID="customize-app-embed"
                      message={`Verify failed, please try again`}
                    ></InlineError>
                  </div>
                )}
              </Card>
            </BlockStack>
          </Card>
        ) : null}
        {(hasAppEmbed &&
          typeof isEnableAppEmbed != "undefined" &&
          !isEnableAppEmbed) ? (
          <Card>
            <Box paddingBlockEnd="200">
              <BlockStack gap="100">
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Require enable app
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  Enable app app embed to show on store front
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
                  <Button
                    onClick={() => {
                      setOpenGuideAppEmbed(true);
                    }}
                  >
                    Add widget
                  </Button>
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
                        variant="plain"
                      >
                        Verify now
                      </Button>
                    </InlineStack>
                  ) : (
                    <Badge tone="success">Activated</Badge>
                  )}
                  {isErrorVerifyAppBlock && isClickedAppBlockProduct && (
                    <div>
                      <InlineError
                        fieldID="customize-app-block"
                        message={`Verify failed, please try again`}
                      ></InlineError>
                    </div>
                  )}
                </InlineStack>
              </Card>
            </BlockStack>
          </Card>
        ) : null}
      </BlockStack>

      <GuideAddAppBlock
        open={openGuideAppBlock}
        onClose={() => setOpenGuideAppBlock(false)}
      ></GuideAddAppBlock>

      <GuideAddAppEmbed
        open={openGuideAppEmbed}
        onClose={() => setOpenGuideAppEmbed(false)}
      ></GuideAddAppEmbed>

    </StyledContainer>
  );
};
export default General;
