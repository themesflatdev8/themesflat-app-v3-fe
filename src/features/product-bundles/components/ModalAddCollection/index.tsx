import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/features/auth/contexts";
import { useTranslation } from "react-i18next";
import {
  Button,
  OptionList,
  Scrollable,
  TextField,
  Icon,
  Text,
  EmptyState,
  Box,
} from "@shopify/polaris";
import { SmileySadIcon, SearchIcon } from "@shopify/polaris-icons";
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
import api from "@/features/product-bundles/api";
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

const ModalAddCollection = ({
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
  const [queryValue, setQueryValue]: any = useState(keyword);
  const [filters, setFilters]: any = useState({ keyword: keyword, page: 1 });
  const [data, setData]: any = useState({ data: [], last_page: 1, total: 0 });
  const [hasData, setHasData] = useState(false);

  useQuery(
    [_queryKey.getCollectionList, filters],
    async () => {
      try {
        let res = await api.getCollectionList(filters);
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
      enabled: open ? true : false,
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
                  width="36"
                  height="36"
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
          handle: rs.handle,
          products_count: rs.products_count,
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
            image: item.image,
            handle: item.handle,
            products_count: item.products_count,
          });
        } else {
          item = data ? data.data.find((item: any) => item.id == id) : null;
          if (item) {
            arr.push({
              id: item.id,
              title: item.title,
              image: item.image,
              handle: item.handle,
              products_count: item.products_count,
            });
          }
        }
      });
      setListSelected(arr);
    },
    [selected, data]
  );

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
          image: item.image,
          handle: item.handle,
          products_count: item.products_count,
        });
      });
      setIdsSelected(arr);
      setListSelected(arrOther);
      // setFilters((prev: any) => ({
      //   ...prev,
      //   page: 1,
      //   keyword: keyword
      // }));
      // setQueryValue(keyword)
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
            <TextField
              label="Search"
              labelHidden
              value={queryValue}
              placeholder={"Search collections"}
              onChange={handleFiltersQueryChange}
              onClearButtonClick={handleQueryValueRemove}
              autoComplete="off"
              prefix={<Icon source={SearchIcon} />}
            ></TextField>
          </StyledFilter>
        )}
        {isLoading || !isFirstLoaded ? (
          <div style={{ height: hasData ? "340px" : "396px" }}>
            <Loading></Loading>
          </div>
        ) : hasData ? (
          <StyledList>
            {data?.data?.length > 0 ? (
              <Scrollable
                style={{ height: "340px" }}
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
              <div style={{ height: "340px" }}>
                <Box paddingBlockStart="2000">
                  <EmptyState
                    heading="No result found"
                    image="/icons/search.png"
                  >
                    <p>Please try another keywords.</p>
                  </EmptyState>
                </Box>
              </div>
            )}
          </StyledList>
        ) : (
          <>
            <StyledEmptyData>
              <div>
                <Icon source={SmileySadIcon} tone="primary" />
                <Text as="h3">{"No result found"}</Text>
                <Text variant="bodyMd" as="p" tone="subdued">
                  Add collections to use this feature.
                </Text>
              </div>
            </StyledEmptyData>
          </>
        )}
      </StyledModalContent>
      <StyledModalFooter>
        {isMulti && idsSelected.length > 0 ? (
          <Text as="p" variant="bodyMd">
            {idsSelected.length} collections selected
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

export default ModalAddCollection;
