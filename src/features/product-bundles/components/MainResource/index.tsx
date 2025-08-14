import { useState, useMemo, useCallback, useRef } from "react";
import { Controller } from "react-hook-form";
import {
  Button,
  Text,
  Card,
  Icon,
  Banner,
  Box,
  TextField,
  Scrollable,
  BlockStack,
  Thumbnail,
  Tooltip,
} from "@shopify/polaris";
import { SearchIcon, XSmallIcon, ViewIcon } from "@shopify/polaris-icons";
import { Loading, SelectOptionList } from "@/components/core";
import {
  StyledContainer,
  StyledContent,
  StyledList,
  StyledProductItem,
  StyledProductItemContent,
  StyledProductItemPrice,
  StyledCollectionItem,
  StyledCollectionItemContent,
  StyledClose,
  StyledProductItemName,
} from "./styled-components";
import {
  StyledButtonGroup,
  StyledButton,
} from "@/styled-components/button-group";
import ModalAddProducts from "@/features/product-bundles/components/ModalAddProduct";
import ModalRequireExtension from "@/components/shared/ModalRequireExtension";
import ModalAddCollection from "@/features/product-bundles/components/ModalAddCollection";
import { useFieldArray } from "react-hook-form";
import { clone, isEmpty } from "@/utils/lodash";
import { useCommonContext } from "@/contexts/common";
import { checkInstallExtension } from "@/utils/chrome-extension";
import { useAuthContext } from "@/features/auth/contexts";
import {
  STATUS_ACTIVE,
  TYPE_SPECIFIC,
  TYPE_COLLECTION,
  TYPE_GENERAL,
  STRATEGY_AI,
  STRATEGY_MANUAL_PICK,
} from "@/features/product-bundles/constants";
import { formatOutputPrice } from "@/utils/money";

type Props = {
  errors: any;
  control: any;
  watch: any;
  setValue: any;
  clearErrors: any;
  mainData: any;
  setMainData: Function;
  recommendedProductsTemp: any;
  setRecommendedProductsTemp: Function;
};

function MainResource({
  errors,
  control,
  watch,
  setValue,
  clearErrors,
  mainData,
  setMainData,
  recommendedProductsTemp,
  setRecommendedProductsTemp,
}: Props) {
  const [{ store }]: any = useAuthContext();
  let allWatchedValues = watch({ nest: true });

  const [modalAdd, setModalAdd] = useState({ open: false, keyword: "" });
  const [keyword, setKeyword] = useState("");

  const dataList = useMemo(() => {
    if (mainData.length <= 0) {
      return [];
    }
    let arr = !keyword
      ? [...mainData]
      : [...mainData].filter((item: any) => {
          if (
            keyword &&
            item?.title?.toLowerCase().includes(keyword.toLowerCase())
          ) {
            return true;
          }
          return false;
        });
    return arr;
  }, [mainData, keyword]);

  const onAddProducts = (payload: any) => {
    setValue(
      "list_default_ids",
      payload.list.map((item: any) => String(item.id)),
      { shouldDirty: true }
    );
    setMainData(payload.list || []);
  };

  const onAddCollection = (payload: any) => {
    setValue(
      "list_default_ids",
      payload.list.map((item: any) => String(item.id)),
      { shouldDirty: true }
    );
    setMainData(payload.list || []);
  };

  const checkExtensionAdd = (payload: any) => {
    setModalAdd(() => ({ open: true, keyword: payload.keyword || "" }));
  };

  const onChangeType = (val: string) => {
    if (val == TYPE_COLLECTION) {
      setValue("mode", STRATEGY_AI);
      setValue("list_commendations", []);
    } else {
      setValue("mode", STRATEGY_MANUAL_PICK);
      setValue("list_commendations", clone(recommendedProductsTemp));
    }
    setValue("list_default_ids", []);
    setMainData([]);
    setValue("useDiscount", 0);
    clearErrors([
      `list_default_ids`,
      `list_commendations`,
      "minimumAmount",
      "promotionValue",
    ]);
    setKeyword("");
  };

  const renderItemProduct = ({ item, isDisable, index }: any) => {
    return (
      <StyledProductItem key={item.id} disabled={isDisable}>
        <StyledProductItemContent>
          <Thumbnail
            source={item.image || "/images/no-img.png"}
            alt={item.title}
            size="small"
          />
          <StyledProductItemName
            onClick={() =>
              openUrl(
                `https://${store?.shopify_domain}/products/${item.handle}`
              )
            }
          >
            {item.title}
          </StyledProductItemName>
        </StyledProductItemContent>
        <StyledClose
          onClick={() => {
            setValue(
              "list_default_ids",
              watch("list_default_ids").filter((id: any) => id != item.id),
              { shouldDirty: true }
            );
            setMainData((prev: any) => {
              return [...prev].filter(
                (itemOther: any) => itemOther.id != item.id
              );
            });
          }}
        >
          <Icon source={XSmallIcon}></Icon>
        </StyledClose>
      </StyledProductItem>
    );
  };

  const openUrl = useCallback((url: string) => {
    window.open(url, "_blank");
  }, []);

  return (
    <StyledContainer>
      <StyledContent>
        <Card padding="400">
          <BlockStack gap="300">
            <BlockStack gap="200">
              <Text variant="bodyMd" as="h3" fontWeight="semibold">
                Main products
              </Text>
            </BlockStack>
            <Controller
              name="type"
              control={control}
              render={({ field: { onChange, value } }) => (
                <BlockStack gap="100">
                  <Text as="p" variant="bodyMd">
                    Choose a main product type to create a bundle for
                  </Text>
                  <StyledButtonGroup>
                    <StyledButton
                      active={TYPE_SPECIFIC == value}
                      onClick={() => {
                        onChange(TYPE_SPECIFIC);
                        onChangeType(TYPE_SPECIFIC);
                      }}
                    >
                      Specific products
                    </StyledButton>
                    <StyledButton
                      active={TYPE_COLLECTION == value}
                      onClick={() => {
                        onChange(TYPE_COLLECTION);
                        onChangeType(TYPE_COLLECTION);
                      }}
                    >
                      Specific collections
                    </StyledButton>
                    <StyledButton
                      active={TYPE_GENERAL == value}
                      onClick={() => {
                        onChange(TYPE_GENERAL);
                        onChangeType(TYPE_GENERAL);
                      }}
                    >
                      Any products
                    </StyledButton>
                  </StyledButtonGroup>
                </BlockStack>
              )}
            />
            {watch("type") == TYPE_GENERAL ? (
              <Banner tone="info">
                Apply to all products in your store, including new products that
                will be added in the future.
              </Banner>
            ) : (
              <>
                <TextField
                  label={
                    watch("type") == TYPE_COLLECTION
                      ? "Applicable collections"
                      : "Applicable products"
                  }
                  value={keyword}
                  placeholder={
                    watch("type") == TYPE_COLLECTION
                      ? "Search collections"
                      : "Search products"
                  }
                  autoComplete="off"
                  onChange={(val) => checkExtensionAdd({ keyword: val })}
                  prefix={<Icon source={SearchIcon} />}
                  connectedRight={
                    <Button
                      size="large"
                      onClick={() => checkExtensionAdd({ keyword: "" })}
                    >
                      Browse
                    </Button>
                  }
                  error={
                    errors?.list_default_ids?.message &&
                    (!mainData || !mainData.length)
                      ? errors?.list_default_ids.message
                      : ""
                  }
                ></TextField>

                {watch("type") == TYPE_SPECIFIC && dataList?.length ? (
                  <Card padding="0">
                    <Scrollable style={{ maxHeight: "320px" }}>
                      <StyledList>
                        {dataList.map((item: any, index: number) => {
                          let isDisable =
                            item.status != STATUS_ACTIVE ||
                            (item.inventory_management && item.stock <= 0);
                          if (!isDisable) {
                            return renderItemProduct({
                              item,
                              isDisable,
                              index,
                            });
                          }
                          return (
                            <Tooltip
                              key={item.id}
                              content={
                                isDisable ? "This product is out of stock" : ""
                              }
                            >
                              {renderItemProduct({ item, isDisable, index })}
                            </Tooltip>
                          );
                        })}
                      </StyledList>
                    </Scrollable>
                  </Card>
                ) : null}

                {watch("type") == TYPE_COLLECTION && dataList?.length ? (
                  <Scrollable style={{ maxHeight: "320px" }}>
                    <StyledList>
                      {dataList.map((item: any, index: number) => {
                        return (
                          <StyledCollectionItem key={item.id}>
                            <StyledCollectionItemContent>
                              <Thumbnail
                                source={item.image || "/images/no-img.png"}
                                alt={item.title}
                                size="small"
                              />
                              <span>{item.title}</span>
                            </StyledCollectionItemContent>
                            <StyledClose
                              onClick={() => {
                                setValue(
                                  "list_default_ids",
                                  watch("list_default_ids").filter(
                                    (id: any) => id != item.id
                                  ),
                                  { shouldDirty: true }
                                );
                                setMainData((prev: any) => {
                                  return [...prev].filter(
                                    (item: any) => item.id != item.id
                                  );
                                });
                              }}
                            >
                              <Icon source={XSmallIcon}></Icon>
                            </StyledClose>
                          </StyledCollectionItem>
                        );
                      })}
                    </StyledList>
                  </Scrollable>
                ) : null}

                {watch("type") == TYPE_COLLECTION ? (
                  <Banner tone="info">
                    You can only add one collection per bundle of this type
                  </Banner>
                ) : null}
              </>
            )}
          </BlockStack>
        </Card>
      </StyledContent>

      {watch("type") == TYPE_SPECIFIC && modalAdd.open && (
        <ModalAddProducts
          open={modalAdd.open}
          selected={mainData ? mainData : []}
          onAdd={(payload: any) => onAddProducts(payload)}
          onClose={() => setModalAdd(() => ({ open: false, keyword: "" }))}
          isMulti={true}
          title={"Main product"}
          keyword={modalAdd.keyword}
          idsExclude={allWatchedValues.list_commendations?.map(
            (item: any) => item.id
          )}
        ></ModalAddProducts>
      )}

      {watch("type") == TYPE_COLLECTION && modalAdd.open && (
        <ModalAddCollection
          open={modalAdd.open}
          selected={mainData ? mainData : []}
          onAdd={(payload: any) => onAddCollection(payload)}
          onClose={() => setModalAdd(() => ({ open: false, keyword: "" }))}
          isMulti={false}
          title={"Collections"}
          keyword={modalAdd.keyword}
        ></ModalAddCollection>
      )}
    </StyledContainer>
  );
}

export default MainResource;
