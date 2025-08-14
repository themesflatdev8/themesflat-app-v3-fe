import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Toast,
  Scrollable,
  BlockStack,
} from "@shopify/polaris";
import { Loading, SaveBar } from "@/components/core";
import {
  StyledContainer,
  StyledContent,
  StyledPreview,
  StyledSettings,
} from "./styled-components";
import _routes from "@/constants/routes";
import Preview from "@/features/stock-countdown/components/Preview";
import Settings from "@/features/stock-countdown/components/Settings";
import General from "@/features/stock-countdown/components/General";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { clone, isEqual } from "@/utils/lodash";
import { _queryKey } from "@/constants/react-query";
import api from "@/api/settings";
import verifyAppApi from "@/api/verify-app";
import { _settingsDefault } from "@/features/stock-countdown/constants";
import { useAuthContext } from "@/features/auth/contexts";
import {
  FEATURE_TYPE_STOCK_COUNTDOWN,
} from "@/constants/settings";

type Props = {};

interface IFormInput {
  visibility: boolean,
  condition: string,
  conditionStock: number,
  text: string,
  template: string,
  backgroundColor: string,
  borderColor: string,
  textColor: string,
}

const schema = yup
  .object()
  .shape({
    text: yup.string()
      .trim()
      .required(`This field is required.`)
      .max(300, "Please enter no more than 300 characters."),
  })
  .required();

const Customization = ({}: Props) => {
  const router = useRouter();
  const [{ store }]: any = useAuthContext();

  const [isVisibleSaveBar, setIsVisibleSaveBar] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formClone, setFormClone] = useState(clone({}));
  const [formDefault, setFormDefault] = useState(null);
  const [isFirstLoadedVerifyAppBlock, setIsFirstLoadedVerifyAppBlock] =
    useState(false);
  const [isFirstLoadedVerifyAppEmbed, setIsFirstLoadedVerifyAppEmbed] =
    useState(false);
  const [isErrorVerifyAppBlock, setIsErrorVerifyAppBlock] = useState(false);
  const [isErrorVerifyAppEmbed, setIsErrorVerifyAppEmbed] = useState(false);
  const [toast, setToast] = useState({ active: false, content: "", error: false });
  const toggleActiveToast = useCallback(
    () => setToast((prev) => {
      return {...prev, active: !prev.active}
    }),
    []
  );

  const hasAppEmbed = useMemo(() => {
    return false
  }, [])

  const hasAppBlock = useMemo(() => {
    return true
  }, [])

  const getForm = (form: IFormInput) => {
    return {
      visibility: form?.visibility,
      condition: form?.condition,
      conditionStock: form?.conditionStock,
      text: form?.text,
      template: form?.template,
      backgroundColor: form?.backgroundColor,
      borderColor: form?.borderColor,
      textColor: form?.textColor,
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

  useQuery(
    [_queryKey.getCustomization, { type: FEATURE_TYPE_STOCK_COUNTDOWN }],
    async () => {
      let res = await api.getSettings({ type: FEATURE_TYPE_STOCK_COUNTDOWN });
      let { status = false, data = null } = res;
      setIsLoaded(true);
      if (status) {
        let objForm = getForm(data ?? clone(_settingsDefault));
        reset(objForm);
        setFormClone(() => clone(objForm));
        setFormDefault(() =>
          res.default ? clone(res.default) : _settingsDefault
        );
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
    data: isEnableAppBlock,
    refetch: refetchVerifyAppBlock,
    isFetching: isLoadingVerifyAppBlock,
  } = useQuery(
    [_queryKey.verifyAppBlock, { type: FEATURE_TYPE_STOCK_COUNTDOWN }],
    async () => {
      let res = await verifyAppApi.verifyAppBlock({ type: FEATURE_TYPE_STOCK_COUNTDOWN });
      let { status = false, verify = false } = res;
      if (isFirstLoadedVerifyAppBlock) {
        if (verify) {
          setIsErrorVerifyAppBlock(false);
          setToast({ active: true, content: "Verify successfully", error: false });
        } else {
          setToast({ active: true, content: "Verify failed", error: true });
          setIsErrorVerifyAppBlock(true);
        }
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
          setToast({ active: true, content: "Verify successfully", error: false });
        } else {
          setToast({ active: true, content: "Verify failed", error: true });
          setIsErrorVerifyAppEmbed(true);
        }
      }
      setIsFirstLoadedVerifyAppEmbed(true);
      return verify;
    },
    {
      enabled: hasAppEmbed,
    }
  );

  const { mutate: mutateUpdate, isLoading: isLoadingSave } = useMutation(
    async (form: any) => {
      let res = await api.updateSettings({form, type: FEATURE_TYPE_STOCK_COUNTDOWN});
      let {
        status = false,
        data: dataRes = null,
        message = "",
      } = res;
      if (status) {
        reset(getForm(form));
        setFormClone(() => clone(form));
        setToast({ active: true, content: "Settings updated", error: false });
      } else {
        setToast({ active: true, content: message ? message : "Server error!", error: true });
      }
      return res;
    }
  );

  const onReset = useCallback(async () => {
    reset(getForm(formDefault ? clone(formDefault) : clone(_settingsDefault)), {
      keepValues: true,
    });
  }, [formDefault]);

  const onDiscard = useCallback(() => {
    reset(getForm(formClone));
  }, [formClone]);

  useEffect(() => {
    if (isLoaded && !isEqual(getForm(watch()), getForm(formClone))) {
      setIsVisibleSaveBar(true);
    } else {
      setIsVisibleSaveBar(false);
    }
  }, [watch(), formClone, isLoaded]);

  return (
    <StyledContainer>
      {!isLoaded ? (
        <Loading></Loading>
      ) : (
        <StyledContent>
          <StyledSettings>
            <Scrollable style={{ maxHeight: "100%" }}>
              <BlockStack gap="300">
                <General
                  control={control}
                  isEnableAppBlock={isEnableAppBlock}
                  isEnableAppEmbed={isEnableAppEmbed}
                  isLoadingVerifyAppBlock={isLoadingVerifyAppBlock}
                  isLoadingVerifyAppEmbed={isLoadingVerifyAppEmbed}
                  verifyAppBlock={() => refetchVerifyAppBlock()}
                  verifyAppEmbed={() => refetchVerifyAppEmbed()}
                  hasAppEmbed={hasAppEmbed}
                  hasAppBlock={hasAppBlock}
                  isErrorVerifyAppBlock={isErrorVerifyAppBlock}
                  isErrorVerifyAppEmbed={isErrorVerifyAppEmbed}
                ></General>
                <Settings
                  form={watch()}
                  control={control}
                  errors={errors}
                  setValue={setValue}
                ></Settings>
              </BlockStack>
            </Scrollable>
          </StyledSettings>
          <StyledPreview>
            <Preview
              form={watch()}
              isLoading={!isLoaded}
            ></Preview>
          </StyledPreview>
        </StyledContent>
      )}

      <SaveBar
        isSaveBar={isVisibleSaveBar}
        isLoading={isLoadingSave}
        onSave={handleSubmit(onSubmit)}
        onDiscard={onDiscard}
      ></SaveBar>

      {toast.active ? (
        <Toast
          content={toast.content}
          error={toast.error}
          onDismiss={toggleActiveToast}
        />
      ) : null}
    </StyledContainer>
  );
};

export default Customization;
