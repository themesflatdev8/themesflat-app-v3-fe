import { useState, useCallback, useMemo, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Page,
  Toast,
  Banner,
  Card,
  TextField,
  Text,
  Link,
  InlineStack,
  Badge,
  Button,
  Box,
  List,
  BlockStack,
  useBreakpoints,
  Layout,
  Select,
  ButtonGroup,
  RadioButton,
  Icon,
} from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import { Container, ModalConfirm, Loading, SaveBar } from "@/components/core";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  StyledContainer,
  StyledContainerInner,
  StyledContent,
} from "./styled-components";
import ComplementaryProducts from "@/features/product-bundles/components/ComplementaryProducts";
import MainResource from "@/features/product-bundles/components/MainResource";
import Discount from "@/features/product-bundles/components/Discount";
import ModalRequireExtension from "@/components/shared/ModalRequireExtension";
import api from "@/features/product-bundles/api";
import { clone } from "@/utils/lodash";
import { _queryKey } from "@/constants/react-query";
import {
  _formDefault,
  TYPE_SPECIFIC,
  TYPE_COLLECTION,
  STRATEGY_AI,
  STRATEGY_MANUAL_PICK,
  PAGE_TYPE_CART,
  PAGE_TYPE_PRODUCT,
} from "@/features/product-bundles/constants";
import _typeReducer from "@/constants/reducer";
import { useAuthContext } from "@/features/auth/contexts";
import { useCommonContext } from "@/contexts/common";
import { getOnlyNumeric, formatOutputPrice } from "@/utils/money";
import {
  STORAGE_BUNDLE_BANNER_DISPLAY_CART_PAGE,
  STORAGE_BUNDLE_BANNER_DISPLAY_PRODUCT_PAGE,
} from "@/constants/storage";
import { getLocalStorage, setLocalStorage } from "@/utils/storage";
import { useActiveBundleSetting } from "@/hooks";
import ModalPreview from "@/features/bundle-customization/components/ModalPreview";

type Props = {
  pageType: string;
  formId: string;
  onAction: Function;
};

interface IFormInput {
  name: string;
  status: number | boolean;
  type: string;
  list_default_ids: any;
  mode: string;
  list_commendations: any;
  maxProduct: number;
  selectable: number;
  useDiscount: number | boolean;
  minimumAmount: string | number;
  promotionType: string;
  discountContent: string;
  discountType: string;
  discountValue: string | number;
  discountOncePer: number | boolean;
  discountFreeshipType: string;
  discountFreeshipContent: string;
  discountFreeshipValue: string | number;
  countdownTimerActive: number | boolean;
  countdownTimerValue: string | number;
  countdownTimerSession: string | number;
  countdownTimerReaches: string | number;
  templateDesktop: string;
  templateMobile: string;
}

const schema = yup
  .object()
  .shape({
    name: yup.string().trim().required("This field is required."),
    use_discount: yup.boolean(),
    minimumAmount: yup
      .string()
      .test(
        "required",
        "This field is required.",
        (value: any, context: any) => {
          let parent = context.parent;
          if (parent.useDiscount) {
            if (!value) return false;
          }
          return true;
        }
      )
      .test(
        "min",
        "Please enter a value greater than 0.",
        (value: any, context: any) => {
          let parent = context.parent;
          if (parent.useDiscount) {
            if (!value) return false;
            let val = Number(getOnlyNumeric(`${value}`));
            return val <= 0 ? false : true;
          }
          return true;
        }
      )
      .test(
        "max",
        "Please enter a valid number.",
        (value: any, context: any) => {
          let parent = context.parent;
          if (parent.useDiscount) {
            if (!value) return false;
            if (!`${value}`.replace(/[^\d]/g, "").match(/^[0-9.]{1,15}$/)) {
              return false;
            }
          }
          return true;
        }
      ),
    type: yup.string().required("This field is required."),
    discountValue: yup
      .string()
      .test(
        "required",
        "This field is required.",
        (value: any, context: any) => {
          let parent = context.parent;
          if (
            parent.use_discount &&
            (parent.promotion_type == "discount" ||
              parent.promotion_type == "gift")
          ) {
            if (!value) return false;
          }
          return true;
        }
      )
      .test(
        "min-percent",
        "Please enter a value between 0 and 100.",
        (value: any, context: any) => {
          let parent = context.parent;
          if (
            parent.useDiscount &&
            parent.promotion_type == "discount" &&
            parent.type == "percent"
          ) {
            if (!value) return false;
            let val = Number(getOnlyNumeric(`${value}`));
            return val <= 0 || val > 100 ? false : true;
          }
          return true;
        }
      )
      .test(
        "min-amount",
        "Please enter a value greater than 0.",
        (value: any, context: any) => {
          let parent = context.parent;
          if (
            parent.useDiscount &&
            parent.promotion_type == "discount" &&
            parent.type == "amount"
          ) {
            if (!value) return false;
            let val = Number(getOnlyNumeric(`${value}`));
            return val <= 0 ? false : true;
          }
          return true;
        }
      )
      .test(
        "max",
        "Please enter a valid number.",
        (value: any, context: any) => {
          let parent = context.parent;
          if (
            parent.useDiscount &&
            parent.promotion_type == "discount" &&
            parent.type == "amount"
          ) {
            if (!value) return false;
            if (!`${value}`.replace(/[^\d]/g, "").match(/^[0-9.]{1,15}$/)) {
              return false;
            }
          }
          return true;
        }
      ),
    list_commendations: yup.array().when(["mode"], ([mode], schema) => {
      if (mode == STRATEGY_MANUAL_PICK)
        return schema.test(
          "required",
          "Please select a product",
          (value: any, context: any) => {
            if (!value || !value.length) return false;
            return true;
          }
        );
      return schema;
    }),
    list_default_ids: yup.array().when(["type"], ([type], schema) => {
      if (type == TYPE_SPECIFIC) {
        return schema.test(
          "required",
          "Please select at least a main product",
          (value: any, context: any) => {
            if (!value || !value.length) return false;
            return true;
          }
        );
      } else if (type == TYPE_COLLECTION) {
        return schema.test(
          "required",
          "'Please select at least a collection",
          (value: any, context: any) => {
            if (!value || !value.length) return false;
            return true;
          }
        );
      }
      return schema;
    }),
    discountContent: yup
      .string()
      .when(["promotionType"], ([promotionType], schema) => {
        if (promotionType == "discount") {
          return schema.test(
            "required",
            "This field is required.",
            (value: any, context: any) => {
              if (!value || !value?.trim()) return false;
              return true;
            }
          );
        }
        return schema;
      }),
    discountFreeshipContent: yup
      .string()
      .when(["promotionType"], ([promotionType], schema) => {
        if (promotionType == "freeship") {
          return schema.test(
            "required",
            "This field is required.",
            (value: any, context: any) => {
              if (!value || !value?.trim()) return false;
              return true;
            }
          );
        }
        return schema;
      }),
  })
  .required();

function Form({ pageType, formId, onAction }: Props) {
  const [{ store }]: any = useAuthContext();
  let [{ loyalty, bundleSetting }]: any = useCommonContext();
  let { isEnableCart, isEnableProduct } = useActiveBundleSetting({ pageType });
  const { smUp } = useBreakpoints();

  const [mainData, setMainData] = useState([]);
  const [recommendedProductsTemp, setRecommendedProductsTemp] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorsServer, setErrorsServer]: any = useState({});
  const [formClone, setFormClone] = useState(clone(_formDefault));
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false);
  const [isOpenModalConfirmDelete, setIsOpenModalConfirmDelete] =
    useState(false);
  const [modalRequireExtension, setModalRequireExtension] = useState(false);
  const [showBannerDisplayCartPage, setShowBannerDisplayCartPage] =
    useState(false);
  const [showBannerDisplayProductPage, setShowBannerDisplayProductPage] =
    useState(false);
  const [isOpenModalPreview, setIsOpenModalPreview] = useState(false);
  const [isEdit, setIsEdit] = useState(formId || pageType == PAGE_TYPE_CART ? true : false);
  const [isShowDiscount, setIsShowDiscount] = useState(false);

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
    let discountType = form.discountType ?? _formDefault.discountType;
    return {
      name: form.name ?? _formDefault.name,
      status: form.status ?? _formDefault.status,
      type: form.type ?? _formDefault.type,
      list_default_ids: form.list_default_ids ?? _formDefault.list_default_ids,
      mode: form.mode ?? _formDefault.mode,
      list_commendations:
        form.list_commendations ?? _formDefault.list_commendations,
      maxProduct: form.maxProduct ?? _formDefault.maxProduct,
      selectable: form.selectable ?? _formDefault.selectable,
      useDiscount: form.useDiscount ?? _formDefault.useDiscount,
      minimumAmount: formatOutputPrice(
        form.minimumAmount ?? _formDefault.minimumAmount
      ),
      promotionType: form.promotionType ?? _formDefault.promotionType,
      discountType,
      discountValue:
        discountType == "percent"
          ? (form.discountValue ?? _formDefault.discountValue)
          : formatOutputPrice(form.discountValue ?? _formDefault.discountValue),
      discountContent: form.discountContent ?? _formDefault.discountContent,
      discountOncePer: form.discountOncePer ?? _formDefault.discountOncePer,
      discountFreeshipType:
        form.discountFreeshipType ?? _formDefault.discountFreeshipType,
      discountFreeshipValue:
        form.discountFreeshipValue ?? _formDefault.discountFreeshipValue,
      discountFreeshipContent:
        form.discountFreeshipContent ?? _formDefault.discountFreeshipContent,
      countdownTimerActive:
        form.countdownTimerActive ?? _formDefault.countdownTimerActive,
      countdownTimerValue:
        form.countdownTimerValue ?? _formDefault.countdownTimerValue,
      countdownTimerSession:
        form.countdownTimerSession ?? _formDefault.countdownTimerSession,
      countdownTimerReaches:
        form.countdownTimerReaches ?? _formDefault.countdownTimerReaches,
      templateDesktop: form.templateDesktop ?? _formDefault.templateDesktop,
      templateMobile: form.templateMobile ?? _formDefault.templateMobile,
    };
  };

  const handleData = (data: any) => {
    let productCommendations = data.list_commendations?.map(
      (item: any, index: number) => {
        return {
          id: item.id,
          title: item.title,
          image: item.image,
          handle: item.handle,
          price: item.price,
          status: item.status,
          inventory_management: item.inventory_management,
          stock: item.stock,
          chosen: false,
          selected: false,
        };
      }
    );
    let objNew: any = {
      ...data,
      list_commendations: ![STRATEGY_AI].includes(data.mode)
        ? productCommendations || []
        : [],
    };
    reset(getForm(objNew));
    setRecommendedProductsTemp(() =>
      productCommendations ? clone(productCommendations) : []
    );
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
    setError,
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

  const isShowBundleName = useMemo(() => {
    return pageType == PAGE_TYPE_PRODUCT;
  }, [pageType]);

  const isShowMainProduct = useMemo(() => {
    return pageType == PAGE_TYPE_PRODUCT;
  }, [pageType]);

  let { data: dataDetail } = useQuery(
    [_queryKey.getProductBundling, { id: formId, pageType }],
    async () => {
      let res = await api.getDetail(formId || 0, { pageType });
      let { status = false, data = null } = res;
      setIsLoaded(true);
      if (status && data) {
        setMainData(
          clone(
            data.type == TYPE_COLLECTION
              ? data.list_default_collections || []
              : data.list_default_products || []
          )
        );
        handleData(clone(data));
        return data;
      }
      return res;
    },
    {
      cacheTime: 0,
      staleTime: 0,
      enabled: formId || pageType == PAGE_TYPE_CART ? true : false,
    }
  );

  const { mutate: mutationForm, isLoading: isLoadingSave } = useMutation(
    async (form: any) => {
      let arrProductCommendations = [];
      if (form.type != TYPE_COLLECTION && [STRATEGY_AI].includes(form.mode)) {
        let mainIds = form.list_default_ids || [];
        arrProductCommendations = mainIds?.length
          ? recommendedProductsTemp.filter((item: any) => {
              return !mainIds.some((id: any) => id == item.id);
            })
          : recommendedProductsTemp;
      } else {
        arrProductCommendations = form.list_commendations;
      }
      let obj: any = {
        ...form,
        minimumAmount: getOnlyNumeric(form.minimumAmount),
        discountValue: getOnlyNumeric(form.discountValue),
        list_commendations: arrProductCommendations.map((item: any) => {
          return { id: item.id };
        }),
        pageType,
      };
      let res = null;
      if (isEdit) {
        res = await api.update({ id: formId || 0, form: { ...obj, id: formId } });
      } else {
        res = await api.create(obj);
      }
      let { status = false, data, message = "", errors = null } = res;
      if (status) {
        shopify.saveBar.hide("my-save-bar");
        if (isEdit) {
          setToast({ content: "Saved", error: false });
          handleData(form);
          setActiveToast(true);
        } else {
          setIsEdit(true);
          setToast({ content: "Bundle created", error: false });
          data && handleData(clone(data));
          setActiveToast(true);
        }
      } else {
        if (errors) {
          setErrorsServer(() => errors);
        } else {
          setToast({
            content: message ? message : "Server error!",
            error: true,
          });
          setActiveToast(true);
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
        setToast({ content: `Server error!`, error: true });
      }
      setActiveToast(true);
      return res;
    }
  );

  const onDiscard = useCallback(() => {
    setMainData(
      clone(
        dataDetail?.type == TYPE_COLLECTION
          ? dataDetail?.list_default_collections || []
          : dataDetail?.list_default_products || []
      )
    );
    reset(getForm(formClone));
    if (dataDetail) {
      let productCommendations = dataDetail.list_commendations?.map(
        (item: any, index: number) => {
          return {
            id: item.id,
            title: item.title,
            image: item.image,
            handle: item.handle,
            price: item.price,
            status: item.status,
            inventory_management: item.inventory_management,
            stock: item.stock,
            chosen: false,
            selected: false,
          };
        }
      );
      setRecommendedProductsTemp(() => clone(productCommendations || []));
    } else {
      setRecommendedProductsTemp(() =>
        clone(formClone.list_commendations || [])
      );
    }
    setIsOpenModalConfirm(false);
    shopify.saveBar.hide("my-save-bar");
  }, [formClone, dataDetail]);

  const optionsTemplate = useMemo(() => {
    if (!bundleSetting) return [];
    return [
      { label: bundleSetting.settings?.themeOne?.themeName, value: "1" },
      { label: bundleSetting.settings?.themeTwo?.themeName, value: "2" },
      { label: bundleSetting.settings?.themeThree?.themeName, value: "3" },
    ];
  }, [bundleSetting]);

  useEffect(() => {
    if (
      watch("mode") == STRATEGY_MANUAL_PICK
    ) {
      setIsShowDiscount(true);
    } else {
      setIsShowDiscount(false);
      setValue("useDiscount", false);
    }
  }, [watch("mode")]);

  useEffect(() => {
    if (!getLocalStorage(`${STORAGE_BUNDLE_BANNER_DISPLAY_CART_PAGE}`)) {
      setShowBannerDisplayCartPage(true);
    }

    if (!getLocalStorage(`${STORAGE_BUNDLE_BANNER_DISPLAY_PRODUCT_PAGE}`)) {
      setShowBannerDisplayProductPage(true);
    }

    if (!formId) {
      handleData({ ..._formDefault });
      setIsLoaded(true);
    }
  }, []);

  return (
    <StyledContainer>
      {!isLoaded ? (
        <Loading></Loading>
      ) : (
        <Card>
          <Box paddingBlockEnd="400">
            <InlineStack gap="200">
              { pageType == PAGE_TYPE_PRODUCT ? (
                <span 
                  style={{cursor: "pointer"}}
                  onClick={() => {
                    shopify.saveBar.hide("my-save-bar");
                    onAction({ type: "list" });
                  }}
                >
                  <Icon source={ArrowLeftIcon}></Icon>
                </span>
              ) : null }
              <Text as="h3" variant="headingMd">{
                pageType != PAGE_TYPE_PRODUCT
                  ? "Bundle settings"
                  : !isEdit
                    ? "Build Your Perfect Bundle"
                    : "Edit Your Bundle"
              }</Text>
            </InlineStack>
          </Box>
          <StyledContainerInner>
            <StyledContent>
              {pageType == PAGE_TYPE_CART &&
              !isEnableCart &&
              showBannerDisplayCartPage ? (
                <div style={{ marginBottom: "16px" }}>
                  <Banner
                    tone="warning"
                    title="NOTE:"
                    onDismiss={() => {
                      setShowBannerDisplayCartPage(false);
                      setLocalStorage(
                        `${STORAGE_BUNDLE_BANNER_DISPLAY_CART_PAGE}`,
                        "ms",
                        60 * 24
                      );
                    }}
                  >
                    <Text variant="bodyMd" as="p">
                      You need to configure the Bundle widget in the{" "}
                      <Link
                        removeUnderline
                        onClick={() => {
                          shopify.saveBar.hide("my-save-bar");
                          onAction({type: "customization"})
                        }}
                      >
                        Display settings
                      </Link>{" "}
                      to show it on the storefront.
                    </Text>
                  </Banner>
                </div>
              ) : null}

              {[PAGE_TYPE_PRODUCT].includes(pageType) &&
              showBannerDisplayProductPage ? (
                <div style={{ marginBottom: "16px" }}>
                  <Banner
                    tone="warning"
                    title="NOTE:"
                    onDismiss={() => {
                      setShowBannerDisplayProductPage(false);
                      setLocalStorage(
                        `${STORAGE_BUNDLE_BANNER_DISPLAY_PRODUCT_PAGE}`,
                        "ms",
                        60 * 24
                      );
                    }}
                  >
                    <List type="bullet">
                      {!isEnableProduct ? (
                        <List.Item>
                          You need to add the app block and activate it to
                          display the widget on the storefront.{" "}
                          <Link
                            monochrome
                            onClick={() => {
                              shopify.saveBar.hide("my-save-bar");
                              onAction({type: "customization"})
                            }}
                          >
                            Go to setup
                          </Link>
                        </List.Item>
                      ) : null}
                      <List.Item>
                        If a main product is included in multiple bundles, the
                        bundle created most recently will be displayed on the
                        page.
                      </List.Item>
                      <List.Item>
                        Some product may not be visible on the storefront
                        because they are either out of stock or not currently
                        active.
                      </List.Item>
                    </List>
                  </Banner>
                </div>
              ) : null}

              <div>
                <Layout>
                  <Layout.Section>
                    <BlockStack gap="400">
                      {isShowBundleName ? (
                        <Card>
                          <BlockStack gap="300">
                            <BlockStack gap="100">
                              <Text
                                as="span"
                                variant="bodyMd"
                                fontWeight="semibold"
                              >
                                Bundle information
                              </Text>
                            </BlockStack>
                            <Controller
                              name="name"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <TextField
                                  label="Bundle Name"
                                  value={value}
                                  placeholder={`Enter bundle name`}
                                  onChange={onChange}
                                  autoComplete="off"
                                  error={
                                    errorsServer?.name ||
                                    errors?.name?.message
                                  }
                                ></TextField>
                              )}
                            />
                          </BlockStack>
                        </Card>
                      ) : null}

                      {isShowMainProduct ? (
                        <MainResource
                          errors={errors}
                          control={control}
                          watch={watch}
                          setValue={setValue}
                          clearErrors={clearErrors}
                          mainData={mainData}
                          setMainData={setMainData}
                          recommendedProductsTemp={recommendedProductsTemp}
                          setRecommendedProductsTemp={
                            setRecommendedProductsTemp
                          }
                        />
                      ) : null}

                      <ComplementaryProducts
                        errors={errors}
                        control={control}
                        watch={watch}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        mainData={mainData}
                        recommendedProductsTemp={recommendedProductsTemp}
                        setRecommendedProductsTemp={
                          setRecommendedProductsTemp
                        }
                        pageType={pageType}
                      />

                      <Card padding="400">
                        <BlockStack gap="300">
                          <Text
                            variant="bodyMd"
                            as="h3"
                            fontWeight="semibold"
                          >
                            Selectable bundle option
                          </Text>
                          <Controller
                            name="selectable"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <BlockStack gap="200">
                                <RadioButton
                                  label="Pre-select all products in the bundle"
                                  checked={value == 1}
                                  id="selectable-1"
                                  name="selectable"
                                  onChange={() => onChange(1)}
                                />
                                <RadioButton
                                  label="Un-select all products in the bundle"
                                  id="selectable-2"
                                  name="selectable"
                                  checked={value == 2}
                                  onChange={() => onChange(2)}
                                />
                                <RadioButton
                                  label="Requiring visitors to buy entire bundle"
                                  id="selectable-3"
                                  name="selectable"
                                  checked={value == 3}
                                  onChange={() => onChange(3)}
                                />
                              </BlockStack>
                            )}
                          />
                        </BlockStack>
                      </Card>

                      {isShowDiscount ? (
                        <Discount
                          errors={errors}
                          errorsServer={errorsServer}
                          control={control}
                          watch={watch}
                          setValue={setValue}
                          clearErrors={clearErrors}
                        />
                      ) : null}
                    </BlockStack>
                  </Layout.Section>
                  <Layout.Section variant="oneThird">
                    <BlockStack gap="400">
                      <Card>
                        <BlockStack gap="100">
                          <Text
                            as="span"
                            variant="bodyMd"
                            fontWeight="semibold"
                          >
                            Status
                          </Text>
                          <Controller
                            name="status"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Select
                                label="Status"
                                labelHidden
                                value={`${value}`}
                                options={[
                                  { label: "Active", value: "1" },
                                  { label: "Draft", value: "0" },
                                ]}
                                onChange={(val) => onChange(Number(val))}
                              ></Select>
                            )}
                          />
                        </BlockStack>
                      </Card>
                      <Card>
                        <BlockStack gap="400">
                          <InlineStack gap="200" align="space-between">
                            <Text
                              as="span"
                              variant="bodyMd"
                              fontWeight="semibold"
                            >
                              Choose template
                            </Text>
                            <Button
                              variant="plain"
                              onClick={() => setIsOpenModalPreview(true)}
                            >
                              Preview
                            </Button>
                          </InlineStack>
                          <Controller
                            name="templateDesktop"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Select
                                label="On Desktop"
                                value={`${value}`}
                                options={optionsTemplate}
                                onChange={onChange}
                              ></Select>
                            )}
                          />
                          <Controller
                            name="templateMobile"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Select
                                label="On Mobile"
                                value={`${value}`}
                                options={optionsTemplate}
                                onChange={onChange}
                              ></Select>
                            )}
                          />
                        </BlockStack>
                      </Card>
                    </BlockStack>
                  </Layout.Section>
                </Layout>
                <Box paddingBlockStart="400">
                  <InlineStack gap="200" align="end" wrap={false}>
                    <ButtonGroup>
                      {isEdit && ![PAGE_TYPE_CART].includes(pageType) ? (
                        <Button
                          variant="primary"
                          tone="critical"
                          loading={isLoadingRemove}
                          onClick={() => setIsOpenModalConfirmDelete(true)}
                        >
                          Delete bundle
                        </Button>
                      ) : null}
                      <Button
                        variant="primary"
                        disabled={!(isDirty)}
                        loading={isLoadingSave}
                        onClick={handleSubmit(onSubmit)}
                      >
                        Save
                      </Button>
                    </ButtonGroup>
                  </InlineStack>
                </Box>
              </div>
            </StyledContent>
          </StyledContainerInner>
        </Card>
      )}

      <ModalPreview
        open={isOpenModalPreview}
        onClose={() => setIsOpenModalPreview(false)}
        data={bundleSetting?.settings}
      ></ModalPreview>

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
