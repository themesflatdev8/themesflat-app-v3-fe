import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuthContext } from "@/features/auth/contexts";
import {
  Text,
  InlineGrid,
  TextField,
  RadioButton,
  Box,
  Card,
  RangeSlider,
  Icon,
  Select,
  BlockStack,
  InlineStack,
  Divider,
} from "@shopify/polaris";
import { WandIcon, ClockIcon } from "@shopify/polaris-icons";
import {
  StyledContainer,
  StyledInsertVariables,
  StyledRangeSlider,
} from "./styled-components";
import {
  StyledButtonGroup,
  StyledButton,
} from "@/styled-components/button-group";
import { Controller } from "react-hook-form";
import { Image, ColorPicker, Switch } from "@/components/core";
import { getOnlyDigit } from "@/utils/money";
import { PAGE_TYPE_CART } from "@/features/product-bundles/constants";

type Props = {
  theme: string;
  control: any;
  watch: any;
  setValue: any;
  errors?: any;
  errorsServer?: any;
  pageType?: string;
};

const General = ({
  theme,
  control,
  watch,
  setValue,
  errors,
  errorsServer,
  pageType,
}: Props) => {
  const [{ store }]: any = useAuthContext();

  const onInsertVariables = (type = "", value = "") => {
    setValue(type, `${watch(type)} ${value}`, { shouldDirty: true });
  };

  const isPageTypeCart = useMemo(() => {
    return pageType == PAGE_TYPE_CART;
  }, [pageType]);

  return (
    <StyledContainer>
      <BlockStack gap="400">
        <BlockStack gap="400">
          <Controller
            name={`${theme}.themeName`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Theme name"
                value={value || ""}
                onChange={(val: string) => {
                  onChange(val);
                }}
                placeholder="Enter theme name"
                autoComplete="off"
                error={
                  errorsServer[`${theme}.themeName`] ||
                  errors?.[`${theme}.themeName`]?.message
                }
              />
            )}
          />
          <Card padding="300">
            <Box paddingBlockEnd="200">
              <BlockStack gap="100">
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Templates
                </Text>
              </BlockStack>
            </Box>
            <BlockStack gap="300">
              <Controller
                name={`${theme}.template`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <BlockStack gap="200">
                    <RadioButton
                      label="Slider"
                      checked={value == "1"}
                      id="slider"
                      name="template"
                      onChange={() => onChange("1")}
                    />
                    <RadioButton
                      label="Popular"
                      id="popular"
                      name="template"
                      checked={value == "2"}
                      onChange={() => onChange("2")}
                    />
                    <RadioButton
                      label="Amazon"
                      id="amazon"
                      name="template"
                      checked={value == "3"}
                      onChange={() => onChange("3")}
                    />
                    <RadioButton
                      label="Classic"
                      id="classic"
                      name="template"
                      checked={value == "4"}
                      onChange={() => onChange("4")}
                    />
                  </BlockStack>
                )}
              />
            </BlockStack>
          </Card>
          <Card padding="300">
            <Box paddingBlockEnd="200">
              <BlockStack gap="100">
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Content
                </Text>
              </BlockStack>
            </Box>
            <BlockStack gap="300">
              <Controller
                name={`${theme}.title`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    label="Widget title"
                    value={value || ""}
                    onChange={(val: string) => {
                      onChange(val);
                    }}
                    autoComplete="off"
                    error={
                      errorsServer[`${theme}.title`] ||
                      errors?.[`${theme}.title`]?.message
                    }
                  />
                )}
              />
              <Controller
                name={`${theme}.subTitle`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    label="Widget subtitle"
                    value={value || ""}
                    onChange={(val: string) => {
                      onChange(val);
                    }}
                    autoComplete="off"
                    error={
                      errorsServer[`${theme}.subTitle`] ||
                      errors?.[`${theme}.subTitle`]?.message
                    }
                  />
                )}
              />
              <InlineGrid
                columns={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                gap="400"
              >
                <Controller
                  name={`${theme}.contentTotal`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      label="Total"
                      value={value || ""}
                      onChange={(val: string) => {
                        onChange(val);
                      }}
                      autoComplete="off"
                      error={
                        errorsServer[`${theme}.contentTotal`] ||
                        errors?.[`${theme}.contentTotal`]?.message
                      }
                    />
                  )}
                />
                <Controller
                  name={`${theme}.contentSave`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      label="Save"
                      value={value || ""}
                      onChange={(val: string) => {
                        onChange(val);
                      }}
                      autoComplete="off"
                      error={
                        errorsServer[`${theme}.contentSave`] ||
                        errors?.[`${theme}.contentSave`]?.message
                      }
                    />
                  )}
                />
              </InlineGrid>
              <Controller
                name={`${theme}.contentAddToCartButton`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    label="Add to cart button"
                    value={value || ""}
                    onChange={(val: string) => {
                      onChange(val);
                    }}
                    autoComplete="off"
                    error={
                      errorsServer[`${theme}.contentAddToCartButton`] ||
                      errors?.[`${theme}.contentAddToCartButton`]?.message
                    }
                  />
                )}
              />
            </BlockStack>
          </Card>
          {/* <Card padding="300">
            <Box paddingBlockEnd="200">
              <BlockStack gap="100">
                <Text as="span" variant="bodyMd" fontWeight="semibold">Display</Text>
              </BlockStack>
            </Box>
            <BlockStack gap="300">
              <Controller
                name={`${theme}.useQuantity`}
                control={control}
                render={({ field: { onChange, value } }) =>
                  <BlockStack gap="100">
                    <Text as="span" variant="bodyMd">Show Quantity</Text>
                    <StyledButtonGroup>
                      <StyledButton
                        active={value == 1}
                        onClick={() => {
                          onChange(1)
                        }}
                      >
                        Yes
                      </StyledButton>
                      <StyledButton
                        active={value == 0}
                        onClick={() => {
                          onChange(0)
                        }}
                      >
                        No
                      </StyledButton>
                    </StyledButtonGroup>
                  </BlockStack>
                }
              />
            </BlockStack>
          </Card> */}
          <Card padding="300">
            <Box paddingBlockEnd="200">
              <BlockStack gap="100">
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Style
                </Text>
              </BlockStack>
            </Box>
            <BlockStack gap="400">
              <InlineGrid
                columns={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                gap="400"
              >
                <Controller
                  name={`${theme}.cardBackgroundColor`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <ColorPicker
                      allowInput={true}
                      allowAlpha={true}
                      label={"Card background color"}
                      value={value}
                      onChange={(val: any) => onChange(val)}
                    />
                  )}
                />
                <Controller
                  name={`${theme}.primaryColor`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <ColorPicker
                      allowInput={true}
                      allowAlpha={true}
                      label={"Primary color"}
                      value={value}
                      onChange={(val: any) => onChange(val)}
                    />
                  )}
                />
                <Controller
                  name={`${theme}.secondaryColor`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <ColorPicker
                      allowInput={true}
                      allowAlpha={true}
                      label={"Secondary color"}
                      value={value}
                      onChange={(val: any) => onChange(val)}
                    />
                  )}
                />
                <Controller
                  name={`${theme}.borderColor`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <ColorPicker
                      allowInput={true}
                      allowAlpha={true}
                      label={"Border color"}
                      value={value}
                      onChange={(val: any) => onChange(val)}
                    />
                  )}
                />
                <Controller
                  name={`${theme}.outstandColor`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <ColorPicker
                      allowInput={true}
                      allowAlpha={true}
                      label={"Outstand color"}
                      value={value}
                      onChange={(val: any) => onChange(val)}
                    />
                  )}
                />
                <Controller
                  name={`${theme}.borderRadius`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <InlineStack wrap={false} gap="200" blockAlign="end">
                      <TextField
                        label="Border radius"
                        type="text"
                        min={0}
                        max={100}
                        value={value}
                        onChange={(val) => {
                          onChange(getOnlyDigit(val));
                        }}
                        onBlur={() => {
                          if (value == "") {
                            onChange(0);
                          } else if (value > 100) {
                            onChange(100);
                          } else if (value < 0) {
                            onChange(0);
                          }
                        }}
                        suffix="px"
                        autoComplete="off"
                        error={
                          errorsServer[`${theme}.borderRadius`] ||
                          errors?.[`${theme}.borderRadius`]?.message
                        }
                      />
                    </InlineStack>
                  )}
                />
              </InlineGrid>
              <Controller
                name={`${theme}.imageFit`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <BlockStack gap="100">
                    <Text as="span" variant="bodyMd">
                      Image fit
                    </Text>
                    <StyledButtonGroup>
                      <StyledButton
                        active={value == "contain"}
                        onClick={() => {
                          onChange("contain");
                        }}
                      >
                        Contain
                      </StyledButton>
                      <StyledButton
                        active={value == "cover"}
                        onClick={() => {
                          onChange("cover");
                        }}
                      >
                        Cover
                      </StyledButton>
                    </StyledButtonGroup>
                  </BlockStack>
                )}
              />
            </BlockStack>
          </Card>
        </BlockStack>
      </BlockStack>
    </StyledContainer>
  );
};
export default General;
