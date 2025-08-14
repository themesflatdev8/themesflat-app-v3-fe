import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/features/auth/contexts";
import { useTranslation } from "react-i18next";
import {
  Button,
  OptionList,
  Scrollable,
  Filters,
  EmptyState,
  Text,
} from "@shopify/polaris";
import { SmileySadIcon } from "@shopify/polaris-icons";
import { Modal, Image, Loading } from "@/components/core";
import {
  StyledModalContent,
  StyledFilter,
  LabelContainer,
  ImgResource,
  StyledEmptyData,
  StyledList,
  StyledModalFooter,
} from "./styled-components";
import api from "@/features/volume-discounts/api";
import { _queryKey } from "@/constants/react-query";

type Props = {
  selected: any;
  open: boolean;
  onAdd: Function;
  onClose: Function;
  idsExclude?: any;
  isMulti?: boolean;
  title?: string;
  keyword?: string;
};

let timerLoad: any = null;

const ModalAddProduct = ({
  selected,
  open,
  onClose,
  onAdd,
  idsExclude,
  isMulti = true,
  title,
  keyword = "",
}: Props) => {
  const [{ store }]: any = useAuthContext();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoaded, setIsFirstLoaded] = useState(false);
  const [isLoadingScroll, setIsLoadingScroll] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [idsSelected, setIdsSelected] = useState([]);
  const [listSelected, setListSelected] = useState([]);
  const [queryValue, setQueryValue]: any = useState(keyword ?? "");
  const [filters, setFilters]: any = useState({
    keyword: keyword ?? "",
    page: 1,
  });
  const [data, setData]: any = useState({ data: [], last_page: 1, total: 0 });
  const [hasData, setHasData] = useState(false);

  useQuery(
    [_queryKey.getProductList, filters],
    async () => {
      console.log("filters", filters);
      try {
        let res = await api.getProductList(filters);
        return res;
      } catch (e) {
        console.log(e);
      }
    },
    {
      onSuccess: (res) => {
        let { status = false, data: dataRes } = res;
        if (status) {
          if (keyword || (dataRes && dataRes.data && dataRes.data.length)) {
            setHasData(true);
          }
          setData((val: any) => {
            return {
              ...dataRes,
              data:
                filters.page <= 1
                  ? dataRes.data
                  : [...val.data, ...dataRes.data],
            };
          });
        }
        setIsLoading(false);
        setIsLoadingScroll(false);
        setIsFirstLoaded(true);
      },
    }
  );

  const options = useMemo(() => {
    const arr: any = [];
    data.data &&
      data.data.forEach((rs: any, index: number) => {
        arr.push({
          key: rs.id,
          label: (
            <LabelContainer>
              <ImgResource hasBorder={rs.image ? true : false}>
                <Image
                  alt=""
                  width="40"
                  height="40"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  src={rs.image ? rs.image : "/images/no-img.png"}
                />
              </ImgResource>
              <span>{rs.title}</span>
            </LabelContainer>
          ),
          value: rs.id,
          title: rs.title,
          id: rs.id,
          image: rs.image,
          type: rs.type,
          status: rs.status,
          inventory_management: rs.inventory_management,
          stock: rs.stock,
          price: rs.price,
          handle: rs.handle,
          variants: rs.variants,
          disabled: idsExclude?.includes(rs.id),
        });
      });
    return arr;
  }, [data.data, idsExclude]);

  const handleFiltersQueryChange = useCallback(
    (value: any) => setQueryValue(value),
    []
  );

  const handleQueryValueRemove = useCallback(() => {
    setIsLoading(true);
    setQueryValue("");
  }, []);

  const handleFiltersClearAll = useCallback(() => {
    handleQueryValueRemove();
  }, [handleQueryValueRemove]);

  const handleScroll = useCallback(
    ({ currentPage = 1, lastPage = 1 }: any) => {
      if (currentPage < lastPage && !isLoading) {
        setIsLoadingScroll(true);
        setFilters({
          ...filters,
          page: currentPage + 1,
        });
      }
    },
    [isLoading]
  );

  const onSave = useCallback(() => {
    setIsLoadingSave(true);
    onAdd({ list: listSelected.reverse() });
    onClose();
  }, [listSelected]);

  const onChange = useCallback(
    (ids: any) => {
      setIdsSelected(ids);
      let arr: any = [];
      ids.forEach((id: any) => {
        let item = selected.find((item: any) => item.id == id);
        if (item) {
          arr.push({
            id: item.id,
            title: item.title,
            type: item.type,
            image: item.image,
            status: item.status,
            inventory_management: item.inventory_management,
            stock: item.stock,
            price: item.price,
            handle: item.handle,
            variants: item.variants,
          });
        } else {
          item = data ? data.data.find((item: any) => item.id == id) : null;
          if (item) {
            arr.push({
              id: item.id,
              title: item.title,
              type: item.type ? item.type : "manual",
              image: item.image,
              status: item.status,
              inventory_management: item.inventory_management,
              stock: item.stock,
              price: item.price,
              handle: item.handle,
              variants: item.variants,
            });
          }
        }
      });
      setListSelected(arr);
    },
    [selected, data]
  );

  const openUrl = useCallback((path: string) => {
    window.open(`shopify://admin${path}`, "_blank");
  }, []);

  useEffect(() => {
    clearTimeout(timerLoad);
    timerLoad = setTimeout(() => {
      if (filters.keyword !== queryValue) {
        setIsLoading(true);
        setFilters({
          ...filters,
          keyword: queryValue ? queryValue : null,
          page: 1,
        });
      }
    }, 300);
  }, [queryValue]);

  useEffect(() => {
    if (open) {
      let arr: any = [];
      let arrOther: any = [];
      selected.reverse().forEach((item: any) => {
        arr.push(item.id);
        arrOther.push({
          id: item.id,
          title: item.title,
          type: item.type,
          image: item.image,
          status: item.status,
          inventory_management: item.inventory_management,
          stock: item.stock,
          price: item.price,
          handle: item.handle,
          variants: item.variants,
        });
      });
      setIdsSelected(arr);
      setListSelected(arrOther);
      // setFilters((prev: any) => ({
      //   ...prev,
      //   page: 1,
      //   keyword: ""
      // }));
    } else {
      setIsLoadingSave(false);
      setIsLoadingScroll(false);
      setIsLoading(false);
    }
  }, [open, selected]);

  return (
    <Modal
      open={open}
      title={title}
      width="620px"
      onClose={() => onClose()}
      zIndex="399"
      sectioned={false}
    >
      <StyledModalContent>
        {hasData && (
          <StyledFilter>
            <Filters
              queryValue={queryValue}
              filters={[]}
              queryPlaceholder={"Search products"}
              onQueryChange={handleFiltersQueryChange}
              onQueryClear={handleQueryValueRemove}
              onClearAll={handleFiltersClearAll}
            />
          </StyledFilter>
        )}
        {isLoading || !isFirstLoaded ? (
          <Loading></Loading>
        ) : hasData ? (
          <StyledList>
            {data?.data?.length > 0 ? (
              <Scrollable
                style={{ height: "364px" }}
                horizontal={false}
                onScrolledToBottom={() =>
                  handleScroll({
                    currentPage: filters.page,
                    lastPage: data.last_page,
                  })
                }
              >
                {data.data.length > 0 && (
                  <OptionList
                    onChange={(value: any) => onChange(value)}
                    sections={[
                      {
                        options: options,
                      },
                    ]}
                    selected={idsSelected}
                    allowMultiple={isMulti}
                  />
                )}
                {isLoadingScroll && <Loading></Loading>}
              </Scrollable>
            ) : (
              <EmptyState heading="No result found" image="">
                <p>Please try another keywords.</p>
              </EmptyState>
            )}
          </StyledList>
        ) : (
          <>
            <EmptyState
              heading="No products found"
              action={{ content: "Add transfer" }}
              secondaryAction={{
                content: "Add products",
                onAction: () => openUrl("/products"),
              }}
              image=""
            >
              <p>Add products to use this feature.</p>
            </EmptyState>
          </>
        )}
      </StyledModalContent>
      <StyledModalFooter>
        {isMulti ? (
          <Text as="p" variant="bodyMd">
            Selected {idsSelected.length} of {data?.total} products
          </Text>
        ) : (
          <div></div>
        )}
        <div>
          <Button onClick={() => onClose()}>{t("buttons.cancel")}</Button>
          <Button
            variant="primary"
            loading={isLoadingSave}
            onClick={() => onSave()}
          >
            Add
          </Button>
        </div>
      </StyledModalFooter>
    </Modal>
  );
};

export default ModalAddProduct;
