import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Page,
  Toast,
  Scrollable,
  Card,
  Button,
  BlockStack,
  Box,
  Select,
  Divider,
  InlineStack,
  Text,
} from "@shopify/polaris";
import { InfoIcon, ResetIcon } from "@shopify/polaris-icons";
import { Loading, SaveBar } from "@/components/core";
import {
  StyledContainer,
  StyledContent,
  StyledFooter,
  StyledPreview,
  StyledSettings,
  StyledSkeleton,
} from "./styled-components";
import {
  StyledButtonGroup,
  StyledButton,
} from "@/styled-components/button-group";
import _routes from "@/constants/routes";
import Preview from "@/features/bundle-customization/components/Preview";
import Settings from "@/features/bundle-customization/components/Settings";
import General from "@/features/bundle-customization/components/General";
import AppBlockRequired from "@/components/shared/AppBlockRequired";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { clone, isEqual } from "@/utils/lodash";
import { _queryKey } from "@/constants/react-query";
import api from "@/features/bundle-customization/api";
import verifyAppApi from "@/api/verify-app";
import apiBundle from "@/features/product-bundles/api";
import { _settingsDefault } from "@/features/bundle-customization/constants";
import { useAuthContext } from "@/features/auth/contexts";
import { useCommonContext } from "@/contexts/common";
import { checkInstallExtension } from "@/utils/chrome-extension";
import { isEmpty } from "@/utils/lodash";
import {
  PAGE_TYPE_PRODUCT,
  PAGE_TYPE_CART,
} from "@/features/product-bundles/constants";
import _typeReducer from "@/constants/reducer";
import {
  FEATURE_TYPE_PRODUCT_BUNDLES,
} from "@/constants/settings";

type Props = {};

interface IFormInput {
  visibility: boolean;
  themeOne: {
    themeName: string;
    template: string;
    title: string;
    subTitle: string;
    contentTotal: string;
    contentSave: string;
    contentAddToCartButton: string;
    useQuantity: boolean;
    cardBackgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
    borderColor: string;
    outstandColor: string;
    borderRadius: string | number;
    imageFit: string;
  };
  themeTwo: {
    themeName: string;
    template: string;
    title: string;
    subTitle: string;
    contentTotal: string;
    contentSave: string;
    contentAddToCartButton: string;
    useQuantity: boolean;
    cardBackgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
    borderColor: string;
    outstandColor: string;
    borderRadius: string | number;
    imageFit: string;
  };
  themeThree: {
    themeName: string;
    template: string;
    title: string;
    subTitle: string;
    contentTotal: string;
    contentSave: string;
    contentAddToCartButton: string;
    useQuantity: boolean;
    cardBackgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
    borderColor: string;
    outstandColor: string;
    borderRadius: string | number;
    imageFit: string;
  };
}

const schema = yup
  .object()
  .shape({
    themeOne: yup.object().shape({
      themeName: yup
        .string()
        .trim()
        .required(`This field is required.`)
        .max(100, "Please enter no more than 100 characters."),
      title: yup
        .string()
        .trim()
        .required(`This field is required.`)
        .max(150, "Please enter no more than 150 characters."),
      subTitle: yup
        .string()
        .trim()
        .max(250, "Please enter no more than 250 characters."),
      contentTotal: yup
        .string()
        .trim()
        .max(25, `Please enter no more than 25 characters.`),
      contentSave: yup
        .string()
        .trim()
        .max(10, `Please enter no more than 10 characters.`),
      contentAddToCartButton: yup
        .string()
        .trim()
        .required(`This field is required.`)
        .max(80, `Please enter no more than 80 characters.`),
    }),
    themeTwo: yup.object().shape({
      themeName: yup
        .string()
        .trim()
        .required(`This field is required.`)
        .max(100, "Please enter no more than 100 characters."),
      title: yup
        .string()
        .trim()
        .required(`This field is required.`)
        .max(150, "Please enter no more than 150 characters."),
      subTitle: yup
        .string()
        .trim()
        .max(250, "Please enter no more than 250 characters."),
      contentTotal: yup
        .string()
        .trim()
        .max(25, `Please enter no more than 25 characters.`),
      contentSave: yup
        .string()
        .trim()
        .max(10, `Please enter no more than 10 characters.`),
      contentAddToCartButton: yup
        .string()
        .trim()
        .required(`This field is required.`)
        .max(80, `Please enter no more than 80 characters.`),
    }),
    themeThree: yup.object().shape({
      themeName: yup
        .string()
        .trim()
        .required(`This field is required.`)
        .max(100, "Please enter no more than 100 characters."),
      title: yup
        .string()
        .trim()
        .required(`This field is required.`)
        .max(150, "Please enter no more than 150 characters."),
      subTitle: yup
        .string()
        .trim()
        .max(250, "Please enter no more than 250 characters."),
      contentTotal: yup
        .string()
        .trim()
        .max(25, `Please enter no more than 25 characters.`),
      contentSave: yup
        .string()
        .trim()
        .max(10, `Please enter no more than 10 characters.`),
      contentAddToCartButton: yup
        .string()
        .trim()
        .required(`This field is required.`)
        .max(80, `Please enter no more than 80 characters.`),
    }),
  })
  .required();

const Customization = ({}: Props) => {
  let pageType = PAGE_TYPE_PRODUCT;
  const { t } = useTranslation();
  const router = useRouter();
  const { query } = router;
  const [{ store }]: any = useAuthContext();
  let [{ loyalty, bundleSetting }, dispatchCommon]: any = useCommonContext();

  const isLoyalty = useMemo(() => {
    if (!loyalty) return false;
    if (loyalty.isComplete) return true;
    return false;
  }, [loyalty]);

  const hasAppEmbed = useMemo(() => {
    if ([PAGE_TYPE_CART].includes(pageType)) {
      return true;
    }
    return false;
  }, [pageType]);

  const hasAppBlock = useMemo(() => {
    if ([PAGE_TYPE_PRODUCT].includes(pageType)) {
      return true;
    }
    return false;
  }, [pageType]);

  const [isDirtyCustom, setIsDirtyCustom] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorsServer, setErrorsServer] = useState({});
  const [formClone, setFormClone] = useState(clone({}));
  const [formDefault, setFormDefault] = useState(null);
  const [isFirstLoadedVerifyAppBlock, setIsFirstLoadedVerifyAppBlock] =
    useState(false);
  const [isFirstLoadedVerifyAppEmbed, setIsFirstLoadedVerifyAppEmbed] =
    useState(false);
  const [isErrorVerifyAppBlock, setIsErrorVerifyAppBlock] = useState(false);
  const [isErrorVerifyAppEmbed, setIsErrorVerifyAppEmbed] = useState(false);
  const [totalBundlePublish, setTotalBundlePublish] = useState(undefined);
  const [activeTab, setActiveTab] = useState(1);
  const [theme, setTheme] = useState("themeOne");
  const [activeToast, setActiveToast] = useState(false);
  const [toast, setToast] = useState({ content: "", error: false });
  const toggleActiveToast = useCallback(
    () => setActiveToast((activeToast) => !activeToast),
    []
  );
  const toastMarkup = activeToast ? (
    <Toast
      content={toast.content}
      error={toast.error}
      onDismiss={toggleActiveToast}
    />
  ) : null;

  const getForm = (form: IFormInput) => {
    return {
      visibility: form.visibility,
      themeOne: {
        themeName:
          (form.themeOne.themeName || "") ??
          _settingsDefault.themeOne.themeName,
        template: form.themeOne.template ?? _settingsDefault.themeOne.template,
        title: (form.themeOne.title || "") ?? _settingsDefault.themeOne.title,
        subTitle:
          (form.themeOne.subTitle || "") ?? _settingsDefault.themeOne.subTitle,
        contentTotal:
          (form.themeOne.contentTotal || "") ??
          _settingsDefault.themeOne.contentTotal,
        contentSave:
          (form.themeOne.contentSave || "") ??
          _settingsDefault.themeOne.contentSave,
        contentAddToCartButton:
          (form.themeOne.contentAddToCartButton || "") ??
          _settingsDefault.themeOne.contentAddToCartButton,
        useQuantity:
          form.themeOne.useQuantity ?? _settingsDefault.themeOne.useQuantity,
        cardBackgroundColor:
          form.themeOne.cardBackgroundColor ??
          _settingsDefault.themeOne.cardBackgroundColor,
        primaryColor:
          form.themeOne.primaryColor ?? _settingsDefault.themeOne.primaryColor,
        secondaryColor:
          form.themeOne.secondaryColor ??
          _settingsDefault.themeOne.secondaryColor,
        borderColor:
          form.themeOne.borderColor ?? _settingsDefault.themeOne.borderColor,
        outstandColor:
          form.themeOne.outstandColor ??
          _settingsDefault.themeOne.outstandColor,
        borderRadius:
          form.themeOne.borderRadius ?? _settingsDefault.themeOne.borderRadius,
        imageFit: form.themeOne.imageFit ?? _settingsDefault.themeOne.imageFit,
      },
      themeTwo: {
        themeName:
          (form.themeTwo.themeName || "") ??
          _settingsDefault.themeTwo.themeName,
        template: form.themeTwo.template ?? _settingsDefault.themeTwo.template,
        title: (form.themeTwo.title || "") ?? _settingsDefault.themeTwo.title,
        subTitle:
          (form.themeTwo.subTitle || "") ?? _settingsDefault.themeTwo.subTitle,
        contentTotal:
          (form.themeTwo.contentTotal || "") ??
          _settingsDefault.themeTwo.contentTotal,
        contentSave:
          (form.themeTwo.contentSave || "") ??
          _settingsDefault.themeTwo.contentSave,
        contentAddToCartButton:
          (form.themeTwo.contentAddToCartButton || "") ??
          _settingsDefault.themeTwo.contentAddToCartButton,
        useQuantity:
          form.themeTwo.useQuantity ?? _settingsDefault.themeTwo.useQuantity,
        cardBackgroundColor:
          form.themeTwo.cardBackgroundColor ??
          _settingsDefault.themeTwo.cardBackgroundColor,
        primaryColor:
          form.themeTwo.primaryColor ?? _settingsDefault.themeTwo.primaryColor,
        secondaryColor:
          form.themeTwo.secondaryColor ??
          _settingsDefault.themeTwo.secondaryColor,
        borderColor:
          form.themeTwo.borderColor ?? _settingsDefault.themeTwo.borderColor,
        outstandColor:
          form.themeTwo.outstandColor ??
          _settingsDefault.themeTwo.outstandColor,
        borderRadius:
          form.themeTwo.borderRadius ?? _settingsDefault.themeTwo.borderRadius,
        imageFit: form.themeTwo.imageFit ?? _settingsDefault.themeTwo.imageFit,
      },
      themeThree: {
        themeName:
          (form.themeThree.themeName || "") ??
          _settingsDefault.themeThree.themeName,
        template:
          form.themeThree.template ?? _settingsDefault.themeThree.template,
        title:
          (form.themeThree.title || "") ?? _settingsDefault.themeThree.title,
        subTitle:
          (form.themeThree.subTitle || "") ??
          _settingsDefault.themeThree.subTitle,
        contentTotal:
          (form.themeThree.contentTotal || "") ??
          _settingsDefault.themeThree.contentTotal,
        contentSave:
          (form.themeThree.contentSave || "") ??
          _settingsDefault.themeThree.contentSave,
        contentAddToCartButton:
          (form.themeThree.contentAddToCartButton || "") ??
          _settingsDefault.themeThree.contentAddToCartButton,
        useQuantity:
          form.themeThree.useQuantity ??
          _settingsDefault.themeThree.useQuantity,
        cardBackgroundColor:
          form.themeThree.cardBackgroundColor ??
          _settingsDefault.themeThree.cardBackgroundColor,
        primaryColor:
          form.themeThree.primaryColor ??
          _settingsDefault.themeThree.primaryColor,
        secondaryColor:
          form.themeThree.secondaryColor ??
          _settingsDefault.themeThree.secondaryColor,
        borderColor:
          form.themeThree.borderColor ??
          _settingsDefault.themeThree.borderColor,
        outstandColor:
          form.themeThree.outstandColor ??
          _settingsDefault.themeThree.outstandColor,
        borderRadius:
          form.themeThree.borderRadius ??
          _settingsDefault.themeThree.borderRadius,
        imageFit:
          form.themeThree.imageFit ?? _settingsDefault.themeThree.imageFit,
      },
    };
  };

  const formOptions = {
    resolver: yupResolver(schema),
    defaultValues: getForm({ ..._settingsDefault }),
  };

  const {
    control,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<IFormInput>(formOptions);
  const onSubmit: SubmitHandler<IFormInput> = async (form) => {
    try {
      mutateUpdate(form);
    } catch (err) {
      console.log("error", err);
    }
  };

  let { refetch: refetch } = useQuery(
    [_queryKey.getCustomization],
    async () => {
      let res = await api.getCustomization();
      let { status = false, data = null } = res;
      setIsLoaded(true);
      if (status && data) {
        let objForm = getForm(data.settings);
        reset(objForm);
        setFormClone(() => clone(objForm));
        setFormDefault(() =>
          res.default ? clone(res.default) : _settingsDefault
        );
        setTotalBundlePublish(data.total_bundle_publish);
        dispatchCommon({
          type: _typeReducer.SET_BUNDLE_SETTING,
          payload: data,
        });
        return data;
      }
      return res;
    },
    {
      staleTime: undefined,
      cacheTime: undefined,
    }
  );

  // const { data: dataFirstBundle } = useQuery([_queryKey.getFirstProductBundlePublish], async () => {
  //   let res = await apiBundle.getFirstProductBundlePublish();
  //   let { status = false, data = null } = res
  //   if (status && data) {
  //     return data
  //   }
  //   return res
  // });

  let {
    data: isEnableAppBlock,
    refetch: refetchVerifyAppBlock,
    isFetching: isLoadingVerifyAppBlock,
  } = useQuery(
    [_queryKey.verifyAppBlock, { type: FEATURE_TYPE_PRODUCT_BUNDLES }],
    async () => {
      let res = await verifyAppApi.verifyAppBlock({ type: FEATURE_TYPE_PRODUCT_BUNDLES });
      let { status = false, verify = false } = res;
      if (isFirstLoadedVerifyAppBlock) {
        if (verify) {
          setIsErrorVerifyAppBlock(false);
          setToast({ content: "Verify successfully", error: false });
          setActiveToast(true);
        } else {
          setToast({ content: "Verify failed", error: true });
          setIsErrorVerifyAppBlock(true);
        }
      }
      if (pageType == PAGE_TYPE_PRODUCT) {
        dispatchCommon({
          type: _typeReducer.SET_ENABLE_APP_BLOCK_PRODUCT_PAGE,
          payload: verify,
        });
      }
      setIsFirstLoadedVerifyAppBlock(true);
      return verify;
    },
    {
      enabled: hasAppBlock,
    }
  );

  let {
    data: isEnableAppEmbed,
    refetch: refetchVerifyAppEmbed,
    isFetching: isLoadingVerifyAppEmbed,
  } = useQuery(
    [_queryKey.verifyAppEmbed],
    async () => {
      let res = await verifyAppApi.verifyAppEmbed();
      let { status = false, verify = false } = res;
      if (isFirstLoadedVerifyAppEmbed) {
        if (verify) {
          setIsErrorVerifyAppEmbed(false);
          setToast({ content: "Verify successfully", error: false });
          setActiveToast(true);
        } else {
          setToast({ content: "Verify failed", error: true });
          setIsErrorVerifyAppEmbed(true);
        }
      }
      dispatchCommon({
        type: _typeReducer.SET_ENABLE_APP_EMBED,
        payload: verify,
      });
      setIsFirstLoadedVerifyAppEmbed(true);
      return verify;
    },
    {
      enabled: hasAppEmbed,
    }
  );

  const { mutate: mutateUpdate, isLoading: isLoadingSave } = useMutation(
    async (form: any) => {
      console.log("form form", form);
      let res = await api.update({
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
        // refetch()
        reset(getForm(form));
        setFormClone(() => clone(form));
        setIsDirtyCustom(() => false);
        if (form.isReset) {
          setToast({ content: "Reset successfully", error: false });
        } else {
          setToast({ content: "Saved", error: false });
        }
        setActiveToast(true);
        dispatchCommon({
          type: _typeReducer.SET_BUNDLE_SETTING,
          payload: {
            ...bundleSetting,
            settings: { ...bundleSetting.settings, ...form },
          },
        });
      } else {
        if (errors) {
          setErrorsServer(() => errors);
        } else {
          setToast({ content: message ? message : "Error!", error: true });
          setActiveToast(true);
        }
      }
      return res;
    }
  );

  const onReset = useCallback(async () => {
    reset(getForm(formDefault ? clone(formDefault) : clone(_settingsDefault)));
    setIsDirtyCustom(() => true);
  }, [formDefault]);

  const onDiscard = useCallback(() => {
    reset(getForm(formClone));
    setIsDirtyCustom(() => false);
    shopify.saveBar.hide("my-save-bar");
  }, [formClone]);

  const formCurrent = useMemo(() => {
    if (theme == "themeOne") {
      return watch("themeOne");
    }
    if (theme == "themeTwo") {
      return watch("themeTwo");
    }
    return watch(`themeThree`);
  }, [theme, watch, watch()]);

  return (
    <StyledContainer>
      {!isLoaded ? (
        <Loading></Loading>
      ) : (
        <StyledContent>
          <StyledSettings>
            <Card>
              <Box paddingBlockEnd="500">
                <BlockStack gap="200">
                  <InlineStack
                    gap="400"
                    align="space-between"
                    wrap={false}
                  >
                    <Text as="h3" variant="headingMd">Bundle Customization</Text>
                    <Button
                      variant="plain"
                      icon={ResetIcon}
                      onClick={() => {
                        onReset();
                      }}
                    >
                      Reset to default
                    </Button>
                    </InlineStack>
                  <Text as="p" variant="bodyMd" tone="subdued">Configure how the bundle widget behaves on your store</Text>
                </BlockStack>
              </Box>
              <StyledButtonGroup>
                <StyledButton
                  active={activeTab == 1}
                  onClick={() => {
                    setActiveTab(1);
                  }}
                >
                  General
                </StyledButton>
                <StyledButton
                  active={activeTab == 2}
                  onClick={() => {
                    setActiveTab(2);
                  }}
                >
                  Customization
                </StyledButton>
              </StyledButtonGroup>
              <Box paddingBlockStart="400">
                <Scrollable style={{ maxHeight: "100%" }}>
                  {activeTab == 1 ? (
                    <General
                      control={control}
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
                      errorsServer={errorsServer}
                      isEnableAppBlock={isEnableAppBlock}
                      isEnableAppEmbed={isEnableAppEmbed}
                      isLoadingVerifyAppBlock={isLoadingVerifyAppBlock}
                      isLoadingVerifyAppEmbed={isLoadingVerifyAppEmbed}
                      isErrorVerifyAppBlock={isErrorVerifyAppBlock}
                      isErrorVerifyAppEmbed={isErrorVerifyAppEmbed}
                      verifyAppBlock={() => refetchVerifyAppBlock()}
                      verifyAppEmbed={() => refetchVerifyAppEmbed()}
                      totalBundlePublish={totalBundlePublish}
                      hasAppEmbed={hasAppEmbed}
                      hasAppBlock={hasAppBlock}
                      pageType={pageType}
                    ></General>
                  ) : (
                    <BlockStack gap="400">
                      <Select
                        label="Choose widget theme"
                        options={[
                          {
                            label: watch("themeOne.themeName"),
                            value: "themeOne",
                          },
                          {
                            label: watch("themeTwo.themeName"),
                            value: "themeTwo",
                          },
                          {
                            label: watch("themeThree.themeName"),
                            value: "themeThree",
                          },
                        ]}
                        value={theme}
                        onChange={(val: any) => setTheme(val)}
                      ></Select>

                      <Divider></Divider>

                      <Settings
                        key={theme}
                        theme={theme}
                        control={control}
                        watch={watch}
                        setValue={setValue}
                        errors={errors}
                        errorsServer={errorsServer}
                        pageType={pageType}
                      ></Settings>
                    </BlockStack>
                  )}
                </Scrollable>
              </Box>
            </Card>
          </StyledSettings>
          <StyledPreview>
            <Preview
              form={formCurrent}
              pageType={pageType}
              isLoading={!isLoaded}
            ></Preview>
          </StyledPreview>
        </StyledContent>
      )}

      <SaveBar
        isSaveBar={isDirty || isDirtyCustom}
        isLoading={isLoadingSave}
        onSave={handleSubmit(onSubmit)}
        onDiscard={onDiscard}
      ></SaveBar>

      {toastMarkup}
    </StyledContainer>
  );
};

export default Customization;
