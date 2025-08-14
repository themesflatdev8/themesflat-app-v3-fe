import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Page, Toast, Scrollable, Card, Button, Box, BlockStack, Text, InlineStack } from "@shopify/polaris";
import { ResetIcon } from "@shopify/polaris-icons";
import { ModalConfirm, Loading, Container, SaveBar } from "@/components/core";
import {
  StyledContainer,
  StyledContent,
  StyledPreview,
  StyledSettings,
} from "./styled-components";
import {
  StyledButtonGroup,
  StyledButton,
} from "@/styled-components/button-group";
import _routes from "@/constants/routes";
import Preview from "@/features/volume-customization/components/Preview";
import Settings from "@/features/volume-customization/components/Settings";
import General from "@/features/volume-customization/components/General";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { clone, isEqual } from "@/utils/lodash";
import { _queryKey } from "@/constants/react-query";
import api from "@/features/volume-customization/api";
import verifyAppApi from "@/api/verify-app";
import { _settingsDefault } from "@/features/volume-customization/constants";
import { useAuthContext } from "@/features/auth/contexts";
import { useCommonContext } from "@/contexts/common";
import ModalRequireExtension from "@/components/shared/ModalRequireExtension";
import { checkInstallExtension } from "@/utils/chrome-extension";
import { isEmpty } from "@/utils/lodash";
import _typeReducer from "@/constants/reducer";

interface IFormInput {
  visibility: boolean;
  title: string;
  contentMostPopular: string;
  contentChooseVariantTitle: string;
  contentChooseVariantButton: string;
  contentAddToCartButton: string;
  position: string;
  override: boolean;
  cardBackgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  borderColor: string;
  outstandColor: string;
  borderRadius: number | string;
}

const schema = yup
  .object()
  .shape({
    title: yup
      .string()
      .trim()
      .max(100, "Please enter no more than 100 characters."),
    contentMostPopular: yup
      .string()
      .trim()
      .required(`This field is required.`)
      .max(30, "Please enter no more than 30 characters."),
    contentChooseVariantTitle: yup
      .string()
      .trim()
      .required(`This field is required.`)
      .max(100, "Please enter no more than 100 characters."),
    contentChooseVariantButton: yup
      .string()
      .trim()
      .required(`This field is required.`)
      .max(60, "Please enter no more than 60 characters."),
    contentAddToCartButton: yup
      .string()
      .trim()
      .required(`This field is required.`)
      .max(60, "Please enter no more than 60 characters."),
  })
  .required();

const Customization = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [{ store }]: any = useAuthContext();
  let [{ loyalty, volumeDiscountSetting }, dispatchCommon]: any =
    useCommonContext();

  const isBlockFunc = useMemo(() => {
    return false;
    if (!loyalty) return true;
    if (loyalty.isComplete) return false;
    return true;
  }, [loyalty]);

  const [isDirtyCustom, setIsDirtyCustom] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorsServer, setErrorsServer] = useState({});
  const [formClone, setFormClone] = useState(clone({}));
  const [formDefault, setFormDefault] = useState(null);
  const [isFirstLoadedVerifyAppEmbed, setIsFirstLoadedVerifyAppEmbed] =
    useState(false);
  const [isErrorVerifyAppEmbed, setIsErrorVerifyAppEmbed] = useState(false);
  const [modalRequireExtension, setModalRequireExtension] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
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
      title: form.title || "",
      contentMostPopular: form.contentMostPopular || "",
      contentChooseVariantTitle: form.contentChooseVariantTitle || "",
      contentChooseVariantButton: form.contentChooseVariantButton || "",
      contentAddToCartButton: form.contentAddToCartButton || "",
      position: form.position,
      override: form.override,
      cardBackgroundColor: form.cardBackgroundColor,
      primaryColor: form.primaryColor,
      secondaryColor: form.secondaryColor,
      borderColor: form.borderColor,
      outstandColor: form.outstandColor,
      borderRadius: form.borderRadius,
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
    [_queryKey.getCustomizationQuantityBreaks],
    async () => {
      let res = await api.getCustomization();
      let { status = false, data = null } = res;
      setIsLoaded(true);
      if (status && data) {
        let objForm = getForm(data.settings);
        reset(objForm);
        // reset(getForm(_settingsDefault))
        setFormClone(() => clone(objForm));
        setFormDefault(() =>
          res.default ? clone(res.default) : _settingsDefault
        );
        dispatchCommon({
          type: _typeReducer.SET_VOLUME_DISCOUNT_SETTING,
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

  let {
    data: isEnableAppEmbed,
    refetch: refetchVerifyAppEmbed,
    isFetching: isLoadingVerifyAppEmbed,
  } = useQuery([_queryKey.verifyAppEmbed], async () => {
    let res = await verifyAppApi.verifyAppEmbed();
    let { status = false, verify = false } = res;
    if (isFirstLoadedVerifyAppEmbed) {
      if (verify) {
        setIsErrorVerifyAppEmbed(false);
        setToast({ content: "Verify successfully", error: false });
        setActiveToast(true);
      } else {
        setToast({ content: "Verify failed", error: true });
        setActiveToast(true);
        setIsErrorVerifyAppEmbed(true);
      }
    }
    dispatchCommon({
      type: _typeReducer.SET_ENABLE_APP_EMBED,
      payload: verify,
    });
    setIsFirstLoadedVerifyAppEmbed(true);
    return verify;
  });
  const { mutate: mutateUpdate, isLoading: isLoadingSave } = useMutation(
    async (form: any) => {
      let res = await api.update({ settings: form });
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
          type: _typeReducer.SET_VOLUME_DISCOUNT_SETTING,
          payload: {
            ...volumeDiscountSetting,
            settings: { ...volumeDiscountSetting.settings, ...form },
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
                      isEnableAppEmbed={isEnableAppEmbed}
                      isLoadingVerifyAppEmbed={isLoadingVerifyAppEmbed}
                      isErrorVerifyAppEmbed={isErrorVerifyAppEmbed}
                      verifyAppEmbed={() => refetchVerifyAppEmbed()}
                    ></General>
                  ) : (
                    <Settings
                      control={control}
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
                      errorsServer={errorsServer}
                      isBlockFunc={isBlockFunc}
                    ></Settings>
                  )}
                </Scrollable>
              </Box>
            </Card>
          </StyledSettings>
          <StyledPreview>
            <Preview form={watch()} isLoading={!isLoaded}></Preview>
          </StyledPreview>
        </StyledContent>
      )}

      <ModalRequireExtension
        open={modalRequireExtension}
        onClose={() => setModalRequireExtension(false)}
        onCancel={() => setModalRequireExtension(false)}
      ></ModalRequireExtension>

      <SaveBar
        isSaveBar={isDirty}
        isLoading={isLoadingSave}
        onSave={handleSubmit(onSubmit)}
        onDiscard={onDiscard}
      ></SaveBar>

      {toastMarkup}
    </StyledContainer>
  );
};

export default Customization;
