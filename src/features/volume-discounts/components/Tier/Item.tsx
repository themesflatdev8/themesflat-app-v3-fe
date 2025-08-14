import { useState, useCallback } from "react";
import {
  Text,
  InlineGrid,
  InlineStack,
  TextField,
  BlockStack,
  Banner,
  Icon,
  Badge,
  Tag,
} from "@shopify/polaris";
import { InfoIcon, XIcon } from "@shopify/polaris-icons";
import { StyledItem, StyledItemClose } from "./styled-components";
import {
  StyledButtonGroup,
  StyledButton,
} from "@/styled-components/button-group";
import { Switch } from "@/components/core";
import { Controller } from "react-hook-form";
import { useAuthContext } from "@/features/auth/contexts";
import {
  getOnlyNumeric,
  getOnlyAmount,
  getOnlyPercent,
  formatOutputPrice,
  getOnlyDigit,
} from "@/utils/money";
import { copy } from "@/utils/lodash";
import {
  TIER_DETAIL_MSG_USE_DISCOUNT,
  TIER_DETAIL_MSG_NOT_USE_DISCOUNT,
} from "@/features/volume-discounts/constants";

type Props = {
  errors?: any;
  control?: any;
  watch?: any;
  setValue: any;
  clearErrors: any;
  index: number;
  setToast: any;
  onRemove: any;
};

function TierItem({
  errors,
  control,
  watch,
  setValue,
  clearErrors,
  index,
  setToast,
  onRemove,
}: Props) {
  const [{ store }]: any = useAuthContext();

  return (
    <StyledItem>
      {watch("tiers").length > 1 ? (
        <StyledItemClose onClick={() => onRemove(index)}>
          <Icon source={XIcon}></Icon>
        </StyledItemClose>
      ) : null}
      <BlockStack gap="300">
        <InlineGrid
          columns={{ xs: "1fr", md: "1fr 1fr" }}
          gap="300"
          alignItems="end"
        >
          <Controller
            name={`tiers.${index}.name`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Name"
                value={value}
                placeholder={`Single`}
                onChange={onChange}
                autoComplete="off"
                error={errors?.tiers?.[index]?.name?.message}
              ></TextField>
            )}
          />
          <BlockStack gap="100">
            <Controller
              name={`tiers.${index}.quantity`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Quantity"
                  value={value}
                  placeholder={`0`}
                  onChange={(val) => onChange(getOnlyDigit(val))}
                  onBlur={() => {
                    if (Number(value) <= 0) {
                      onChange(1);
                    }
                  }}
                  autoComplete="off"
                  error={errors?.tiers?.[index]?.quantity?.message}
                ></TextField>
              )}
            />
          </BlockStack>
        </InlineGrid>
        <BlockStack gap="300">
          <InlineStack gap="200" wrap={false}>
            <Controller
              name={`tiers.${index}.useDiscount`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Switch
                  checked={value}
                  onChange={(val: boolean) => {
                    onChange(val);
                    if (!val) {
                      setValue(
                        `tiers.${index}.message`,
                        TIER_DETAIL_MSG_NOT_USE_DISCOUNT
                      );
                    } else {
                      setValue(
                        `tiers.${index}.message`,
                        TIER_DETAIL_MSG_USE_DISCOUNT
                      );
                    }
                    clearErrors(`tiers.[${index}].discount_value`);
                  }}
                ></Switch>
              )}
            />
            <Text as="span" variant="bodyMd" fontWeight="medium">
              Discount
            </Text>
          </InlineStack>
        </BlockStack>
        {watch(`tiers.${index}.useDiscount`) ? (
          <InlineGrid
            columns={{ xs: "1fr", md: "1fr 1fr" }}
            gap="300"
            alignItems="end"
          >
            <Controller
              name={`tiers.${index}.discountType`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <StyledButtonGroup>
                  <StyledButton
                    active={"percent" == value}
                    onClick={() => {
                      onChange("percent");
                    }}
                  >
                    Percentage
                  </StyledButton>
                  <StyledButton
                    active={"amount" == value}
                    onClick={() => {
                      onChange("amount");
                    }}
                  >
                    Fixed amount
                  </StyledButton>
                </StyledButtonGroup>
              )}
            />
            {watch(`tiers.${index}.discountType`) == "percent" ? (
              <Controller
                name={`tiers.${index}.discountValue`}
                control={control}
                render={({
                  field: { onChange: onChangeValue, value: valueSub },
                }) => (
                  <TextField
                    label=""
                    labelHidden
                    type="text"
                    size="medium"
                    value={valueSub}
                    onChange={(val: string) =>
                      onChangeValue(getOnlyNumeric(`${val}`))
                    }
                    onBlur={() => {
                      let newVal = valueSub;
                      if (Number(getOnlyNumeric(valueSub)) > 100) {
                        newVal = `100`;
                      } else if (Number(getOnlyNumeric(valueSub)) < 0) {
                        newVal = `0`;
                      }
                      onChangeValue(getOnlyPercent(`${newVal}`));
                    }}
                    prefix={"%"}
                    placeholder="0.00"
                    autoComplete="off"
                    error={errors?.tiers?.[index]?.discountValue?.message}
                  />
                )}
              />
            ) : null}
            {watch(`tiers.${index}.discountType`) == "amount" ? (
              <Controller
                name={`tiers.${index}.discountValue`}
                control={control}
                render={({
                  field: { onChange: onChangeValue, value: valueSub },
                }) => (
                  <TextField
                    label=""
                    labelHidden
                    type="text"
                    size="medium"
                    value={valueSub}
                    onChange={(val: string) =>
                      onChangeValue(getOnlyAmount(`${val}`))
                    }
                    onBlur={() =>
                      onChangeValue(formatOutputPrice(`${valueSub}`))
                    }
                    prefix={store.currency}
                    placeholder="0.00"
                    autoComplete="off"
                    error={errors?.tiers?.[index]?.discountValue?.message}
                  />
                )}
              />
            ) : null}
          </InlineGrid>
        ) : null}
        <Controller
          name={`tiers.${index}.message`}
          control={control}
          render={({ field: { onChange, value } }) => (
            <InlineGrid gap="200">
              <TextField
                label="Message"
                value={value || ""}
                onChange={(val: string) => {
                  onChange(val);
                }}
                autoComplete="off"
                error={errors?.tiers?.[index]?.message?.message}
              />
              {watch(`tiers.${index}.useDiscount`) &&
              (!value?.includes("{quantity}") ||
                !value?.includes("{discount_value}")) ? (
                <InlineStack gap="200">
                  {!value?.includes("{quantity}") ? (
                    <Tag
                      onClick={() => {
                        onChange(`${value} {quantity}`);
                      }}
                    >{`quantity`}</Tag>
                  ) : null}
                  {!value?.includes("{quantity}") ? (
                    <Tag
                      onClick={() => {
                        onChange(`${value} {discount_value}`);
                      }}
                    >{`discount_value`}</Tag>
                  ) : null}
                </InlineStack>
              ) : null}
            </InlineGrid>
          )}
        />
      </BlockStack>
    </StyledItem>
  );
}

export default TierItem;
