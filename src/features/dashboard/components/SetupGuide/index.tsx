import { useState, useCallback, useMemo, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Card,
  Box,
  Button,
  Text,
  Collapsible,
  BlockStack,
  Icon,
  InlineStack,
  Divider,
  ButtonGroup,
  Toast,
  Tooltip,
  Badge,
  Banner,
  Link,
} from "@shopify/polaris";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from "@shopify/polaris-icons";
import { Image } from "@/components/core";
import {
  StyledContainer,
  StyledCard,
  StyledGuideIcon,
  StyledBadge,
  StyledGuideCollapse,
} from "./styled-components";
import CircleCheckIcon from "@/features/dashboard/assets/circle-check.svg";
import CircleCheckedIcon from "@/features/dashboard/assets/circle-checked.svg";
import { useAuthContext } from "@/features/auth/contexts";
import api from "@/features/quick-setup/api";
import verifyAppApi from "@/api/verify-app";
import apiBundle from "@/features/product-bundles/api";
import { _queryKey } from "@/constants/react-query";
import { _typeReducer } from "@/features/auth/constants";
import { SHOPIFY_THEME_APP_EXTENSION_ID } from "@/config/env";

export default function SetupGuide({}) {
  const [{ store }, dispatch]: any = useAuthContext();

  const [active, setActive] = useState(0);
  const [isFirstLoadAppEmbed, setIsFirstLoadAppEmbed] = useState(false);
  const [isErrorAppEmbed, setIsErrorAppEmbed] = useState(false);

  const [open, setOpen] = useState(true);
  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  const [toast, setToast] = useState({
    active: false,
    content: "",
    error: false,
  });
  const toggleActiveToast = useCallback(
    () => setToast((prev: any) => ({ ...prev, active: !prev.active })),
    []
  );
  const toastMarkup = toast.active ? (
    <Toast
      content={toast.content}
      error={toast.error}
      onDismiss={toggleActiveToast}
    />
  ) : null;

  const setupGuide = useMemo(() => {
    let obj = {
      stepEnable: false,
      stepCreateBundle: false,
      stepPreview: false,
    };
    if (!store || !store.setup_guide?.setupGuide) {
      return obj;
    }
    return { ...obj, ...store.setup_guide.setupGuide };
  }, [store]);

  const progressBar = useMemo(() => {
    let count = 0;
    if (setupGuide?.stepEnable) {
      count++;
    }
    if (setupGuide?.stepCreateBundle) {
      count++;
    }
    if (setupGuide?.stepPreview) {
      count++;
    }
    return count;
  }, [setupGuide]);

  let { refetch: refetchVerifyAppEmbed, isFetching: isLoadingVerifyAppEmbed } =
    useQuery(
      [_queryKey.verifyAppEmbed],
      async () => {
        let res = await verifyAppApi.verifyAppEmbed();
        let { status = false, verify = false } = res;
        if (verify) {
          setIsErrorAppEmbed(false);
          handleComplete("enable");
        } else {
          if(isFirstLoadAppEmbed){
            setIsErrorAppEmbed(true);
          }
        }
        setIsFirstLoadAppEmbed(true);
        return verify;
      },
      {
        enabled: !setupGuide ? false : setupGuide?.stepEnable ? false : true,
      }
    );

  useQuery(
    [_queryKey.getProductBundlingList, { type: "guide-setup" }],
    async () => {
      let params = {
        pageType: "product",
      };
      let res = await apiBundle.getList(params);
      let { status = false, data = {} } = res;
      if (data && data.data && data.data.length > 0) {
        handleComplete("create");
      }
      if (status) {
        return data;
      }
      return {
        data: [],
        last_page: 1,
      };
    },
    {
      staleTime: 0,
      cacheTime: 0,
      enabled: !setupGuide
        ? false
        : setupGuide?.stepCreateBundle
          ? false
          : true,
    }
  );

  const { mutate: mutationQuickSetup, isLoading: isLoadingQuickSetup } =
    useMutation(async (payload: any) => {
      let res = await api.setupGuide({ setup_guide: payload });
      let { status = false, data, message = "", errors = null } = res;
      return res;
    });

  const openUrl = useCallback((path: string) => {
    window.open(`shopify://admin${path}`, "_blank");
  }, []);

  const handleComplete = (step: string) => {
    let obj = store.setup_guide || {};
    if (!obj.setupGuide) {
      obj["setupGuide"] = {};
    }
    if (step == "enable") {
      obj.setupGuide["stepEnable"] = true;
      dispatch({
        type: _typeReducer.SET_STORE,
        payload: { ...store, setup_guide: obj },
      });
      if (!obj.setupGuide?.stepCreateBundle) {
        setActive(2);
      } else if (!obj.setupGuide?.stepPreview) {
        setActive(3);
      } else {
        setActive(2);
      }
    }
    if (step == "un-enable") {
      obj.setupGuide["stepEnable"] = false;
      dispatch({
        type: _typeReducer.SET_STORE,
        payload: { ...store, setup_guide: obj },
      });
    }
    if (step == "create") {
      obj.setupGuide["stepCreateBundle"] = true;
      dispatch({
        type: _typeReducer.SET_STORE,
        payload: { ...store, setup_guide: obj },
      });
      setActive(3);
    }
    if (step == "un-create") {
      obj.setupGuide["stepCreateBundle"] = false;
      dispatch({
        type: _typeReducer.SET_STORE,
        payload: { ...store, setup_guide: obj },
      });
    }
    if (step == "preview") {
      obj.setupGuide["stepPreview"] = true;
      dispatch({
        type: _typeReducer.SET_STORE,
        payload: { ...store, setup_guide: obj },
      });
    }
    if (step == "un-preview") {
      obj.setupGuide["stepPreview"] = false;
      dispatch({
        type: _typeReducer.SET_STORE,
        payload: { ...store, setup_guide: obj },
      });
    }
    mutationQuickSetup(obj);
  };

  useEffect(() => {
    if (setupGuide && active == 0) {
      if (!setupGuide?.stepEnable) {
        setActive(1);
      } else if (!setupGuide?.stepCreateBundle) {
        setActive(2);
      } else if (!setupGuide?.stepPreview) {
        setActive(3);
      }
    }
  }, [setupGuide, active]);

  return (
    <StyledContainer>
      <Card>
        <Box paddingBlockEnd="200">
          <InlineStack gap="400" wrap={false} align="space-between">
            <Text as="h3" variant="headingMd">
              Setup guide
            </Text>
            <StyledGuideCollapse className="setup-guide-close">
              <Button
                icon={open ? ChevronUpIcon : ChevronDownIcon}
                onClick={handleToggle}
                variant="tertiary"
              ></Button>
            </StyledGuideCollapse>
          </InlineStack>
        </Box>
        <Collapsible
          open={open}
          id="setup-guide-collapsible"
          transition={{ duration: "400ms", timingFunction: "ease-in-out" }}
          expandOnPrint
        >
          <Box paddingBlockEnd="200">
            <Text as="p" variant="bodyMd">
              Use this guide to quickly setup your offer
            </Text>
          </Box>
          <Box paddingBlockEnd="200">
            <InlineStack wrap={false} gap="400" blockAlign="center">
              {progressBar < 3 ? (
                <StyledBadge>{progressBar} / 3 completed</StyledBadge>
              ) : (
                <Badge icon={CheckIcon} size="large">
                  Done
                </Badge>
              )}
            </InlineStack>
          </Box>
          <Divider />

          <Box paddingBlock="300">
            <BlockStack gap="100">
              <StyledCard active={active == 1}>
                <BlockStack key={1} gap="200">
                  <InlineStack wrap={false} gap="300">
                    <Tooltip
                      content={
                        setupGuide?.stepEnable
                          ? "Mark as not done"
                          : "Mark as done"
                      }
                    >
                      <StyledGuideIcon
                        active={setupGuide?.stepEnable}
                        onClick={() => handleComplete("un-enable")}
                      >
                        <Icon
                          source={
                            setupGuide?.stepEnable
                              ? CircleCheckedIcon
                              : CircleCheckIcon
                          }
                        ></Icon>
                      </StyledGuideIcon>
                    </Tooltip>
                    <BlockStack gap="200">
                      <Button
                        onClick={() => setActive(1)}
                        ariaControls={`fqa-${1}`}
                        variant="monochromePlain"
                        textAlign="left"
                      >
                        Enable app
                      </Button>
                      <Collapsible
                        open={active == 1}
                        id={`fqa-${1}`}
                        transition={{
                          duration: "300ms",
                          timingFunction: "ease-in-out",
                        }}
                        expandOnPrint
                      >
                        <InlineStack>
                          <BlockStack gap="300">
                            <BlockStack gap="100">
                              <Text as="p" variant="bodyMd">
                                1. Go to <strong>App embeds</strong> section
                                of your theme settings
                              </Text>
                              <Text as="p" variant="bodyMd">
                                2. Enable the M-Sell Kit app embed
                              </Text>
                              <Text as="p" variant="bodyMd">
                                3. Save your changes
                              </Text>
                            </BlockStack>
                            <BlockStack>
                              { isErrorAppEmbed ? (
                                <Box paddingBlockEnd="300">
                                  <Banner tone="warning">
                                    {/* Error - Check settings again or <Link monochrome onClick={() => openChat()}>contact support</Link> for further assistance */}
                                    Error - Check settings again
                                  </Banner>
                                </Box>
                              ) : null }
                               <ButtonGroup>
                                <Button
                                  variant="primary"
                                  onClick={() =>
                                    openUrl(
                                      `/themes/current/editor?template=product&addAppBlockId=${SHOPIFY_THEME_APP_EXTENSION_ID}/bundle&target=mainSection`
                                    )
                                  }
                                >
                                  Enable app
                                </Button>
                                {!setupGuide?.stepEnable ? (
                                  <Button
                                    variant="plain"
                                    loading={isLoadingVerifyAppEmbed}
                                    onClick={() => refetchVerifyAppEmbed()}
                                  >
                                    Verify
                                  </Button>
                                ) : null}
                              </ButtonGroup>
                            </BlockStack>
                          </BlockStack>
                        </InlineStack>
                      </Collapsible>
                    </BlockStack>
                  </InlineStack>
                </BlockStack>
              </StyledCard>
              <StyledCard active={active == 2}>
                <BlockStack key={2} gap="200">
                  <InlineStack wrap={false} gap="300">
                    <Tooltip
                      content={
                        setupGuide?.stepEnable
                          ? "Mark as not done"
                          : "Mark as done"
                      }
                    >
                      <StyledGuideIcon
                        active={setupGuide?.stepCreateBundle}
                        onClick={() => handleComplete("create")}
                      >
                        <Icon
                          source={
                            setupGuide?.stepCreateBundle
                              ? CircleCheckedIcon
                              : CircleCheckIcon
                          }
                        ></Icon>
                      </StyledGuideIcon>
                    </Tooltip>
                    <BlockStack gap="200">
                      <Button
                        onClick={() => setActive(2)}
                        ariaControls={`fqa-${2}`}
                        variant="monochromePlain"
                        textAlign="left"
                      >
                        Create your Product Bundles
                      </Button>
                      <Collapsible
                        open={active == 2}
                        id={`fqa-${2}`}
                        transition={{
                          duration: "300ms",
                          timingFunction: "ease-in-out",
                        }}
                        expandOnPrint
                      >
                        <BlockStack gap="300">
                          <Text as="p" variant="bodyMd">
                            Set up your Product Bundles with multiple bundles to
                            increase store credibility
                          </Text>
                          <ButtonGroup>
                            <Button variant="primary">Create bundle</Button>
                          </ButtonGroup>
                        </BlockStack>
                      </Collapsible>
                    </BlockStack>
                  </InlineStack>
                </BlockStack>
              </StyledCard>
              <StyledCard active={active == 3}>
                <BlockStack key={1} gap="200">
                  <InlineStack wrap={false} gap="300">
                    <Tooltip
                      content={
                        setupGuide?.stepEnable
                          ? "Mark as not done"
                          : "Mark as done"
                      }
                    >
                      <StyledGuideIcon
                        active={setupGuide?.stepPreview}
                        onClick={() => handleComplete("preview")}
                      >
                        <Icon
                          source={
                            setupGuide?.stepPreview
                              ? CircleCheckedIcon
                              : CircleCheckIcon
                          }
                        ></Icon>
                      </StyledGuideIcon>
                    </Tooltip>
                    <BlockStack gap="200">
                      <Button
                        onClick={() => setActive(3)}
                        ariaControls={`fqa-${3}`}
                        variant="monochromePlain"
                        textAlign="left"
                      >
                        Visualize how it appears on your store
                      </Button>
                      <Collapsible
                        open={active == 3}
                        id={`fqa-${3}`}
                        transition={{
                          duration: "300ms",
                          timingFunction: "ease-in-out",
                        }}
                        expandOnPrint
                      >
                        <BlockStack gap="300">
                          <Text as="p" variant="bodyMd">
                            Visit the trigger product’s page to view the offer
                            widget
                          </Text>
                          <ButtonGroup>
                            <Button variant="primary">
                              Go to your online store
                            </Button>
                          </ButtonGroup>
                        </BlockStack>
                      </Collapsible>
                    </BlockStack>
                  </InlineStack>
                </BlockStack>
              </StyledCard>
            </BlockStack>
          </Box>
        </Collapsible>
      </Card>

      {toastMarkup}
    </StyledContainer>
  );
}
