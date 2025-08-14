import { useEffect, useState, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/features/auth/contexts";
import {
  Listbox,
  Combobox,
  Scrollable,
  AutoSelection,
  Thumbnail,
} from "@shopify/polaris";
import { XSmallIcon } from "@shopify/polaris-icons";
import {
  StyledContainer,
  StyledItem,
  StyledList,
  StyledItemProduct,
  StyledItemName,
  StyledItemImage,
} from "./styled-components";
import api from "@/features/product-bundles/api";
import { _queryKey } from "@/constants/react-query";
import { STATUS_ACTIVE } from "@/features/product-bundles/constants";

type Props = {
  selected: any;
  onChange: Function;
  disabled?: boolean;
  productCurrent?: any;
};

const SearchProducts = ({
  selected,
  onChange,
  disabled = false,
  productCurrent,
}: Props) => {
  const [{ store, isLoyalty }]: any = useAuthContext();

  const [dataList, setDataList]: any = useState({ data: [] });
  const [keywordTemp, setKeywordTemp] = useState("");
  const [filters, setFilters]: any = useState({
    keyword: "",
    page: 1,
    idExclude: [],
    type: "search-products",
  });
  const timerRef: any = useRef();

  const { isLoading } = useQuery(
    [_queryKey.getProductList, filters],
    async () => {
      let res = await api.getProductList(filters);
      let { status = false, data = null } = res;
      if (status && data) {
        if (filters.page <= 1) {
          setDataList(data);
        } else {
          setDataList((prev: any) => {
            return {
              ...data,
              data: [...prev.data, ...data.data],
            };
          });
        }
      }
      return res;
    }
  );

  const updateText = useCallback(
    (value: string) => {
      clearTimeout(timerRef.current);
      setKeywordTemp(value);
      timerRef.current = setTimeout(() => {
        setFilters((prev: any) => {
          return {
            ...prev,
            keyword: value,
            page: 1,
          };
        });
      }, 700);
    },
    [dataList]
  );

  const updateSelection = useCallback(
    (value: string) => {
      if (selected?.id == value) {
        selected(null);
      } else {
        let temp = dataList?.data?.find((item: any) => item.id === value);
        console.log("temp", temp);
        temp && onChange(temp);
      }
      // if(selected.some((item: any) => item.id == value)){
      //   onRemove(value)
      // }else{
      //   let temp = dataList.data.find((item: any) => item.id === value);
      //   temp && onChange([...selected, temp])
      // }
    },
    [dataList]
  );

  const onRemove = useCallback(
    (value: any) => {
      // onChange(selected.filter((item: any) => item.id !== value))
      onChange(null);
    },
    [selected]
  );

  const handleScroll = useCallback(
    ({ currentPage = 1, lastPage = 1 }: any) => {
      if (currentPage < lastPage && !isLoading) {
        setFilters((prev: any) => {
          return {
            ...prev,
            page: currentPage + 1,
          };
        });
      }
    },
    [isLoading]
  );

  return (
    <StyledContainer>
      <Combobox
        // allowMultiple
        activator={
          <Combobox.TextField
            disabled={disabled}
            onChange={updateText}
            label="Specific products"
            labelHidden
            value={keywordTemp}
            placeholder="Search products"
            autoComplete="off"
            clearButton
            onClearButtonClick={() => {
              setFilters((prev: any) => {
                return {
                  ...prev,
                  keyword: "",
                  page: 1,
                };
              });
              setKeywordTemp("");
            }}
          />
        }
      >
        {dataList.data?.length > 0 ? (
          <Scrollable
            shadow
            style={{
              maxHeight: "292px",
            }}
            onScrolledToBottom={() =>
              !isLoading &&
              handleScroll({
                currentPage: filters.page,
                lastPage: dataList.last_page,
              })
            }
          >
            <Listbox
              onSelect={updateSelection}
              autoSelection={AutoSelection.None}
            >
              {dataList.data?.map((item: any) => {
                const { title, id } = item;
                if (productCurrent?.id == id) {
                  return null;
                }
                const isDisable =
                  item.status != STATUS_ACTIVE ||
                  (item.inventory_management && item.stock <= 0);
                return (
                  <Listbox.Option
                    key={`${id}`}
                    value={id}
                    disabled={isDisable}
                    selected={selected?.id == id}
                    accessibilityLabel={title}
                  >
                    {title}
                  </Listbox.Option>
                );
              })}
              {isLoading ? (
                <Listbox.Loading accessibilityLabel="Loading" />
              ) : null}
            </Listbox>
          </Scrollable>
        ) : null}
      </Combobox>
      {selected ? (
        <StyledList>
          <StyledItem key={selected.id}>
            <StyledItemProduct disabled={true}>
              <StyledItemImage>
                <Thumbnail
                  source={selected?.image || "/images/no-img.png"}
                  size="medium"
                  alt="Black choker necklace"
                />
              </StyledItemImage>
              <StyledItemName>
                <span title={selected.title}>{selected.title}</span>
              </StyledItemName>
            </StyledItemProduct>
            <XSmallIcon onClick={() => onRemove(selected.id)}></XSmallIcon>
          </StyledItem>
        </StyledList>
      ) : null}
    </StyledContainer>
  );
};
export default SearchProducts;
