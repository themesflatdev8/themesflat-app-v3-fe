import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthContext } from "@/features/auth/contexts";
import {
  Page,
  Card,
  Toast,
  Button,
  EmptyState,
  Link,
  InlineGrid,
  Text,
  Banner,
  Box,
  InlineStack,
  List,
  BlockStack,
} from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";
import {
  StyledContainer,
  StyledTableContainer,
  StyledContent,
  StyledInfo,
} from "./styled-components";
import api from "@/features/product-bundles/api";
import { _queryKey } from "@/constants/react-query";
import _typeReducer from "@/constants/reducer";
import {
  Container,
  Loading,
  ModalConfirm,
  SkeletonTable,
} from "@/components/core";
import Table from "@/features/product-bundles/components/Table";
import Filter from "@/features/product-bundles/components/Filter";
import { clone, isEqual } from "@/utils/lodash";
import { isEmpty } from "@/utils/lodash";
import { useCommonContext } from "@/contexts/common";
import {
  STORAGE_BANNER_LOYALTY,
  STORAGE_BUNDLE_BANNER_DISPLAY_PRODUCT_PAGE,
  STORAGE_BUNDLE_BANNER_ACTIVE_CART_PAGE,
  STORAGE_BUNDLE_BANNER_ACTIVE_PRODUCT_PAGE,
} from "@/constants/storage";
import { getLocalStorage, setLocalStorage } from "@/utils/storage";
import qs from "qs";
import { useActiveBundleSetting } from "@/hooks";
import {
  PAGE_TYPE_CART,
  PAGE_TYPE_PRODUCT,
} from "@/features/product-bundles/constants";
import { SHOPIFY_THEME_APP_EXTENSION_ID } from "@/config/env";

type Props = {
  pageType: string;
  onAction: Function;
};

const ProductBundleList = ({ pageType, onAction }: Props) => {
  const [{ store }]: any = useAuthContext();
  let [
    { loyalty, filtersBundle, isEnableAppBlockProductPage, isEnableAppEmbed },
    dispatchCommon,
  ]: any = useCommonContext();
  let { isEnableProduct } = useActiveBundleSetting({ pageType });

  const [isLoaded, setIsLoaded]: [boolean, Function] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState({
    open: false,
    data: null,
  });
  const [isLoadingGenerateAll, setIsLoadingGenerateAll]: [boolean, Function] =
    useState(false);
  const [isLoadingAction, setIsLoadingAction]: [boolean, Function] =
    useState(false);
  const [filtersDefault] = useState(
    clone({ keyword: "", page: 1, bundle_type: [], status: [] })
  );
  const [hasData, setHasData] = useState(false);
  const [progressGenerate, setProgressGenerate] = useState({
    percent: 0,
    content: "",
  });
  const [filters, setFilters] = useState({ ...filtersDefault });
  const [isFiltering, setIsFiltering] = useState(false);
  const [totalPublished, setTotalPublished] = useState(0);
  const [showBannerLoyalty, setShowBannerLoyalty] = useState(false);
  const [showBannerDisplayProductPage, setShowBannerDisplayProductPage] =
    useState(false);
  const [showBannerActiveProductPage, setShowBannerActiveProductPage] =
    useState(false);
  const [showBannerActiveCartPage, setShowBannerActiveCartPage] =
    useState(false);
  const [dataProductBundling, setDataProductBundling]: any = useState({
    data: [],
  });

  // Toast
  const [toast, setToast] = useState({
    active: false,
    content: "",
    error: false,
    duration: 5000,
  });
  const toggleActiveToast = useCallback(
    () => setToast((prev) => ({...prev, active: !prev.active})),
    []
  );
  const toastMarkup = toast.active ? (
    <Toast
      content={toast.content}
      error={toast.error}
      onDismiss={toggleActiveToast}
      duration={toast.duration}
    />
  ) : null;

  const isLoyalty = useMemo(() => {
    return true;
    if (!loyalty) return false;
    if (loyalty.isComplete) return true;
    return false;
  }, [loyalty]);

  // Get list
  let {
    refetch: refetchList,
    isLoading,
    isFetching,
  } = useQuery(
    [_queryKey.getProductBundlingList, filters],
    async () => {
      let params = {
        keyword: filters.keyword,
        bundle_type: filters.bundle_type,
        // cross_option: filters.cross_option,
        // mode: String(filters.mode),
        status: String(filters.status), // filters.status.map((item: any) => Number(item)),
        page: filters.page,
        pageType: pageType,
      };
      let res = await api.getList(params);
      let { status = false, data = {}, total_publish = 0 } = res;
      if (data && data.data && data.data.length > 0) {
        setHasData(true);
      }
      setIsLoaded(true);
      if (status) {
        setDataProductBundling(data);
        setTotalPublished(total_publish);
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
    }
  );

  const { mutate: mutationGenerateAll } = useMutation(async () => {
    setIsLoadingGenerateAll(true);
    setToast({ active: true, content: `Data generating`, error: false, duration: 900000 });
    const res = await api.generateAll();
    let { status = false, data = {} } = res;
    if (status) {
      let number = 10;
      let second = (data.second || 20) / number;
      let count = 0;
      setProgressGenerate({
        percent: 10,
        content: "Data Retrieval",
      });
      let timerProgress = setInterval(() => {
        setProgressGenerate((val) => {
          let percent =
            Number(val.percent) >= 100 ? 100 : Number(val.percent) + 10;
          let content = "Data Retrieval";
          if (percent <= 20) {
            content = "Data Retrieval";
          } else if (percent <= 40) {
            content = "Analysis and Profiling";
          } else if (percent <= 60) {
            content = "Recommendation Generation";
          } else if (percent <= 80) {
            content = "Bundle Creation";
          } else {
            content = "Display and Final Result";
          }
          return {
            percent,
            content,
          };
        });
        if (count >= 9) {
          clearInterval(timerProgress);
          setTimeout(() => {
            setProgressGenerate(() => {
              return {
                percent: 0,
                content: "",
              };
            });
            setToast({
              active: true,
              content: `Data generated successfully`,
              error: false,
              duration: 5000,
            });
          }, 1200);
          refetchList();
          setIsLoadingGenerateAll(false);
        }
        count += 1;
      }, second * 1000);
    }
    return res;
  });

  const { mutate: mutationGenerate } = useMutation(async (payload: any) => {
    // setToast({content: `Regenerating`, error: false})
    // setActiveToast(true)
    const res = await api.generate({ ids: payload.ids });
    let { status = false, message = "" } = res;
    if (status) {
      refetchList();
      setToast({
        active: true,
        content: `Regenerate successfully`,
        error: false,
        duration: 5000,
      });
    } else {
      setToast({
        active: true,
        content: message ? message : `Regenerate error!`,
        error: true,
        duration: 5000,
      });
    }
    payload.cb(res);
    return res;
  });

  const { mutate: mutationPublish, isLoading: isLoadingPublish } = useMutation(
    async (payload: any) => {
      const res = await api.publish({
        ids: payload.ids,
        isPublish: payload.isPublish,
        type: payload.ids.length <= 0 ? "all" : "",
      });
      let { status = false, data = {}, message = "" } = res;
      if (status) {
        if (payload.ids.length >= 0) {
          setDataProductBundling((prev: any) => {
            let newVal: any = clone(prev);
            payload.ids.map((item: any) => {
              let index = newVal.data?.findIndex((i: any) => i.id === item);
              newVal.data[index].status = payload.isPublish;
            });
            return newVal;
          });
        } else {
          refetchList();
        }
        setToast({
          active: true,
          content: `Bundle ${payload.isPublish ? "published" : "Unpublished"}`,
          error: false,
          duration: 5000,
        });
      } else {
        setToast({
          active: true,
          content: message
            ? message
            : `${payload.isPublish ? "Publish" : "Unpublish"} error!`,
          error: true,
          duration: 5000,
        });
      }
      payload.cb(res);
      return res;
    }
  );

  const { mutate: mutationRemove } = useMutation(async (payload: any) => {
    setIsLoadingAction(true);
    setOpenModalConfirm((val: any) => {
      return { ...val, open: false, data: null };
    });
    const res = await api.remove({
      ids: payload.ids,
      is_all: payload.ids.length <= 0 ? true : false,
    });
    let { status = false, data = {}, message = "" } = res;
    if (status) {
      setToast({ active: true, content: `Removed`, error: false, duration: 5000 });
      setHasData(false);
      refetchList();
    } else {
      setToast({ active: true, content: `error!`, error: true, duration: 5000 });
    }
    setIsLoadingAction(false);
    return res;
  });

  const handlePublish = useCallback(
    (payload: any) => {
      // if(!isLoyalty && payload.isPublish){
      //   if((totalPublished + payload.ids.length) > 10){
      //     payload.cb()
      //     setIsShowBannerLimit(true)
      //     return
      //   }
      // }

      mutationPublish(payload);
    },
    [totalPublished, isLoyalty]
  );

  const handleGenerate = useCallback((payload: any) => {
    if (payload.ids.length <= 0) {
      mutationGenerateAll();
    } else {
      mutationGenerate(payload);
    }
  }, []);

  const handlePrevious = useCallback(
    () => setFilters({ ...filters, page: filters.page - 1 }),
    [filters]
  );

  const handleNext = useCallback(
    () => setFilters({ ...filters, page: filters.page + 1 }),
    [filters]
  );

  const openUrl = useCallback((path: string) => {
    window.open(`shopify://admin${path}`, "_blank");
  }, []);

  useEffect(() => {
    if (isEqual(filters, filtersDefault)) {
      setIsFiltering(false);
    } else {
      setIsFiltering(true);
    }
    dispatchCommon({ type: _typeReducer.SET_FILTERS_BUNDLE, payload: filters });
  }, [filters]);

  useEffect(() => {
    if (!getLocalStorage(`${STORAGE_BANNER_LOYALTY}`)) {
      setShowBannerLoyalty(true);
    }
    if (!getLocalStorage(`${STORAGE_BUNDLE_BANNER_DISPLAY_PRODUCT_PAGE}`)) {
      setShowBannerDisplayProductPage(true);
    }
    if (!getLocalStorage(`${STORAGE_BUNDLE_BANNER_ACTIVE_CART_PAGE}`)) {
      setShowBannerActiveCartPage(true);
    }
    if (!getLocalStorage(`${STORAGE_BUNDLE_BANNER_ACTIVE_PRODUCT_PAGE}`)) {
      setShowBannerActiveProductPage(true);
    }
  }, []);

  return (
    <StyledContainer>
      <Card>
        {isLoadingAction && <Loading></Loading>}
        <Box paddingBlockEnd="400">
          <InlineStack gap="200" align="space-between">
            <Text as="h3" variant="headingMd">Bundle list</Text>
            {hasData ? (
              <Button
                variant="primary"
                onClick={() =>
                  onAction({type: "form"})
                }
              >
                Create new
              </Button>
            ) : null}
          </InlineStack>
        </Box>
        <StyledContent>
          {hasData ? (
            <>
              {isLoaded &&
              hasData &&
              showBannerActiveCartPage &&
              typeof isEnableAppEmbed != "undefined" &&
              !isEnableAppEmbed &&
              [PAGE_TYPE_CART].includes(pageType) ? (
                <div style={{ marginBottom: "16px" }}>
                  <Banner
                    tone="warning"
                    title="M-Sell is not activated"
                    onDismiss={() => {
                      setShowBannerActiveCartPage(false);
                      setLocalStorage(
                        `${STORAGE_BUNDLE_BANNER_ACTIVE_CART_PAGE}`,
                        "ms",
                        60 * 24
                      );
                    }}
                  >
                    <BlockStack gap="300">
                      <Text as="p" variant="bodyMd">
                        Please enable the app by clicking the button below
                        and then Save on your theme. Our features will not
                        be shown until you enable.
                      </Text>
                      <div>
                        <Button
                          onClick={() =>
                            openUrl(
                              `/themes/current/editor?context=apps&activateAppId=${SHOPIFY_THEME_APP_EXTENSION_ID}/app-embed`
                            )
                          }
                        >
                          Active
                        </Button>
                      </div>
                    </BlockStack>
                  </Banner>
                </div>
              ) : null}

              {isLoaded &&
              hasData &&
              showBannerActiveProductPage &&
              typeof isEnableAppBlockProductPage != "undefined" &&
              !isEnableAppBlockProductPage &&
              [PAGE_TYPE_PRODUCT].includes(pageType) ? (
                <div style={{ marginBottom: "16px" }}>
                  <Banner
                    tone="warning"
                    title="M-Sell Bundles is not added"
                    onDismiss={() => {
                      setShowBannerActiveProductPage(false);
                      setLocalStorage(
                        `${STORAGE_BUNDLE_BANNER_ACTIVE_PRODUCT_PAGE}`,
                        "ms",
                        60 * 24
                      );
                    }}
                  >
                    <BlockStack gap="300">
                      <Text as="p" variant="bodyMd">
                        Please add block section the app by clicking the
                        button below and then Save on your theme. Our
                        features will not be shown until you enable.
                      </Text>
                      <div>
                        <Button
                          onClick={() =>
                            openUrl(
                              `/themes/current/editor?template=product&addAppBlockId=${SHOPIFY_THEME_APP_EXTENSION_ID}/bundle&target=mainSection`
                            )
                          }
                        >
                          Active
                        </Button>
                      </div>
                    </BlockStack>
                  </Banner>
                </div>
              ) : null}

              {isLoaded &&
              hasData &&
              showBannerDisplayProductPage &&
              [PAGE_TYPE_PRODUCT].includes(pageType) ? (
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
                      {!isEnableProduct && pageType == PAGE_TYPE_PRODUCT ? (
                        <List.Item>
                          You need to configure the Bundle widget in the{" "}
                          <Link
                            removeUnderline
                            onClick={() =>
                              onAction({type: "customization"})
                            }
                          >
                            Display settings
                          </Link>{" "}
                          to show it on the storefront.
                        </List.Item>
                      ) : null}
                      <List.Item>
                        If a main product is included in multiple bundles,
                        the bundle created most recently will be displayed
                        on the page.
                      </List.Item>
                    </List>
                  </Banner>
                </div>
              ) : null}
            </>
          ) : null}
          <Card padding="0">
            {hasData && (
              <>
                <div
                  className={
                    isLoading || isFetching ? "animation--skeleton" : ""
                  }
                >
                  <Filter
                    filters={filters}
                    setFilters={setFilters}
                  ></Filter>
                </div>
              </>
            )}
            {isLoading || isFetching ? (
              <SkeletonTable lines={10}></SkeletonTable>
            ) : (
              <>
                {hasData ? (
                  !dataProductBundling ||
                  dataProductBundling?.data?.length <= 0 ? (
                    <EmptyState
                      heading="No bundle found"
                      image="/icons/search.png"
                    >
                      <p>
                        Try different keywords, fewer of them, or remove the
                        filters.
                      </p>
                    </EmptyState>
                  ) : (
                    <StyledTableContainer>
                      <Table
                        data={dataProductBundling?.data || []}
                        onPublish={(val: any) => handlePublish(val)}
                        onRemove={(val: any) => {
                          setOpenModalConfirm((oldVal: any) => {
                            return { open: true, data: val };
                          });
                        }}
                        onRegenerate={(val: any) => {
                          setOpenModalConfirm((oldVal: any) => {
                            return { open: true, data: val };
                          });
                        }}
                        onEdit={(id: any) =>
                          onAction({type: "form", id})
                        }
                        pagination={{
                          hasPrevious: filters.page != 1,
                          onPrevious: () => {
                            handlePrevious();
                          },
                          hasNext:
                            filters.page < dataProductBundling?.last_page,
                          onNext: () => {
                            handleNext();
                          },
                        }}
                      ></Table>
                    </StyledTableContainer>
                  )
                ) : null}
              </>
            )}
          </Card>
          {!hasData && !isLoading && !isFetching ? (
            <Card>
              <Box paddingBlock="1200">
                <EmptyState
                  heading="Ready to bundle up? Let’s start crafting deals your customers can’t resist."
                  image="/images/bundle-empty.png"
                  fullWidth
                >
                  <InlineGrid gap="400">
                    <div
                      style={{ marginLeft: "auto", marginRight: "auto" }}
                    >
                      <Text as="p" variant="bodyMd" tone="subdued">
                        Group your products into irresistible bundles and
                        watch your customers shout, “Take my money!”
                      </Text>
                    </div>
                    <div>
                      <Button
                        variant="primary"
                        onClick={() =>
                          onAction({type: "form"})
                        }
                      >
                        Create Your Bundle
                      </Button>
                    </div>
                  </InlineGrid>
                </EmptyState>
              </Box>
            </Card>
          ) : null}
        </StyledContent>
      </Card>

      <ModalConfirm
        open={openModalConfirm.open}
        title="Remove selected bundles?"
        content="The selected bundles will be permanently removed. This can’t be undone. Are you sure?"
        type="warning"
        okText="Delete bundles"
        typeOk="destructive"
        onOk={() => mutationRemove(openModalConfirm.data)}
        onCancel={() =>
          setOpenModalConfirm((val: any) => {
            return { ...val, open: false };
          })
        }
        onClose={() =>
          setOpenModalConfirm((val: any) => {
            return { ...val, open: false };
          })
        }
      ></ModalConfirm>
  
      {toastMarkup}
    </StyledContainer>
  );
};

export default ProductBundleList;
