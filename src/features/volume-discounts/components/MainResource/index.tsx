import { useState, useMemo, useCallback, useRef } from "react";
import {
  Button,
  Text,
  Icon,
  InlineGrid,
  Box,
  TextField,
  BlockStack,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { Loading, ModalConfirm } from "@/components/core";
import { StyledContainer, StyledContent } from "./styled-components";
import ModalAddProducts from "@/features/volume-discounts/components/ModalAddProduct";
import ModalRequireExtension from "@/components/shared/ModalRequireExtension";
import Information from "@/features/volume-discounts/components/Information";
import { clone, isEmpty } from "@/utils/lodash";
import { useCommonContext } from "@/contexts/common";
import { checkInstallExtension } from "@/utils/chrome-extension";
import { useAuthContext } from "@/features/auth/contexts";

type Props = {
  errors: any;
  control: any;
  watch: any;
  setValue: any;
  mainData: any;
  setMainData: Function;
};

function MainResource({
  errors,
  control,
  watch,
  setValue,
  mainData,
  setMainData,
}: Props) {
  const [modalAdd, setModalAdd] = useState({ open: false, keyword: "" });
  const [queryValueTemp, setQueryValueTemp] = useState("");

  const onAddProducts = (payload: any) => {
    let obj = payload.list && payload.list[0] ? payload.list[0] : null;
    if (obj) {
      setValue("product_id", String(obj.id), { shouldDirty: true });
      setMainData(obj);
    }
  };

  const checkExtensionAdd = (payload: any) => {
    setModalAdd((prev: any) => {
      return { open: true, keyword: payload.keyword || "" };
    });
  };

  return (
    <StyledContainer>
      <StyledContent>
        <InlineGrid columns={{ xs: 1, sm: mainData ? "1fr" : "1fr" }} gap="300">
          <BlockStack gap="100">
            <Text variant="bodyMd" as="h3" fontWeight="medium">
              Apply on product
            </Text>
            <TextField
              label=""
              labelHidden
              value={queryValueTemp}
              placeholder={"Search products"}
              autoComplete="off"
              onChange={(value) => {
                checkExtensionAdd({ keyword: value });
                setQueryValueTemp("");
              }}
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
                errors?.product_id?.message && !mainData
                  ? errors?.product_id.message
                  : ""
              }
            ></TextField>
          </BlockStack>
          {mainData && (
            <Information
              data={mainData}
              onRemove={() => {
                setValue("product_id", "", { shouldDirty: true });
                setMainData(null);
              }}
            />
          )}
        </InlineGrid>
      </StyledContent>

      {modalAdd.open ? (
        <ModalAddProducts
          open={modalAdd.open}
          selected={mainData ? [mainData] : []}
          onAdd={(payload: any) => onAddProducts(payload)}
          onClose={() =>
            setModalAdd((prev: any) => {
              return { open: false, keyword: "" };
            })
          }
          isMulti={false}
          title={"Add product"}
          keyword={modalAdd.keyword}
        ></ModalAddProducts>
      ) : null}
    </StyledContainer>
  );
}

export default MainResource;
