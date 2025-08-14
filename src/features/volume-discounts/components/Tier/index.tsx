import { useState, useCallback } from "react";
import { useFieldArray } from "react-hook-form";
import {
  Text,
  Card,
  Icon,
  InlineStack,
  Button,
  BlockStack,
} from "@shopify/polaris";
import { PlusIcon, XSmallIcon } from "@shopify/polaris-icons";
import { StyledContainer } from "./styled-components";
import TiterItem from "@/features/volume-discounts/components/Tier/Item";
import _routes from "@/constants/routes";
import { _formDefault } from "@/features/volume-discounts/constants";
import { clone } from "@/utils/lodash";

type Props = {
  errors?: any;
  control?: any;
  watch?: any;
  setValue: any;
  clearErrors: any;
  setToast: any;
};

function Tier({
  errors,
  control,
  watch,
  clearErrors,
  setValue,
  setToast,
}: Props) {
  const { fields, remove, append, update } = useFieldArray({
    control,
    name: "tiers",
  });

  const onRemove = (index: any) => {
    if (index < 0) return;
    remove(index);
  };

  const onAppend = (fields: any) => {
    let quantity = 1;
    let objDefault = clone(_formDefault.tiers[0]);
    fields.forEach((item: any) => {
      if (item.quantity > quantity) {
        quantity = item.quantity;
      }
    });
    let name =
      fields.length == 1
        ? "Double"
        : fields.length == 2
          ? "Triple"
          : fields.length == 3
            ? "Quadruple"
            : "Quintuple";
    append({ ...objDefault, name, quantity: String(Number(quantity) + 1) });
  };

  return (
    <StyledContainer>
      <Card>
        <BlockStack gap="300">
          <InlineStack gap="300" align="space-between">
            <Text variant="bodyMd" as="span" fontWeight="medium">
              Tiers
            </Text>
            {fields.length < 5 && (
              <Button variant="plain" onClick={() => onAppend(fields)}>
                Add another tier
              </Button>
            )}
          </InlineStack>
          <BlockStack gap="300">
            {fields.map((field: any, index: number) => {
              return (
                <Card key={index} background="bg-fill-secondary">
                  <TiterItem
                    index={index}
                    errors={errors}
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    setToast={setToast}
                    onRemove={onRemove}
                  ></TiterItem>
                </Card>
              );
            })}
          </BlockStack>
        </BlockStack>
      </Card>
    </StyledContainer>
  );
}

export default Tier;
