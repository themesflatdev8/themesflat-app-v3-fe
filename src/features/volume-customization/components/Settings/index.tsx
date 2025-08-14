import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuthContext } from "@/features/auth/contexts";
import {
  Text,
  InlineGrid,
  TextField,
  InlineStack,
  Box,
  BlockStack,
  Card,
  Select,
  Button,
} from "@shopify/polaris";
import { WandIcon, ClockIcon } from "@shopify/polaris-icons";
import { Modal, Image } from "@/components/core";
import { StyledContainer, StyledView } from "./styled-components";
import { Controller } from "react-hook-form";
import { Switch, ColorPicker } from "@/components/core";
import { useCommonContext } from "@/contexts/common";
import { SelectOptionList } from "@/components/core";
import { getOnlyDigit } from "@/utils/money";
import {
  StyledButtonGroup,
  StyledButton,
} from "@/styled-components/button-group";

type Props = {
  control: any;
  watch: any;
  setValue: any;
  errors?: any;
  errorsServer?: any;
  isBlockFunc?: any;
};

const General = ({
  control,
  watch,
  setValue,
  errors,
  errorsServer,
  isBlockFunc,
}: Props) => {
  const [{ store }]: any = useAuthContext();

  const onInsertVariables = (type = "", value = "") => {
    setValue(type, `${watch(type)} ${value}`, { shouldDirty: true });
  };

  return (
    <StyledContainer className={`${isBlockFunc ? "lock-section" : ""}`}>
      <InlineGrid columns={1} gap="400">
        <BlockStack gap="400">
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
                name="title"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    label="Widget title"
                    value={value || ""}
                    onChange={(val: string) => {
                      onChange(val);
                    }}
                    autoComplete="off"
                    error={errorsServer.title || errors?.title?.message}
                  />
                )}
              />
              <Controller
                name="contentMostPopular"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    label="Most popular label"
                    value={value || ""}
                    onChange={(val: string) => {
                      onChange(val);
                    }}
                    autoComplete="off"
                    error={
                      errorsServer.contentMostPopular ||
                      errors?.contentMostPopular?.message
                    }
                  />
                )}
              />
              <Controller
                name="contentChooseVariantTitle"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    label="Choose variant title"
                    value={value || ""}
                    onChange={(val: string) => {
                      onChange(val);
                    }}
                    autoComplete="off"
                    error={
                      errorsServer.contentChooseVariantTitle ||
                      errors?.contentChooseVariantTitle?.message
                    }
                  />
                )}
              />
              <Controller
                name="contentChooseVariantButton"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    label="Choose variant button"
                    value={value || ""}
                    onChange={(val: string) => {
                      onChange(val);
                    }}
                    autoComplete="off"
                    error={
                      errorsServer.contentChooseVariantButton ||
                      errors?.contentChooseVariantButton?.message
                    }
                  />
                )}
              />
              <Controller
                name="contentAddToCartButton"
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
                      errorsServer.contentAddToCartButton ||
                      errors?.contentAddToCartButton?.message
                    }
                  />
                )}
              />
            </BlockStack>
          </Card>
          <Card padding="300">
            <Box paddingBlockEnd="300">
              <BlockStack gap="100">
                <Text as="span" variant="bodyMd" fontWeight="semibold">
                  Appearance
                </Text>
              </BlockStack>
            </Box>
            <BlockStack gap="300">
              <BlockStack gap="100">
                <Text as="span" variant="bodyMd">
                  Override
                </Text>
                <Controller
                  name="override"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <BlockStack gap="100">
                      {/* <Text as="span" variant="bodyMd">Override</Text> */}
                      <StyledButtonGroup>
                        <StyledButton
                          active={value == 1}
                          onClick={() => {
                            onChange(1);
                          }}
                        >
                          Yes
                        </StyledButton>
                        <StyledButton
                          active={value == 0}
                          onClick={() => {
                            onChange(0);
                          }}
                        >
                          No
                        </StyledButton>
                      </StyledButtonGroup>
                      <Text as="p" variant="bodyMd" tone="subdued">
                        Override Information product, including variants,
                        buttons,...
                      </Text>
                    </BlockStack>
                  )}
                />
              </BlockStack>
              <BlockStack gap="100">
                <Text as="span" variant="bodyMd">
                  Position
                </Text>
                <Controller
                  name="position"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      label="Position"
                      disabled={watch("override")}
                      labelHidden
                      options={[
                        { label: "Above", value: "above" },
                        { label: "Below", value: "below" },
                      ]}
                      value={value}
                      onChange={(val: any) => onChange(val)}
                      helpText={`The widget is located above or below the 'Add to cart' button on the product page.`}
                    ></Select>
                  )}
                />
              </BlockStack>
            </BlockStack>
          </Card>
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
                  name="cardBackgroundColor"
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
                  name="primaryColor"
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
                  name="secondaryColor"
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
                  name="borderColor"
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
                  name="outstandColor"
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
                  name="borderRadius"
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
                          errorsServer.border_radius ||
                          errors?.border_radius?.message
                        }
                      />
                    </InlineStack>
                  )}
                />
              </InlineGrid>
            </BlockStack>
          </Card>
        </BlockStack>
      </InlineGrid>
    </StyledContainer>
  );
};
export default General;
