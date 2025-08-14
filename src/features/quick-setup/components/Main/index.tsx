import { useState, useCallback, startTransition, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Page,
  Card,
  Box,
  Button,
  Text,
  Link,
  BlockStack,
  Icon,
  InlineStack,
  ButtonGroup,
  Badge,
  ProgressBar,
  Banner,
  RadioButton,
  InlineGrid,
  Toast,
} from "@shopify/polaris";
import { ProductIcon, CartIcon, XIcon } from "@shopify/polaris-icons";
import { Modal, Image, ColorPicker, Container } from "@/components/core";
import {
  StyledContainer,
  StyledCampaign,
  StyledModalView,
} from "./styled-components";
import CreateBundle from "@/features/quick-setup/components/CreateBundle";
import CreateVolumeDiscount from "@/features/quick-setup/components/CreateVolumeDiscount";
import { getOnlyNumeric, formatOutputPrice } from "@/utils/money";
import { PAGE_TYPE_PRODUCT } from "@/features/product-bundles/constants";
import api from "@/features/quick-setup/api";
import apiBundle from "@/features/product-bundles/api";
import apiBundleCustom from "@/features/bundle-customization/api";
import apiVolume from "@/features/volume-discounts/api";
import apiVolumeCustom from "@/features/volume-customization/api";
import verifyAppApi from "@/api/verify-app";
import { _queryKey } from "@/constants/react-query";
import { SHOPIFY_THEME_APP_EXTENSION_ID } from "@/config/env";
import { _settingsDefault as _settingsDefaultVolume } from "@/features/volume-customization/constants";
import { _settingsDefault as _settingsDefaultBundle } from "@/features/bundle-customization/constants";
import guideAppBlockImage from "~/images/guide-app-block.png";
import finishedImage from "~/images/setup-finished.webp";
import { useAuthContext } from "@/features/auth/contexts";
import { _typeReducer } from "@/features/auth/constants";
import {
  FEATURE_TYPE_PRODUCT_BUNDLES,
} from "@/constants/settings";

export default function SetupGuide({}) {
  const [{ store }, dispatch]: any = useAuthContext();

  const [step, setStep] = useState("start");

  const [campaign, setCampaign] = useState("bundle");
  const [formCampaign, setFormCampaign] = useState(null);
  const [quickSetup, setQuickSetup] = useState(null);
  const [settingsBundle, setSettingsBundle] = useState({
    ..._settingsDefaultBundle,
  });
  const [settingsVolume, setSettingsVolume] = useState({
    ..._settingsDefaultVolume,
  });
  const [settings, setSettings] = useState({
    primaryColor: "#1e1212",
    borderRadius: 8,
  });
  const [isFirstLoadedVerifyAppBlock, setIsFirstLoadedVerifyAppBlock] =
    useState(false);
  const [isFirstLoadedVerifyAppEmbed, setIsFirstLoadedVerifyAppEmbed] =
    useState(false);
  const [isErrorVerifyAppBlock, setIsErrorVerifyAppBlock] = useState(false);
  const [isErrorVerifyAppEmbed, setIsErrorVerifyAppEmbed] = useState(false);
  const [modalView, setModalView] = useState({ open: false });
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const [toast, setToast] = useState({
    active: false,
    content: "",
    error: false,
  });
  const toggleActiveToast = useCallback(
    () => setToast((prev: any) => ({ ...prev, active: false })),
    []
  );
  const toastMarkup = toast.active ? (
    <Toast
      content={toast.content}
      error={toast.error}
      onDismiss={toggleActiveToast}
    />
  ) : null;

  const progressBar = useMemo(() => {
    if (step === "done") {
      return 100;
    }
    if (step === "settings") {
      return 80;
    }
    if (step === "enable") {
      return 60;
    }
    if (step === "create") {
      return 40;
    }
    if (step === "choose") {
      return 20;
    }
    return 0;
  }, [step]);

  const { mutate: mutationQuickSetup, isLoading: isLoadingQuickSetup } =
    useMutation(async ({ skip = false, complete = false }: any) => {
      let obj = store.setup_guide || {};
      obj.quickSetup = {
        skip,
        complete,
      };
      let res = await api.setupGuide({ setup_guide: obj });
      setQuickSetup(obj);
      if (skip) {
        onComplete(obj);
      }
      let { status = false, data, message = "", errors = null } = res;
      return res;
    });

  const { mutate: mutationCreateBundle } = useMutation(async (form: any) => {
    let obj: any = {
      ...form,
      minimumAmount: getOnlyNumeric(form.minimumAmount),
      discountValue: getOnlyNumeric(form.discountValue),
      list_commendations: form.list_commendations.map((item: any) => {
        return { id: item.id };
      }),
      pageType: PAGE_TYPE_PRODUCT,
    };
    let res = await apiBundle.create(obj);
    let { status = false, data, message = "", errors = null } = res;
    if (status) {
    } else {
    }
    return res;
  });

  const { mutate: mutationCreateVolume } = useMutation(async (form: any) => {
    let obj: any = {
      name: form.name,
      product_id: form.product_id,
      status: form.status,
      mostPopularActive: form.mostPopularActive,
      mostPopularPosition: form.mostPopularPosition,
      tiers: form.tiers.map((item: any) => {
        return {
          id: item.id || null,
          name: item.name,
          quantity: item.quantity,
          message: item.message || "",
          useDiscount: item.useDiscount,
          discountType: item.discountType,
          discountValue: getOnlyNumeric(item.discountValue || ""),
          discount_id: item.discount_id || null,
          discount_code: item.discount_code || null,
        };
      }),
      countdownTimerActive: form.countdownTimerActive,
      countdownTimerValue: form.countdownTimerValue,
      countdownTimerSession: form.countdownTimerSession,
      countdownTimerReaches: form.countdownTimerReaches,
    };
    let res = await apiVolume.create(obj);
    let { status = false, data, message = "", errors = null } = res;
    if (status) {
    } else {
    }
    return res;
  });

  useQuery(
    [_queryKey.getCustomization],
    async () => {
      let res = await apiBundleCustom.getCustomization();
      let { status = false, data = null } = res;
      if (status && data) {
        setSettingsBundle(data.settings);
        return data;
      } else {
        setSettingsBundle({ ..._settingsDefaultBundle });
      }
      return res;
    },
    {
      staleTime: undefined,
      cacheTime: undefined,
    }
  );

  const { mutate: mutationBundleCustomization } = useMutation(
    async (form: any) => {
      let res = await apiBundleCustom.update({
        settings: form,
        page_type: PAGE_TYPE_PRODUCT,
      });
      let {
        status = false,
        data: dataRes = null,
        message = "",
        errors = null,
      } = res;
      if (status) {
      } else {
      }
      return res;
    }
  );

  useQuery(
    [_queryKey.getCustomizationQuantityBreaks],
    async () => {
      let res = await apiVolumeCustom.getCustomization();
      let { status = false, data = null } = res;
      if (status && data?.settings) {
        setSettingsVolume(data?.settings);
        return data;
      } else {
        setSettingsVolume({ ..._settingsDefaultVolume });
      }
      return res;
    },
    {
      staleTime: undefined,
      cacheTime: undefined,
    }
  );

  const { mutate: mutationVolumeCustomization } = useMutation(
    async (form: any) => {
      let res = await apiVolumeCustom.update({ settings: form });
      let {
        status = false,
        data: dataRes = null,
        message = "",
        errors = null,
      } = res;
      if (status) {
      } else {
      }
      return res;
    }
  );

  let { refetch: refetchVerifyAppBlock, isFetching: isLoadingVerifyAppBlock } =
    useQuery(
      [_queryKey.verifyAppBlock, { type: FEATURE_TYPE_PRODUCT_BUNDLES }],
      async () => {
        let res = await verifyAppApi.verifyAppBlock({
          type: FEATURE_TYPE_PRODUCT_BUNDLES,
        });
        let { status = false, verify = false } = res;
        if (isFirstLoadedVerifyAppBlock) {
          if (!verify) {
            setToast({ active: true, content: "Verify failed", error: true });
          }
        }
        if (verify) {
          setIsErrorVerifyAppBlock(false);
        } else {
          setIsErrorVerifyAppBlock(true);
        }
        setIsFirstLoadedVerifyAppBlock(true);
        return verify;
      }
    );

  let { refetch: refetchVerifyAppEmbed, isFetching: isLoadingVerifyAppEmbed } =
    useQuery([_queryKey.verifyAppEmbed], async () => {
      let res = await verifyAppApi.verifyAppEmbed();
      let { status = false, verify = false } = res;
      if (isFirstLoadedVerifyAppEmbed) {
        if (!verify) {
          setToast({ active: true, content: "Verify failed", error: true });
        }
      }
      if (verify) {
        setIsErrorVerifyAppEmbed(false);
      } else {
        setIsErrorVerifyAppEmbed(true);
      }
      setIsFirstLoadedVerifyAppEmbed(true);
      return verify;
    });

  const handleStep = (active: string) => {
    startTransition(() => {
      setStep(active);
    });
  };

  const createCampaign = () => {
    setIsLoadingSave(true);
    if (campaign === "bundle") {
      mutationCreateBundle(formCampaign);
      mutationBundleCustomization({
        ...settingsBundle,
        visibility: true,
        themeOne: {
          ...settingsBundle.themeOne,
          primaryColor: settings.primaryColor,
          borderRadius: settings.borderRadius,
        },
        themeTwo: {
          ...settingsBundle.themeOne,
          primaryColor: settings.primaryColor,
          borderRadius: settings.borderRadius,
        },
        themeThree: {
          ...settingsBundle.themeOne,
          primaryColor: settings.primaryColor,
          borderRadius: settings.borderRadius,
        },
      });
    } else {
      mutationCreateVolume(formCampaign);
      mutationVolumeCustomization({
        ...settingsVolume,
        visibility: true,
        primaryColor: settings.primaryColor,
        borderRadius: settings.borderRadius,
      });
    }
    mutationQuickSetup({ skip: false, complete: true });
    setTimeout(() => {
      handleStep("done");
      setIsLoadingSave(false);
    }, 3000);
  };

  const openUrl = useCallback((path: string) => {
    window.open(`shopify://admin${path}`, "_blank");
  }, []);

  const onComplete = (data?: any) => {
    let obj = data ? data : quickSetup;
    dispatch({
      type: _typeReducer.SET_STORE,
      payload: { ...store, setup_guide: obj },
    });
  };

  return (
    <StyledContainer>
      <Container size="md">
        <Page
          title="Set Up"
          // titleMetadata={<Badge>Pending</Badge>}
          subtitle="Your journey starts here"
          secondaryActions={
            step != "done" && !quickSetup
              ? [
                  {
                    content: "Skip",
                    loading: isLoadingQuickSetup,
                    onAction: () => {
                      mutationQuickSetup({ skip: true, complete: false });
                    },
                  },
                ]
              : undefined
          }
        >
          <BlockStack gap="400">
            {step != "start" ? (
              <ProgressBar progress={progressBar} size="large"></ProgressBar>
            ) : null}
            {step == "start" ? (
              <BlockStack gap="400">
                <Card>
                  <BlockStack gap="400">
                    <Text as="h3" variant="headingMd">
                      Get started by quickly setting up
                    </Text>
                    <Text as="p" variant="bodyMd">
                      Setup some basic app settings to start use M-Sell Bundles
                    </Text>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      Estimated time: 1-3 minutes.
                    </Text>
                    <div>
                      <Button
                        variant="primary"
                        onClick={() => handleStep("choose")}
                      >
                        Get started
                      </Button>
                    </div>
                  </BlockStack>
                </Card>
              </BlockStack>
            ) : null}
            {step == "choose" ? (
              <BlockStack gap="400">
                <Card>
                  <BlockStack gap="400">
                    <Text as="h3" variant="headingMd">
                      Choose your desired campaign type for your store
                    </Text>
                    <InlineGrid
                      gap="400"
                      columns={{ xs: "1fr", md: "1fr 1fr" }}
                    >
                      <StyledCampaign
                        active={campaign === "bundle"}
                        onClick={() => setCampaign("bundle")}
                      >
                        <BlockStack gap="400" align="center">
                          <InlineStack gap="200">
                            <span>
                              <Icon source={ProductIcon}></Icon>
                            </span>
                            <Text variant="headingSm" as="h4">
                              Product Bundles
                            </Text>
                          </InlineStack>
                          <BlockStack gap="100" align="center">
                            <Text variant="bodyMd" as="p" tone="subdued">
                              Help text
                            </Text>
                          </BlockStack>
                        </BlockStack>
                      </StyledCampaign>
                      <StyledCampaign
                        active={campaign === "volume"}
                        onClick={() => setCampaign("volume")}
                      >
                        <BlockStack gap="400" align="center">
                          <InlineStack gap="200">
                            <span>
                              <Icon source={CartIcon}></Icon>
                            </span>
                            <Text variant="headingSm" as="h4">
                              Volume Discount
                            </Text>
                          </InlineStack>
                          <BlockStack gap="100" align="center">
                            <Text variant="bodyMd" as="p" tone="subdued">
                              Help text
                            </Text>
                          </BlockStack>
                        </BlockStack>
                      </StyledCampaign>
                    </InlineGrid>
                  </BlockStack>
                </Card>
                <InlineStack gap="200" align="end">
                  <Button onClick={() => handleStep("start")}>Back</Button>
                  <Button
                    variant="primary"
                    onClick={() => handleStep("create")}
                  >
                    Next
                  </Button>
                </InlineStack>
              </BlockStack>
            ) : null}
            {step == "create" && campaign == "bundle" ? (
              <CreateBundle
                onBack={() => handleStep("choose")}
                onNext={(form: any) => {
                  setFormCampaign(form);
                  handleStep("enable");
                }}
              ></CreateBundle>
            ) : null}
            {step == "create" && campaign == "volume" ? (
              <CreateVolumeDiscount
                onBack={() => handleStep("choose")}
                onNext={(form: any) => {
                  setFormCampaign(form);
                  handleStep("enable");
                }}
              />
            ) : null}
            {step == "enable" && campaign == "bundle" ? (
              <BlockStack gap="400">
                <Card>
                  <BlockStack gap="400">
                    <Text as="h3" variant="headingMd">
                      Enable 'M-Sell' on your theme
                    </Text>
                    {!isErrorVerifyAppBlock ? (
                      <Banner tone="success">
                        <p>
                          The 'M-Sell' element is added in your theme,
                          everything is ready here.
                        </p>
                      </Banner>
                    ) : (
                      <Banner tone="critical">
                        <p>
                          M-Sell not added M-Sell Bundles on your theme, please
                          follow the list below to enable
                        </p>
                      </Banner>
                    )}
                    <BlockStack gap="400">
                      <BlockStack gap="200">
                        <Text as="p" variant="bodyMd">
                          <strong>1.</strong> Click 'Enable app' below to go to
                          theme app page
                        </Text>
                        <Text as="p" variant="bodyMd">
                          <strong>2.</strong> Click add block section of your
                          theme settings and select{" "}
                          <strong>M-Sell Bundles</strong> (left side) -{" "}
                          <Link
                            onClick={() =>
                              setModalView((prev) => ({ ...prev, open: true }))
                            }
                          >
                            Demo
                          </Link>
                        </Text>
                        <Text as="p" variant="bodyMd">
                          <strong>3.</strong> Save the theme settings by
                          clicking <strong>Save</strong>. (Make sure you click{" "}
                          <strong>Save</strong>)
                        </Text>
                        <Text as="p" variant="bodyMd">
                          <strong>4.</strong> Click 'Verify' below to confirm
                          it's done.
                        </Text>
                      </BlockStack>
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
                        {isErrorVerifyAppBlock ? (
                          <Button
                            variant="plain"
                            loading={isLoadingVerifyAppBlock}
                            onClick={() => refetchVerifyAppBlock()}
                          >
                            Verify
                          </Button>
                        ) : null}
                      </ButtonGroup>
                    </BlockStack>
                  </BlockStack>
                </Card>
                <InlineStack gap="200" align="end">
                  <Button onClick={() => handleStep("create")}>Back</Button>
                  <Button
                    variant="primary"
                    onClick={() => handleStep("settings")}
                  >
                    Next
                  </Button>
                </InlineStack>
              </BlockStack>
            ) : null}
            {step == "enable" && campaign == "volume" ? (
              <BlockStack gap="400">
                <Card>
                  <BlockStack gap="300">
                    <Text as="h3" variant="headingMd">
                      Add 'M-Sell Bundles' on your theme
                    </Text>
                    {!isErrorVerifyAppEmbed ? (
                      <Banner tone="success">
                        <p>
                          The 'M-Sell' element is enabled in your theme,
                          everything is ready here.
                        </p>
                      </Banner>
                    ) : (
                      <Banner tone="critical">
                        <p>
                          M-Sell not enabled on your theme, please follow the
                          list below to enable
                        </p>
                      </Banner>
                    )}
                    <BlockStack gap="300">
                      <BlockStack gap="200">
                        <Text as="p" variant="bodyMd">
                          <strong>1.</strong> Click 'Enable app embeds' below to
                          go to theme app page
                        </Text>
                        <Text as="p" variant="bodyMd">
                          <strong>2.</strong> Make sure the{" "}
                          <strong>M-Sell</strong> is enabled (left side)
                        </Text>
                        <Text as="p" variant="bodyMd">
                          <strong>3.</strong> Save the theme settings by
                          clicking <strong>Save</strong>. (Make sure you click{" "}
                          <strong>Save</strong>)
                        </Text>
                        <Text as="p" variant="bodyMd">
                          <strong>4.</strong> Click 'Verify' below to confirm
                          it's done.
                        </Text>
                      </BlockStack>
                      <ButtonGroup>
                        <Button
                          variant="primary"
                          onClick={() =>
                            openUrl(
                              `/themes/current/editor?context=apps&activateAppId=${SHOPIFY_THEME_APP_EXTENSION_ID}/app-embed`
                            )
                          }
                        >
                          Enable app embeds
                        </Button>
                        {isErrorVerifyAppEmbed ? (
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
                </Card>
                <InlineStack gap="200" align="end">
                  <Button onClick={() => handleStep("create")}>Back</Button>
                  <Button
                    variant="primary"
                    onClick={() => handleStep("settings")}
                  >
                    Next
                  </Button>
                </InlineStack>
              </BlockStack>
            ) : null}
            {step == "settings" ? (
              <BlockStack gap="400">
                <Card>
                  <BlockStack gap="300">
                    <Text as="h3" variant="headingMd">
                      Let us know some basic info of your theme
                    </Text>
                    <BlockStack gap="300">
                      <BlockStack gap="100">
                        <Text as="p" variant="bodyMd">
                          1. Primary color
                        </Text>
                        <ColorPicker
                          allowInput={true}
                          allowAlpha={true}
                          label={"Primary color"}
                          value={settings.primaryColor}
                          onChange={(val: any) => {
                            setSettings((prev) => ({
                              ...prev,
                              primaryColor: val,
                            }));
                          }}
                        />
                        <Text as="p" variant="bodyMd" tone="subdued">
                          Tip: Use the color of your add-to-cart button
                        </Text>
                      </BlockStack>
                    </BlockStack>
                    <BlockStack gap="300">
                      <BlockStack gap="100">
                        <Text as="p" variant="bodyMd">
                          2. Rounded corners
                        </Text>
                        <BlockStack gap="200">
                          <RadioButton
                            label="Yes, my theme uses rounded corners"
                            checked={settings.borderRadius == 8}
                            id="corners-yes"
                            name="corners"
                            onChange={() => {
                              setSettings((prev) => ({
                                ...prev,
                                borderRadius: 8,
                              }));
                            }}
                          />
                          <RadioButton
                            label="No, my theme doesn't use rounded corners"
                            id="corners-no"
                            name="corners"
                            checked={settings.borderRadius == 0}
                            onChange={() => {
                              setSettings((prev) => ({
                                ...prev,
                                borderRadius: 0,
                              }));
                            }}
                          />
                        </BlockStack>
                        <Text as="p" variant="bodyMd" tone="subdued">
                          Tip: Check if your add-to-cart button uses rounded
                          corners
                        </Text>
                      </BlockStack>
                    </BlockStack>
                  </BlockStack>
                </Card>
                <InlineStack gap="200" align="end">
                  <Button
                    disabled={isLoadingSave}
                    onClick={() => handleStep("enable")}
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    loading={isLoadingSave}
                    onClick={() => createCampaign()}
                  >
                    Create
                  </Button>
                </InlineStack>
              </BlockStack>
            ) : null}
            {step == "done" ? (
              <BlockStack gap="400">
                <Card padding="1000">
                  <BlockStack gap="300" inlineAlign="center">
                    <Text as="h3" variant="headingMd">
                      Now it's time to create your first{" "}
                      {campaign == "bundle" ? "Bundle" : "Volume discount"}!
                    </Text>
                    <Image
                      root={true}
                      alt=""
                      src={finishedImage.src}
                      width="200"
                      height="200"
                    ></Image>
                  </BlockStack>
                </Card>
                <InlineStack gap="200" align="end">
                  <Button variant="primary" onClick={() => onComplete()}>
                    Finish
                  </Button>
                </InlineStack>
              </BlockStack>
            ) : null}
          </BlockStack>
        </Page>
      </Container>

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

      {toastMarkup}
    </StyledContainer>
  );
}
