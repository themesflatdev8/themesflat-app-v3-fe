import { useState, useCallback, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Toast,
  Card,
  TextField,
  Layout,
  Button,
  BlockStack,
  ButtonGroup,
  InlineStack,
  Select,
  Box,
  Banner,
  List,
  Text,
  Icon,
} from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import { ModalConfirm, Loading, Switch, SaveBar } from "@/components/core";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  StyledContainer,
  StyledContent,
  StyledAnalyze,
} from "./styled-components";
import MainResource from "@/features/volume-discounts/components/MainResource";
import Tier from "@/features/volume-discounts/components/Tier";
import api from "@/features/volume-discounts/api";
import { clone } from "@/utils/lodash";
import { _queryKey } from "@/constants/react-query";
import _routes from "@/constants/routes";
import { _formDefault } from "@/features/volume-discounts/constants";
import _typeReducer from "@/constants/reducer";
import { useAuthContext } from "@/features/auth/contexts";
import { useCommonContext } from "@/contexts/common";
import ModalRequireExtension from "@/components/shared/ModalRequireExtension";
import { checkInstallExtension } from "@/utils/chrome-extension";
import { isEmpty } from "@/utils/lodash";
import { getOnlyNumeric, formatOutputPrice } from "@/utils/money";
import CountdownTimer from "@/features/volume-discounts/components/CountdownTimer";
import Preview from "@/features/volume-customization/components/Preview";
import { useActiveOfferSetting } from "@/hooks";

type Props = {
  formId: any;
  onAction: Function;
};

type TTiers = {
  id?: string;
  name: string;
  quantity: string | number;
  message: string;
  useDiscount: number;
  discountType: string;
  discountValue: string;
};

interface IFormInput {
  name: string;
  status: number;
  product_id: string | number;
  mostPopularActive: number;
  mostPopularPosition: string;
  tiers: TTiers[];
  countdownTimerActive: number;
  countdownTimerValue: string | number;
  countdownTimerSession: string | number;
  countdownTimerReaches: string | number;
}

const schema = yup
  .object()
  .shape({
    name: yup
      .string()
      .trim()
      .required("This field is required.")
      .max(100, "Please enter no more than 100 characters."),
    product_id: yup.string().required("Please select a product"),
    tiers: yup
      .array()
      .of(
        yup.object().shape({
          name: yup
            .string()
            .trim()
            .required("This field is required.")
            .max(100, "Please enter no more than 100 characters."),
          quantity: yup
            .string()
            .required(
              "The quantity in this tier cannot exceed the quantity in a higher tier"
            )
            .test("integer", "Please enter a valid number.", (value: any) => {
              return /^\d+$/.test(value);
            })
            .matches(/^[0-9]{1,9}$/, "Please enter a valid number."),
          message: yup.string().trim(),
          discountValue: yup
            .string()
            .when("useDiscount", ([useDiscount], schema) => {
              if (useDiscount)
                return schema
                  .required("This field is required.")
                  .test(
                    "invalid_percent",
                    "Please enter a value between 0 and 100.",
                    (value: any, context: any) => {
                      let parent = context.parent;
                      if (
                        parent.useDiscount &&
                        parent.discountType == "percent"
                      ) {
                        if (!value) return false;
                        let val = Number(getOnlyNumeric(`${value}`));
                        return val <= 0 || val > 100 ? false : true;
                      }
                      return true;
                    }
                  )
                  .test(
                    "invalid_amount",
                    "Please enter a value greater than 0",
                    (value: any, context: any) => {
                      let parent = context.parent;
                      if (
                        parent.useDiscount &&
                        parent.discountType == "amount"
                      ) {
                        if (!value) return false;
                        let val = Number(getOnlyNumeric(`${value}`));
                        return val <= 0 ? false : true;
                      }
                      return true;
                    }
                  );
              return schema;
            }),
        })
      )
      .test(
        "quantity",
        "The quantity in this tier cannot exceed the quantity in a higher tier",
        (value, context) => {
          const errors: any = [];
          if (value && value.length > 1) {
            value?.forEach((item: any, index: number) => {
              if (
                index > 0 &&
                Number(`${item.quantity}`.replace(/\D/gi, "")) <=
                  Number(`${value[index - 1].quantity}`.replace(/\D/gi, ""))
              ) {
                errors.push(
                  context.createError({
                    path: `tiers[${index}].quantity`,
                    message:
                      "The quantity in this tier cannot exceed the quantity in a higher tier",
                  })
                );
              }
            });
          }
          if (errors.length > 0) {
            throw new yup.ValidationError(errors);
          }
          return true;
        }
      ),
  })
  .required();

function Form({ onAction, formId }: Props) {
  const [{ store }]: any = useAuthContext();
  let [{ loyalty, volumeDiscountSetting }]: any = useCommonContext();
  let { isEnableProduct } = useActiveOfferSetting();

  const [mainData, setMainData]: any = useState(null);
  const [errorsServer, setErrorsServer]: any = useState({});
  const [formClone, setFormClone] = useState(clone(_formDefault));
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
  const [modalRequireExtension, setModalRequireExtension] = useState(false);
  const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] =
    useState(false);
  const [isCreated, setIsCreated] = useState(false);

  const [toast, setToast] = useState({
    active: false,
    content: "",
    error: false,
  });
  const toggleActiveToast = useCallback(
    () =>
      setToast((prev) => {
        return { ...prev, active: !prev.active };
      }),
    []
  );
  const toastMarkup = toast.active ? (
    <Toast
      content={toast.content}
      error={toast.error}
      onDismiss={toggleActiveToast}
    />
  ) : null;

  const getForm = (form: IFormInput) => {
    return {
      name: form.name,
      product_id: form.product_id,
      status: form.status,
      mostPopularActive: form.mostPopularActive,
      mostPopularPosition: form.mostPopularPosition,
      tiers: form.tiers || _formDefault.tiers,
      countdownTimerActive: form.countdownTimerActive,
      countdownTimerValue: form.countdownTimerValue,
      countdownTimerSession: form.countdownTimerSession,
      countdownTimerReaches: form.countdownTimerReaches,
    };
  };

  const handleData = (data: any) => {
    let objNew: any = {
      name: data.name,
      product_id: data.product_id,
      status: data.status,
      mostPopularActive: data.mostPopularActive,
      mostPopularPosition: `${data.mostPopularPosition ?? 1}`,
      tiers: data.tiers.map((item: any, index: number) => {
        return {
          id: item.id,
          name: item.name || "",
          quantity: item.quantity,
          message: item.message || "",
          useDiscount: item.useDiscount,
          discountType: item.discountType,
          discountValue:
            item.discountType == "percent"
              ? item.discountValue || ""
              : formatOutputPrice(item.discountValue || ""),
          discount_id: item.discount_id || null,
          discount_code: item.discount_code || null,
          chosen: false,
          selected: false,
        };
      }),
      countdownTimerActive: data.countdownTimerActive,
      countdownTimerValue: data.countdownTimerValue,
      countdownTimerSession: data.countdownTimerSession,
      countdownTimerReaches: data.countdownTimerReaches,
    };
    reset(getForm(objNew));
    setFormClone(() => clone(getForm(objNew)));
  };

  const formOptions = {
    resolver: yupResolver(schema),
    defaultValues: getForm({ ..._formDefault }),
  };

  const {
    control,
    reset,
    setValue,
    watch,
    clearErrors,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<IFormInput>(formOptions);
  const onSubmit: SubmitHandler<IFormInput> = async (form) => {
    try {
      mutationForm(form);
    } catch (err) {
      console.log("error", err);
    }
  };

  const watchTiers: any = useWatch({ control, name: "tiers" });

  let { data: dataDetail, isLoading } = useQuery(
    [_queryKey.getQuantityBreaks, { id: formId }],
    async () => {
      let res = await api.getDetail(formId);
      let { status = false, data = null } = res;
      if (status && data) {
        setMainData(clone(data))
        handleData(clone(data));
        return data;
      }
      return res;
    },
    {
      cacheTime: 0,
      staleTime: 0,
      enabled: formId ? true : false
    }
  );

  const { mutate: mutationForm, isLoading: isLoadingSave } = useMutation(
    async (form: any) => {
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
      let res = null;
      if (formId || isCreated) {
        res = await api.update({
          id: formId,
          form: { ...obj, id: formId },
        });
      } else {
        res = await api.create(obj);
      }
      let { status = false, data, message = "", errors = null } = res;
      if (status) {
        shopify.saveBar.hide("my-save-bar");
        if (formId || isCreated) {
          setToast({ active: true, content: "Saved", error: false });
          handleData(form);
        } else {
          setIsCreated(true);
          setToast({
            active: true,
            content: "Volume discount created",
            error: false,
          });
          data && handleData(clone(data));
        }
      } else {
        if (errors) {
          setErrorsServer(() => errors);
        } else {
          setToast({
            active: true,
            content: message ? message : "Server error!",
            error: true,
          });
        }
      }
      return res;
    }
  );

  const { mutate: mutationRemove, isLoading: isLoadingRemove } = useMutation(
    async () => {
      setIsOpenModalConfirmDelete(false);
      const res = await api.remove({ ids: [formId], is_all: false });
      let { status = false, data = {}, message = "" } = res;
      if (status) {
        shopify.saveBar.hide("my-save-bar");
        onAction({type: "removed"})
      } else {
        setToast({ active: true, content: `Server error!`, error: true });
      }
      return res;
    }
  );

  const onDiscard = useCallback(() => {
    setMainData(dataDetail ? clone(dataDetail) : null);
    reset(getForm(formClone));
    setIsOpenModalConfirm(false);
    shopify.saveBar.hide("my-save-bar");
  }, [formClone, dataDetail]);

  const optionsTiers = useMemo(() => {
    let arr: any = [];
    watchTiers.map((item: any, index: number) => {
      arr.push({
        label: item.name || `Tier ${index + 1}`,
        value: `${index + 1}`,
      });
    });
    return arr;
  }, [watchTiers]);

  const tiers = useMemo(() => {
    if (!mainData) return null;
    let arr: any = [];
    watchTiers.map((item: any, index: number) => {
      let price = (mainData?.variants?.[0].price || 0) * Number(item.quantity);
      let salePrice = 0;
      if (item.discountType == "percent") {
        salePrice = price - (price * Number(item.discountValue)) / 100;
      } else {
        let newPrice = price - Number(item.discountValue);
        salePrice = newPrice > 0 ? newPrice : 0;
      }
      let obj = {
        id: index + 1,
        name: item.name || `Tier ${index + 1}`,
        regularPrice:
          salePrice > 0
            ? `${formatOutputPrice(salePrice) || 0} ${store.currency}`
            : `0 ${store.currency}`,
        salePrice: `${formatOutputPrice(price) || 0} ${store.currency}`,
        message: item.message || "",
        useDiscount: item.useDiscount,
        quantity: item.quantity,
        discountValue: item.useDiscount
          ? item.discountType == "percent"
            ? `${item.discountValue || 0}%` || ""
            : `${formatOutputPrice(item.discountValue || "0")} ${store.currency}`
          : "",
        isPopular: Number(watch("mostPopularPosition")) - 1 == index,
      };
      arr.push(obj);
    });
    return arr;
  }, [store, mainData, watchTiers, watch("mostPopularPosition")]);

  useEffect(() => {
    if(!formId){
      handleData(clone(_formDefault));
    }
  }, []);

  useEffect(() => {
    if (watchTiers.length < Number(watch("mostPopularPosition"))) {
      setValue("mostPopularPosition", `${watchTiers.length}`, {
        shouldDirty: true,
      });
    }
  }, [watchTiers, watch("mostPopularPosition")]);

  return (
    <StyledContainer>
      <Card>
        <Box paddingBlockEnd="400">
          <InlineStack gap="200">
            <span 
              style={{cursor: "pointer"}}
              onClick={() => {
                shopify.saveBar.hide("my-save-bar");
                onAction({ type: "list" });
              }}
            >
              <Icon source={ArrowLeftIcon}></Icon>
            </span>
            <Text as="h3" variant="headingMd">{
              !formId && !isCreated
                ? "Create volume discount"
                : "Edit volume discount"
            }</Text>
          </InlineStack>
        </Box>
        {formId && isLoading ? (
          <Loading></Loading>
        ) : (
          <StyledContent>
            <Layout>
              <Layout.Section>
                <BlockStack gap="400">
                  <Card padding="400">
                    <BlockStack gap="400">
                      <div>
                        <Controller
                          name="name"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <TextField
                              label="Volume discount name"
                              value={value}
                              placeholder={`Enter name`}
                              onChange={onChange}
                              autoComplete="off"
                              error={
                                errorsServer?.name || errors?.name?.message
                              }
                            ></TextField>
                          )}
                        />
                      </div>
                      <MainResource
                        errors={errors}
                        control={control}
                        watch={watch}
                        setValue={setValue}
                        mainData={mainData}
                        setMainData={setMainData}
                      />
                    </BlockStack>
                  </Card>

                  <Tier
                    errors={errors}
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    setToast={setToast}
                  />

                  <CountdownTimer
                    errors={errors}
                    errorsServer={errorsServer}
                    control={control}
                    watch={watch}
                  />
                </BlockStack>
              </Layout.Section>
              <Layout.Section variant="oneThird">
                <BlockStack gap="400">
                  <Card>
                    <BlockStack gap="400">
                      <Controller
                        name="status"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Select
                            label="Status"
                            value={`${value}`}
                            options={[
                              { label: "Active", value: "1" },
                              { label: "Draft", value: "0" },
                            ]}
                            onChange={(val) => onChange(Number(val))}
                          ></Select>
                        )}
                      />
                      <BlockStack gap="200">
                        <InlineStack gap="200" align="space-between">
                          <Text variant="bodyMd" as="span" fontWeight="medium">
                            Most popular
                          </Text>
                          <Controller
                            name="mostPopularActive"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Switch
                                checked={value ? true : false}
                                onChange={(val: boolean) =>
                                  onChange(val ? 1 : 0)
                                }
                              />
                            )}
                          />
                        </InlineStack>
                        <Controller
                          name="mostPopularPosition"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Select
                              label="Position"
                              labelHidden
                              options={optionsTiers}
                              value={`${value}`}
                              onChange={(val: any) => onChange(val)}
                              helpText="Tier to show 'Most Popular'"
                            ></Select>
                          )}
                        />
                      </BlockStack>
                    </BlockStack>
                  </Card>
                  {volumeDiscountSetting ? (
                    <Card padding="0">
                      <Box paddingBlockStart="300">
                        <Preview
                          form={volumeDiscountSetting?.settings}
                          tiers={tiers}
                          useCountdownTimer={watch("countdownTimerActive")}
                          type="offer"
                          countdownTimer={watch("countdownTimerValue") || 0}
                        ></Preview>
                      </Box>
                    </Card>
                  ) : null}
                  <Banner tone="warning" title=" IMPORTANT NOTE:">
                    <div style={{ marginLeft: "-16px", marginTop: "4px" }}>
                      <List type="number">
                        <List.Item>
                          Discount codes will be created randomly with the
                          pattern MS_*****. Please do not alter the code
                          directly on Shopify to avoid checkout issues.
                        </List.Item>
                        <List.Item>
                          If you deactivate the widget, turn off our app embed,
                          or uninstall the app, you will need to manage any
                          existing discount codes starting with MS_*****
                          yourself to prevent potential financial issues.
                        </List.Item>
                      </List>
                    </div>
                  </Banner>
                </BlockStack>
              </Layout.Section>
            </Layout>
            <Box paddingBlockStart="400">
              <InlineStack gap="200" align="end" wrap={false}>
                <ButtonGroup>
                  {formId || isCreated ? (
                    <Button
                      variant="primary"
                      tone="critical"
                      loading={isLoadingRemove}
                      onClick={() => {}}
                    >
                      Delete bundle
                    </Button>
                  ) : null}
                  <Button
                    variant="primary"
                    disabled={!isDirty}
                    loading={isLoadingSave}
                    onClick={handleSubmit(onSubmit)}
                  >
                    Save
                  </Button>
                </ButtonGroup>
              </InlineStack>
            </Box>
          </StyledContent>
        )}
      </Card>

      <ModalConfirm
        open={isOpenModalConfirm}
        title="Discard all unsaved changes"
        content="If you discard changes, you’ll lose any edits you made since you last saved"
        type="warning"
        okText="Discard changes"
        cancelText="Continue editing"
        typeOk="destructive"
        onOk={() => onDiscard()}
        onCancel={() => setIsOpenModalConfirm(false)}
        onClose={() => setIsOpenModalConfirm(false)}
      ></ModalConfirm>

      <ModalConfirm
        open={isOpenModalConfirmDelete}
        title="Remove bundle?"
        content="The bundle will be permanently removed. This can’t be undone. Are you sure?"
        type="warning"
        okText="Delete bundle"
        typeOk="destructive"
        onOk={() => mutationRemove()}
        onCancel={() => setIsOpenModalConfirmDelete(false)}
        onClose={() => setIsOpenModalConfirmDelete(false)}
      ></ModalConfirm>

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
}

export default Form;
