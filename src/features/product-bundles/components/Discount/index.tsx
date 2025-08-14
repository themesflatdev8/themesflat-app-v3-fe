import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import {
  Text,
  Card,
  InlineGrid,
  InlineStack,
  TextField,
  Box,
  Button,
  Banner,
  Link,
  Checkbox,
  RadioButton,
  List,
  BlockStack,
  Select,
  Badge,
  Tag,
} from "@shopify/polaris";
import { StyledContainer, StyledCardDiscount } from "./styled-components";
import { Switch, SelectOptionList } from "@/components/core";
import {
  StyledButtonGroup,
  StyledButton,
} from "@/styled-components/button-group";
import SearchProducts from "@/features/product-bundles/components/SearchProducts";
import { Controller } from "react-hook-form";
import { useAuthContext } from "@/features/auth/contexts";
import {
  getOnlyNumeric,
  getOnlyAmount,
  getOnlyPercent,
  formatOutputPrice,
} from "@/utils/money";
import _routes from "@/constants/routes";
import {
  DISCOUNT_CONTENT_AMOUNT,
  DISCOUNT_CONTENT_FREESHIPING,
} from "@/features/product-bundles/constants";
import CountdownTimer from "@/features/product-bundles/components/CountdownTimer";

type Props = {
  errors?: any;
  control?: any;
  errorsServer?: any;
  watch: any;
  setValue: any;
  clearErrors: any;
};

function Discount({
  errors,
  errorsServer,
  control,
  watch,
  setValue,
  clearErrors,
}: Props) {
  const router = useRouter();
  const [{ store }]: any = useAuthContext();

  const openUrlAdmin = useCallback((path: string) => {
    window.open(`shopify://admin${path}`, "_blank");
  }, []);

  const onInsertVariables = (type = "", value = "") => {
    setValue(type, `${watch(type)} ${value}`, { shouldDirty: true });
  };

  return (
    <StyledContainer>
      <Card padding="500">
        <BlockStack gap="400">
          <InlineStack gap="200" blockAlign="start" wrap={false}>
            <Controller
              name="useDiscount"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Switch
                  checked={value}
                  onChange={(val: boolean) => {
                    onChange(val);
                  }}
                ></Switch>
              )}
            />
            <BlockStack gap="100">
              <Text as="span" variant="bodyMd" fontWeight="semibold">
                Discount
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Put a promotion for this bundle
              </Text>
            </BlockStack>
          </InlineStack>
          {watch("useDiscount") ? (
            <BlockStack gap="400">
              <Banner tone="warning" title="IMPORTANT NOTE:">
                <div style={{ marginLeft: "-16px", marginTop: "4px" }}>
                  <List type="number">
                    <List.Item>
                      Discount codes will be created randomly with the pattern
                      MS_*****. Please do not alter the code directly on Shopify
                      to avoid checkout issues.
                    </List.Item>
                    <List.Item>
                      If you deactivate the widget, turn off our app embed, or
                      uninstall the app, you will need to manage any existing
                      discount codes starting with MS_***** yourself to prevent
                      potential financial issues.
                    </List.Item>
                  </List>
                </div>
              </Banner>
              <div>
                <BlockStack gap="400">
                  <BlockStack gap="100">
                    <Text as="span" variant="bodyMd" fontWeight="medium">
                      Minimum purchase amount
                    </Text>
                    <Controller
                      name="minimumAmount"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <TextField
                          label="Minimum purchase amount"
                          labelHidden
                          type="text"
                          value={value}
                          onChange={(val: string) =>
                            onChange(getOnlyAmount(`${val}`))
                          }
                          onBlur={() => onChange(formatOutputPrice(`${value}`))}
                          prefix={store.currency}
                          autoComplete="off"
                          placeholder="0.00"
                          error={
                            errorsServer.minimumAmount ||
                            errors?.minimumAmount?.message
                          }
                        />
                      )}
                    />
                  </BlockStack>
                  <BlockStack gap="300">
                    <BlockStack gap="100">
                      <Text as="p" variant="bodyMd" fontWeight="medium">
                        Discount type
                      </Text>
                      <Controller
                        name="promotionType"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <StyledButtonGroup>
                            <StyledButton
                              active={"discount" == value}
                              onClick={() => {
                                onChange("discount");
                                clearErrors([
                                  "discountContent",
                                  "discountFreeshipContent",
                                ]);
                              }}
                            >
                              Amount off products
                            </StyledButton>
                            <StyledButton
                              active={"freeship" == value}
                              onClick={() => {
                                onChange("freeship");
                                clearErrors([
                                  "discountContent",
                                  "discountFreeshipContent",
                                ]);
                              }}
                            >
                              Free shipping
                            </StyledButton>
                          </StyledButtonGroup>
                        )}
                      />
                    </BlockStack>
                    {watch("promotionType") == "freeship" ? (
                      <BlockStack gap="300">
                        <BlockStack gap="100">
                          <Text as="span" variant="bodyMd" fontWeight="medium">
                            Discount content
                          </Text>
                          <Controller
                            name="discountFreeshipContent"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <TextField
                                label="Discount content"
                                labelHidden
                                value={value || ""}
                                onChange={(val: string) => {
                                  onChange(val);
                                }}
                                multiline={1}
                                autoComplete="off"
                                error={
                                  errorsServer.discountFreeshipContent ||
                                  errors?.discountFreeshipContent?.message
                                }
                              />
                            )}
                          />
                          {!watch("discountFreeshipContent")?.includes(
                            "{minimum_bundle_amount}"
                          ) ? (
                            <InlineStack>
                              {!watch("discountFreeshipContent")?.includes(
                                "{minimum_bundle_amount}"
                              ) ? (
                                <Tag
                                  onClick={() =>
                                    onInsertVariables(
                                      "discountFreeshipContent",
                                      `{minimum_bundle_amount}`
                                    )
                                  }
                                >{`minimum_bundle_amount`}</Tag>
                              ) : null}
                            </InlineStack>
                          ) : null}
                        </BlockStack>
                      </BlockStack>
                    ) : null}
                    {watch("promotionType") == "discount" ? (
                      <BlockStack gap="300">
                        <BlockStack gap="100">
                          <Text as="span" variant="bodyMd" fontWeight="medium">
                            Discount value
                          </Text>
                          <Controller
                            name="discountValue"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Controller
                                name="discountType"
                                control={control}
                                render={({
                                  field: {
                                    onChange: onChangeType,
                                    value: valueType,
                                  },
                                }) => (
                                  <InlineGrid
                                    columns={{ xs: "1fr", md: "5fr 3fr" }}
                                    gap="300"
                                    alignItems="end"
                                  >
                                    <Select
                                      value={valueType}
                                      label="Discount value"
                                      labelHidden
                                      onChange={(val) => {
                                        onChangeType(val);
                                        setValue("value", "");
                                        clearErrors(`value`);
                                      }}
                                      options={[
                                        {
                                          value: "percent",
                                          label: "Percentage",
                                        },
                                        {
                                          value: "amount",
                                          label: "Fixed amount",
                                        },
                                      ]}
                                    />
                                    <TextField
                                      label="Discount value"
                                      labelHidden
                                      type="text"
                                      value={value}
                                      onChange={(val) => {
                                        if (valueType == "percent") {
                                          onChange(getOnlyNumeric(`${val}`));
                                        } else {
                                          onChange(getOnlyAmount(`${val}`));
                                        }
                                      }}
                                      onBlur={() => {
                                        if (valueType == "percent") {
                                          let newVal = value;
                                          if (
                                            Number(getOnlyNumeric(value)) > 100
                                          ) {
                                            newVal = `100`;
                                          } else if (
                                            Number(getOnlyNumeric(value)) < 0
                                          ) {
                                            newVal = `0`;
                                          }
                                          onChange(getOnlyPercent(`${newVal}`));
                                        } else {
                                          onChange(
                                            formatOutputPrice(`${value}`)
                                          );
                                        }
                                      }}
                                      placeholder="0.00"
                                      autoComplete="off"
                                      error={
                                        errorsServer.discountValue ||
                                        errors?.discountValue?.message
                                      }
                                      prefix={
                                        valueType == "percent"
                                          ? "%"
                                          : store.currency
                                      }
                                    />
                                  </InlineGrid>
                                )}
                              />
                            )}
                          />
                          {watch("type") == "amount" ? (
                            <Controller
                              name="discountOncePer"
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <Checkbox
                                  label={
                                    "Only apply discount once per bundle. If not selected, the amount will be taken of all products in a bundle."
                                  }
                                  checked={value}
                                  onChange={() => onChange(!value)}
                                />
                              )}
                            />
                          ) : null}
                        </BlockStack>
                        <BlockStack gap="100">
                          <Text as="span" variant="bodyMd" fontWeight="medium">
                            Discount content
                          </Text>
                          <Controller
                            name="discountContent"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <TextField
                                label="Discount content"
                                labelHidden
                                value={value || ""}
                                onChange={(val: string) => {
                                  onChange(val);
                                }}
                                multiline={1}
                                autoComplete="off"
                                error={
                                  errorsServer.discountContent ||
                                  errors?.discountContent?.message
                                }
                              />
                            )}
                          />
                          {!watch("discountContent")?.includes(
                            "{minimum_bundle_amount}"
                          ) ||
                          !watch("discountContent")?.includes(
                            "{discount_value}"
                          ) ? (
                            <InlineStack>
                              {!watch("discountContent")?.includes(
                                "{minimum_bundle_amount}"
                              ) ? (
                                <Tag
                                  onClick={() =>
                                    onInsertVariables(
                                      "discountContent",
                                      `{minimum_bundle_amount}`
                                    )
                                  }
                                >{`minimum_bundle_amount`}</Tag>
                              ) : null}
                              {!watch("discountContent")?.includes(
                                "{discount_value}"
                              ) ? (
                                <Tag
                                  onClick={() =>
                                    onInsertVariables(
                                      "discountContent",
                                      `{discount_value}`
                                    )
                                  }
                                >{`discount_value`}</Tag>
                              ) : null}
                            </InlineStack>
                          ) : null}
                        </BlockStack>
                      </BlockStack>
                    ) : null}
                  </BlockStack>

                  {watch("promotionType") == "gift" ? (
                    <StyledCardDiscount>
                      <InlineGrid gap={"400"}>
                        <InlineGrid columns={1}>
                          <Controller
                            name="gift_product"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <SearchProducts
                                selected={value || null}
                                onChange={onChange}
                                productCurrent={null}
                              ></SearchProducts>
                            )}
                          />
                        </InlineGrid>
                        <InlineGrid gap="300">
                          <Text
                            variant="bodyMd"
                            as="span"
                            fontWeight="semibold"
                          >
                            At a discounted value
                          </Text>
                          <Controller
                            name="gift_type"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <InlineGrid
                                gap="200"
                                columns={1}
                                alignItems="start"
                              >
                                <InlineGrid gap="300">
                                  <RadioButton
                                    label="Percentage"
                                    id="gift-type-percentage"
                                    name="gift_type"
                                    checked={value == "percent"}
                                    onChange={() => onChange("percent")}
                                    helpText={
                                      value == "percent" ? (
                                        <Controller
                                          name="gift_value"
                                          control={control}
                                          render={({
                                            field: { onChange, value },
                                          }) => (
                                            <TextField
                                              label=""
                                              labelHidden
                                              type="text"
                                              value={value}
                                              onChange={(val: string) =>
                                                onChange(
                                                  getOnlyNumeric(`${val}`)
                                                )
                                              }
                                              onBlur={() => {
                                                let newVal = value;
                                                if (
                                                  watch("gift_type") ==
                                                  "percent"
                                                ) {
                                                  if (
                                                    Number(
                                                      getOnlyNumeric(value)
                                                    ) > 100
                                                  ) {
                                                    newVal = `100`;
                                                  } else if (
                                                    Number(
                                                      getOnlyNumeric(value)
                                                    ) < 0
                                                  ) {
                                                    newVal = `0`;
                                                  }
                                                }
                                                onChange(
                                                  getOnlyPercent(`${newVal}`)
                                                );
                                              }}
                                              prefix={"%"}
                                              placeholder="0.00"
                                              autoComplete="off"
                                              error={
                                                errorsServer.giftValue ||
                                                errors?.giftValue?.message
                                              }
                                            />
                                          )}
                                        />
                                      ) : null
                                    }
                                  />
                                </InlineGrid>
                                <InlineGrid gap="300">
                                  <RadioButton
                                    label="Amount off each"
                                    id="gift-type-amount"
                                    name="gift_type"
                                    checked={value == "amount"}
                                    onChange={() => onChange("amount")}
                                    helpText={
                                      value == "amount" ? (
                                        <Controller
                                          name="gift_value"
                                          control={control}
                                          render={({
                                            field: { onChange, value },
                                          }) => (
                                            <TextField
                                              label=""
                                              labelHidden
                                              type="text"
                                              value={value}
                                              onChange={(val: string) =>
                                                onChange(
                                                  getOnlyAmount(`${val}`)
                                                )
                                              }
                                              onBlur={() =>
                                                onChange(
                                                  formatOutputPrice(`${value}`)
                                                )
                                              }
                                              prefix={store.currency}
                                              placeholder="0.00"
                                              helpText="For multiple quantities, the discount amount will be taken off each Y item."
                                              autoComplete="off"
                                              error={
                                                errorsServer.giftValue ||
                                                errors?.giftValue?.message
                                              }
                                            />
                                          )}
                                        />
                                      ) : null
                                    }
                                  />
                                </InlineGrid>
                                <InlineGrid gap="300">
                                  <RadioButton
                                    label="Total free"
                                    id="gift-type-free"
                                    name="gift_type"
                                    checked={value == "free"}
                                    onChange={() => onChange("free")}
                                  />
                                </InlineGrid>
                              </InlineGrid>
                            )}
                          />
                        </InlineGrid>
                      </InlineGrid>
                    </StyledCardDiscount>
                  ) : null}
                  <CountdownTimer
                    errors={errors}
                    errorsServer={errorsServer}
                    control={control}
                    watch={watch}
                  />
                </BlockStack>
              </div>
            </BlockStack>
          ) : null}
        </BlockStack>
      </Card>
    </StyledContainer>
  );
}

export default Discount;
