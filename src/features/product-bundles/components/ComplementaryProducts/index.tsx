import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import {
  Select,
  Button,
  Text,
  InlineStack,
  Card,
  Banner,
  Icon,
  Box,
  Tooltip,
  BlockStack,
  TextField,
  Checkbox,
} from "@shopify/polaris";
import { InfoIcon } from "@shopify/polaris-icons";
import { Loading, ModalConfirm } from "@/components/core";
import {
  StyledContainer,
  StyledContent,
  StyledTable,
  StyledMaximum,
} from "./styled-components";
import {
  StyledButtonGroup,
  StyledButton,
} from "@/styled-components/button-group";
import ComplementaryProductsTable from "@/features/product-bundles/components/ComplementaryProductsTable";
import ComplementaryProductsFilter from "@/features/product-bundles/components/ComplementaryProductsFilter";
import ModalAddProducts from "@/features/product-bundles/components/ModalAddProduct";
import ModalUnlock from "@/components/shared/ModalUnlock";
import ModalRequireExtension from "@/components/shared/ModalRequireExtension";
import { useFieldArray } from "react-hook-form";
import { clone, isEmpty } from "@/utils/lodash";
import api from "@/features/product-bundles/api";
import { _queryKey } from "@/constants/react-query";
import {
  STATUS_ACTIVE,
  TYPE_COLLECTION,
  STRATEGY_AI,
  STRATEGY_MANUAL_PICK,
  SWAPPABLE_OPTION_CROSS,
  PAGE_TYPE_PRODUCT,
} from "@/features/product-bundles/constants";
import { useCommonContext } from "@/contexts/common";
import { checkInstallExtension } from "@/utils/chrome-extension";
import { useAuthContext } from "@/features/auth/contexts";
import { getOnlyDigit } from "@/utils/money";

type Props = {
  errors: any;
  control: any;
  watch: any;
  setValue: any;
  clearErrors: any;
  mainData: any;
  recommendedProductsTemp: any;
  setRecommendedProductsTemp: Function;
  pageType: string;
};

const IconGen = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.7688 5.13441C12.6344 5.10753 12.5806 4.97312 12.5806 4.83871C12.5806 4.73118 12.6344 4.59677 12.7688 4.56989L14.3011 3.97849L14.8656 2.47312C14.8925 2.33871 15.0269 2.25806 15.1613 2.25806C15.2688 2.25806 15.4032 2.33871 15.4301 2.47312L16.0215 3.97849L17.5269 4.56989C17.6613 4.59677 17.7419 4.73118 17.7419 4.83871C17.7419 4.97312 17.6613 5.10753 17.5269 5.13441L16.0215 5.69893L15.4301 7.23118C15.4032 7.33871 15.2688 7.41936 15.1613 7.41936C15.0269 7.41936 14.8925 7.33871 14.8656 7.23118L14.3011 5.69893L12.7688 5.13441ZM13.3213 6.67869L12.3978 6.33843C11.4583 6.07706 11.3226 5.14357 11.3226 4.83871C11.3226 4.4931 11.4993 3.62492 12.3846 3.36967L13.3214 3.00811L13.664 2.09434C13.8922 1.30071 14.6471 1 15.1613 1C15.7121 1 16.4066 1.34669 16.6271 2.0793L16.9919 3.00807L17.9207 3.37294C18.6533 3.59343 19 4.28795 19 4.83871C19 5.35292 18.6993 6.10782 17.9057 6.33598L16.9919 6.67865L16.619 7.64481C16.4891 8.03345 16.2224 8.27994 16.0238 8.41236C15.802 8.56026 15.5026 8.67742 15.1613 8.67742C14.854 8.67742 14.5564 8.5887 14.3063 8.43243C14.0836 8.2932 13.8031 8.03597 13.6722 7.63123L13.3213 6.67869ZM5.56452 8.17204L6.98925 5.10753C7.04301 4.94624 7.2043 4.83871 7.36559 4.83871C7.52688 4.83871 7.68817 4.94624 7.76882 5.10753L9.16667 8.17204L12.2312 9.56989C12.3925 9.65054 12.5 9.81183 12.5 9.97312C12.5 10.1344 12.3925 10.2957 12.2312 10.3763L9.16667 11.7742L7.76882 14.8387C7.68817 15 7.52688 15.1075 7.36559 15.1075C7.2043 15.1075 7.04301 15 6.98925 14.8387L5.56452 11.7742L2.5 10.3763C2.33871 10.2957 2.25806 10.1344 2.25806 9.97312C2.25806 9.81183 2.33871 9.65054 2.5 9.56989L5.56452 8.17204ZM4.61962 12.726L1.95746 11.5116L1.93738 11.5016C1.29085 11.1783 1 10.5412 1 9.97312C1 9.40508 1.29085 8.76791 1.93738 8.44465L1.95746 8.4346L4.61962 7.22029L5.82861 4.61981C6.0872 3.97157 6.72087 3.58065 7.36559 3.58065C8.06939 3.58065 8.63152 4.0198 8.89406 4.5449L8.90411 4.56499L10.1163 7.22243L12.7737 8.4346L12.7938 8.44465C13.3189 8.7072 13.7581 9.26932 13.7581 9.97312C13.7581 10.6769 13.3189 11.239 12.7938 11.5016L12.7737 11.5116L10.1163 12.7238L8.90411 15.3812L8.89406 15.4013C8.63152 15.9264 8.06939 16.3656 7.36559 16.3656C6.72087 16.3656 6.08721 15.9747 5.82862 15.3264L4.61962 12.726ZM14.5699 12.7957C14.543 12.6613 14.4086 12.5806 14.3011 12.5806C14.1667 12.5806 14.0323 12.6613 14.0054 12.7957L13.4409 14.3011L11.9086 14.8925C11.7742 14.9194 11.7204 15.0538 11.7204 15.1613C11.7204 15.2957 11.7742 15.4301 11.9086 15.457L13.4409 16.0215L14.0054 17.5538C14.0323 17.6613 14.1667 17.7419 14.3011 17.7419C14.4086 17.7419 14.543 17.6613 14.5699 17.5538L15.1613 16.0215L16.6667 15.457C16.8011 15.4301 16.8817 15.2957 16.8817 15.1613C16.8817 15.0538 16.8011 14.9194 16.6667 14.8925L15.1613 14.3011L14.5699 12.7957ZM16.1317 13.3307L17.0605 13.6955C17.7931 13.916 18.1398 14.6105 18.1398 15.1613C18.1398 15.6755 17.8391 16.4304 17.0454 16.6586L16.1317 17.0012L15.7588 17.9674C15.6289 18.356 15.3622 18.6025 15.1636 18.7349C14.9417 18.8828 14.6424 19 14.3011 19C13.9938 19 13.6962 18.9113 13.4461 18.755C13.2234 18.6158 12.9428 18.3586 12.812 17.9538L12.4611 17.0013L11.5375 16.661C10.5981 16.3996 10.4624 15.4662 10.4624 15.1613C10.4624 14.8157 10.6391 13.9475 11.5244 13.6923L12.4611 13.3307L12.8038 12.4169C13.032 11.6233 13.7869 11.3226 14.3011 11.3226C14.8518 11.3226 15.5464 11.6693 15.7668 12.4019L16.1317 13.3307Z"
      fill="black"
    />
  </svg>
);
function ComplementaryProducts({
  errors,
  control,
  watch,
  setValue,
  clearErrors,
  mainData,
  recommendedProductsTemp,
  setRecommendedProductsTemp,
  pageType,
}: Props) {
  let [{ loyalty }]: any = useCommonContext();
  const [{ store }]: any = useAuthContext();

  const [filters, setFilters] = useState({ keyword: "", sort: "asc" });
  const [modalAddProducts, setModalAddProducts] = useState({
    open: false,
    keyword: "",
  });
  const [openModalUnlock, setOpenModalUnlock] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalRequireExtension, setOpenModalRequireExtension] =
    useState(false);

  const { remove } = useFieldArray({
    control,
    name: "list_commendations",
  });
  let allWatchedValues = watch({ nest: true });

  const strategyOptions = useMemo(() => {
    return [
      { value: STRATEGY_AI, label: "M-Sell AI" },
      { value: STRATEGY_MANUAL_PICK, label: "Manual pick" },
    ];
  }, []);

  const data = useMemo(() => {
    // if(allWatchedValues.list_commendations.length <=0){
    //   return []
    // }
    // let arr = !filters.keyword ? [...allWatchedValues.list_commendations] : [...allWatchedValues.list_commendations].filter((item: any) => {
    //   if(filters.keyword && item?.title?.toLowerCase().includes(filters.keyword.toLowerCase())){
    //     return true
    //   }
    //   return false
    // })
    // if(arr.length > 0){
    //   if(filters.sort == 'desc'){
    //     // arr = arr.reverse()
    //     arr.sort((a: any, b: any) => {
    //       let aPrice = !isNaN(a?.price) ? Number(a.price) : 0;
    //       let bPrice = !isNaN(b?.price) ? Number(b.price) : 0;
    //       return bPrice - aPrice;

    //     });
    //   }else{
    //     arr.sort((a: any, b: any) => {
    //       let aPrice = !isNaN(a?.price) ? Number(a.price) : 0;
    //       let bPrice = !isNaN(b?.price) ? Number(b.price) : 0;
    //       return aPrice - bPrice;

    //     });
    //   }
    // }
    return [...allWatchedValues.list_commendations];
  }, [allWatchedValues]);

  const onRemove = ({ index, id }: any) => {
    if (index < 0) return;
    remove(index);
    setRecommendedProductsTemp((prev: any) => {
      return prev.filter((item: any) => item.id != id);
    });
  };

  const onAddProducts = (payload: any) => {
    setValue("list_commendations", payload.list, { shouldDirty: true });
    setRecommendedProductsTemp(() => payload.list);
  };

  const checkExtensionAdd = (payload: any) => {
    setModalAddProducts((prev: any) => {
      return { open: true, keyword: payload.keyword || "" };
    });
  };

  return (
    <StyledContainer>
      <StyledContent>
        <Card padding="400">
          <BlockStack gap="300">
            <InlineStack
              gap="500"
              wrap={false}
              align="space-between"
              blockAlign="start"
            >
              <BlockStack gap="200">
                <Text variant="bodyMd" as="h3" fontWeight="semibold">
                  Recommended products in bundle
                </Text>
              </BlockStack>
            </InlineStack>
            <Controller
              name="mode"
              control={control}
              render={({ field: { onChange, value } }) => (
                <BlockStack gap="100">
                  <InlineStack wrap={false} gap="050">
                    <Text as="p" variant="bodyMd">
                      Choose a strategy for selecting recommended products
                    </Text>
                    <Tooltip
                      width="wide"
                      dismissOnMouseOut={false}
                      content={
                        "Products with an assigned selling plan are currently not supported"
                      }
                      hoverDelay={500}
                    >
                      <Icon source={InfoIcon}></Icon>
                    </Tooltip>
                  </InlineStack>

                  <StyledButtonGroup>
                    <StyledButton
                      active={STRATEGY_AI == value}
                      onClick={() => {
                        onChange(STRATEGY_AI);
                        setValue("list_commendations", []);
                        setValue("useDiscount", false);
                        clearErrors([
                          `list_commendations`,
                          "minimumAmount",
                          "promotionValue",
                        ]);
                      }}
                    >
                      M-Sell AI
                    </StyledButton>
                    <StyledButton
                      active={STRATEGY_MANUAL_PICK == value}
                      onClick={() => {
                        onChange(STRATEGY_MANUAL_PICK);
                        clearErrors(`list_commendations`);
                        let list_default_ids = watch("list_default_ids") || [];
                        let arr = list_default_ids?.length
                          ? recommendedProductsTemp.filter((item: any) => {
                              return !list_default_ids.some(
                                (id: any) => id == item.id
                              );
                            })
                          : recommendedProductsTemp;
                        setValue("list_commendations", clone(arr));
                      }}
                    >
                      Manual pick
                    </StyledButton>
                  </StyledButtonGroup>
                </BlockStack>
              )}
            />
            {watch("mode") == STRATEGY_AI ? (
              <Banner tone="info">
                Our M-Sell AI will automatically analyze and display relevant
                products related to the main product in your storefront.
                Recommendations may change over time
              </Banner>
            ) : (
              <StyledTable>
                <ComplementaryProductsFilter
                  error={
                    errors?.list_commendations?.message &&
                    allWatchedValues.list_commendations?.length <= 0
                      ? errors?.list_commendations?.message
                      : ""
                  }
                  onAdd={(payload: any) => checkExtensionAdd(payload)}
                ></ComplementaryProductsFilter>
                {data &&
                  (data.length > 0 ? (
                    <ComplementaryProductsTable
                      allData={allWatchedValues.list_commendations}
                      data={clone(data)}
                      setValue={setValue}
                      onRemove={(payload: any) => onRemove(payload)}
                    ></ComplementaryProductsTable>
                  ) : null)}
              </StyledTable>
            )}
            <StyledMaximum>
              <BlockStack gap="400">
                <Controller
                  name="maxProduct"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      label=""
                      labelHidden
                      type="number"
                      min={1}
                      max={9999}
                      value={value}
                      onChange={(val) => {
                        onChange(getOnlyDigit(val));
                      }}
                      onBlur={() => {
                        if (value == "") {
                          onChange(1);
                        } else if (value > 9999) {
                          onChange(100);
                        } else if (value < 1) {
                          onChange(1);
                        }
                      }}
                      autoComplete="off"
                      connectedLeft="Maximum display products"
                    />
                  )}
                />
              </BlockStack>
            </StyledMaximum>
          </BlockStack>
        </Card>
      </StyledContent>

      {modalAddProducts.open ? (
        <ModalAddProducts
          idsExclude={mainData.map((item: any) => item.id) || []}
          open={modalAddProducts.open}
          selected={allWatchedValues.list_commendations}
          onAdd={(payload: any) => onAddProducts(payload)}
          onClose={() =>
            setModalAddProducts((prev: any) => {
              return { open: false, keyword: "" };
            })
          }
          title={"Add recommended products"}
          keyword={modalAddProducts.keyword}
        ></ModalAddProducts>
      ) : null}

      <ModalUnlock
        open={openModalUnlock}
        onClose={() => setOpenModalUnlock(false)}
      ></ModalUnlock>

      <ModalRequireExtension
        open={openModalRequireExtension}
        onClose={() => setOpenModalRequireExtension(false)}
        onCancel={() => setOpenModalRequireExtension(false)}
      ></ModalRequireExtension>
    </StyledContainer>
  );
}

export default ComplementaryProducts;
