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
  StyledClose,
  StyledProductItemName,
} from "@/features/product-bundles/components/MainResource/styled-components";
import ModalAddProducts from "@/features/product-bundles/components/ModalAddProduct";
import { useAuthContext } from "@/features/auth/contexts";
import { STATUS_ACTIVE } from "@/features/product-bundles/constants";

type Props = {
  errors: any;
  watch: any;
  setValue: any;
  mainData: any;
  setMainData: Function;
};

function MainResource({
  errors,
  watch,
  setValue,
  mainData,
  setMainData,
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

  const checkExtensionAdd = (payload: any) => {
    setModalAdd(() => ({ open: true, keyword: payload.keyword || "" }));
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
          <BlockStack gap="100">
            <BlockStack gap="200">
              <Text variant="bodyMd" as="h3" fontWeight="semibold">
                Main products
              </Text>
            </BlockStack>
            <>
              <TextField
                labelHidden
                label={"Applicable products"}
                value={keyword}
                placeholder={"Search products"}
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

              {dataList?.length ? (
                <Card padding="0">
                  <Scrollable style={{ maxHeight: "320px" }}>
                    <StyledList>
                      {dataList.map((item: any, index: number) => {
                        let isDisable =
                          item.status != STATUS_ACTIVE ||
                          (item.inventory_management && item.stock <= 0);
                        if (!isDisable) {
                          return renderItemProduct({ item, isDisable, index });
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
            </>
          </BlockStack>
        </Card>
      </StyledContent>

      {modalAdd.open && (
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
    </StyledContainer>
  );
}

export default MainResource;
