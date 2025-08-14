import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthContext } from "@/features/auth/contexts";
import {
  Box,
  Card,
  Toast,
  InlineStack,
  Button,
  EmptyState,
  Link,
  InlineGrid,
  Text,
  Banner,
  BlockStack,
} from "@shopify/polaris";
import { WrenchIcon } from "@shopify/polaris-icons";
import {
  StyledContainer,
  StyledTableContainer,
  StyledContent,
} from "./styled-components";
import api from "@/features/volume-discounts/api";
import { _queryKey } from "@/constants/react-query";
import {
  Loading,
  ModalConfirm,
  SkeletonTable,
  Container,
} from "@/components/core";
import Table from "@/features/volume-discounts/components/Table";
import Filter from "@/features/volume-discounts/components/Filter";
import ModalUnlock from "@/components/shared/ModalUnlock";
import { clone } from "@/utils/lodash";
import { useCommonContext } from "@/contexts/common";
import qs from "qs";
import _typeReducer from "@/constants/reducer";
import {
  STORAGE_BANNER_OFFER_DISPLAY_PRODUCT_PAGE,
  STORAGE_BANNER_OFFER_ACTIVE,
} from "@/constants/storage";
import { getLocalStorage, setLocalStorage } from "@/utils/storage";
import { useActiveOfferSetting } from "@/hooks";
import { SHOPIFY_THEME_APP_EXTENSION_ID } from "@/config/env";

type Props = {
  onAction: Function;
};

const QuantityBreaksList = ({ onAction }: Props) => {
  const [{ store }]: any = useAuthContext();
  let [
    { loyalty, filtersQuantityBreaks, isEnableAppEmbed },
    dispatchCommon,
  ]: any = useCommonContext();
  let { isEnableProduct } = useActiveOfferSetting();

  const [isLoaded, setIsLoaded]: [boolean, Function] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState({
    open: false,
    data: null,
  });
  const [isLoadingAction, setIsLoadingAction]: [boolean, Function] =
    useState(false);
  const [filtersDefault] = useState(
    clone({ keyword: "", page: 1, status: [] })
  );
  const [hasData, setHasData] = useState(false);
  const [filters, setFilters] = useState({ ...filtersDefault });
  const [totalPublished, setTotalPublished] = useState(0);
  const [dataList, setDataList]: any = useState({ data: [] });
  const [showBannerDisplayProductPage, setShowBannerDisplayProductPage] =
    useState(false);
  const [showBannerActive, setShowBannerActive] = useState(false);

  // Toast
  const [activeToast, setActiveToast] = useState(false);
  const [toast, setToast] = useState({
    content: "",
    error: false,
    duration: 5000,
  });
  const toggleActiveToast = useCallback(
    () => setActiveToast((activeToast) => !activeToast),
    []
  );
  const toastMarkup = activeToast ? (
    <Toast
      content={toast.content}
      error={toast.error}
      onDismiss={toggleActiveToast}
      duration={toast.duration}
    />
  ) : null;

  const isBlockFunc = useMemo(() => {
    if (!loyalty) return false;
    if (loyalty.isComplete) return false;
    return true;
  }, [loyalty]);

  // Get list
  let {
    refetch: refetchList,
    isLoading,
    isFetching,
  } = useQuery(
    [_queryKey.getQuantityBreaksList, filters],
    async () => {
      let params = {
        keyword: filters.keyword,
        status: filters.status.map((item: any) => Number(item)),
        page: filters.page,
      };
      let res = await api.getList(params);
      let { status = false, data = {}, total_publish = 0 } = res;
      setIsLoaded(true);
      if (data && data.data && data.data.length > 0) {
        setHasData(true);
      }
      if (status) {
        setDataList(data);
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
          setDataList((prev: any) => {
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
          content: `Volume discount ${payload.isPublish ? "published" : "Unpublished"}`,
          error: false,
          duration: 5000,
        });
      } else {
        setToast({
          content: message
            ? message
            : `${payload.isPublish ? "Publish" : "Unpublish"} error!`,
          error: true,
          duration: 5000,
        });
      }
      setActiveToast(true);
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
      setToast({ content: `Removed`, error: false, duration: 5000 });
      setHasData(false);
      refetchList();
    } else {
      setToast({ content: `error!`, error: true, duration: 5000 });
    }
    setIsLoadingAction(false);
    setActiveToast(true);
    return res;
  });

  const handlePublish = useCallback(
    (payload: any) => {
      mutationPublish(payload);
    },
    [totalPublished, isBlockFunc]
  );

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
    dispatchCommon({ type: _typeReducer.SET_FILTERS_BUNDLE, payload: filters });
  }, [filters]);

  useEffect(() => {
    if (!getLocalStorage(`${STORAGE_BANNER_OFFER_DISPLAY_PRODUCT_PAGE}`)) {
      setShowBannerDisplayProductPage(true);
    }

    if (!getLocalStorage(`${STORAGE_BANNER_OFFER_ACTIVE}`)) {
      setShowBannerActive(true);
    }
  }, []);

  return (
    <StyledContainer>
      <Card>
        {isLoadingAction && <Loading></Loading>}
        <Box paddingBlockEnd="400">
          <InlineStack gap="200" align="space-between">
            <Text as="h3" variant="headingMd">Offer list</Text>
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
          {isLoaded &&
          hasData &&
          showBannerActive &&
          typeof isEnableAppEmbed == "undefined" &&
          !isEnableAppEmbed ? (
            <div style={{ marginBottom: "16px" }}>
              <Banner
                tone="warning"
                title="M-Sell is not activated"
                onDismiss={() => {
                  setShowBannerActive(false);
                  setLocalStorage(
                    `${STORAGE_BANNER_OFFER_ACTIVE}`,
                    "ms",
                    60 * 24
                  );
                }}
              >
                <BlockStack gap="300">
                  <Text as="p" variant="bodyMd">
                    Please enable the app by clicking the button below and
                    then 'Save' on your theme. Our features will not be
                    shown until you enable.
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
          !isEnableProduct &&
          showBannerDisplayProductPage ? (
            <div style={{ marginBottom: "16px" }}>
              <Banner
                tone="warning"
                title="NOTE:"
                onDismiss={() => {
                  setShowBannerDisplayProductPage(false);
                  setLocalStorage(
                    `${STORAGE_BANNER_OFFER_DISPLAY_PRODUCT_PAGE}`,
                    "ms",
                    60 * 24
                  );
                }}
              >
                <Text variant="bodyMd" as="p">
                  You need to configure the Volume Discounts widget in the{" "}
                  <Link
                    removeUnderline
                    onClick={() =>
                      onAction({type: "customization"})
                    }
                  >
                    Display settings
                  </Link>{" "}
                  to show it on the storefront.
                </Text>
              </Banner>
            </div>
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
                  !dataList || dataList?.data?.length <= 0 ? (
                    <EmptyState
                      heading="No result found"
                      image="/images/table-not-found.png"
                    >
                      <p>
                        Try different keywords, fewer of them, or remove the
                        filters.
                      </p>
                    </EmptyState>
                  ) : (
                    <StyledTableContainer>
                      <Table
                        data={dataList?.data || []}
                        onPublish={(val: any) => handlePublish(val)}
                        onRemove={(val: any) => {
                          setOpenModalConfirm((oldVal: any) => {
                            return { open: true, data: val };
                          });
                        }}
                        onEdit={({ id }: any) =>  onAction({type: "form", id})}
                        pagination={{
                          hasPrevious: filters.page != 1,
                          onPrevious: () => {
                            handlePrevious();
                          },
                          hasNext: filters.page < dataList?.last_page,
                          onNext: () => {
                            handleNext();
                          },
                        }}
                      ></Table>
                    </StyledTableContainer>
                  )
                ) : (
                  <EmptyState
                    heading="Create an volume discount to get started"
                    image="/images/bundle-empty.png"
                    fullWidth
                  >
                    <InlineGrid gap="400">
                      <div
                        style={{ marginLeft: "auto", marginRight: "auto" }}
                      >
                        <Text as="p" variant="bodyMd">
                          Encourage larger purchases by offering
                          quantity-based discounts and <br></br>
                          providing better deals for your customers
                        </Text>
                      </div>
                      <div>
                        <Button
                          variant="primary"
                          onClick={() =>
                            onAction({type: "form"})
                          }
                        >
                          Create now
                        </Button>
                      </div>
                    </InlineGrid>
                  </EmptyState>
                )}
              </>
            )}
          </Card>
        </StyledContent>
      </Card>

      <ModalConfirm
        open={openModalConfirm.open}
        title="Remove Volume discounts?"
        content="The selected Volume discounts will be permanently removed. This can’t be undone. Are you sure?"
        type="warning"
        okText="Delete"
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

export default QuantityBreaksList;
