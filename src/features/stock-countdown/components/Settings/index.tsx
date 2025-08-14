import { useState, useCallback } from "react";
import { ReactSortable } from "react-sortablejs";
import { useAuthContext } from "@/features/auth/contexts";
import {
  Text,
  TextField,
  Box,
  Card,
  Link,
  BlockStack,
  RadioButton,
  InlineStack,
  InlineGrid,
  Tag,
} from "@shopify/polaris";
import { ColorPicker } from "@/components/core"
import {
  StyledContainer,
} from "./styled-components";
import { Controller } from "react-hook-form";
import { getOnlyDigit } from "@/utils/money";
import { copy } from "@/utils/lodash";

type Props = {
  form: any;
  control: any;
  setValue: any;
  errors?: any;
};

const General = ({
  form,
  control,
  setValue,
  errors,
}: Props) => {
  const [{ store }]: any = useAuthContext();

  const insertVariables = (text: string) => {
    setValue("text", `${form.text} ${text}`, { shouldDirty: true });
    copy(text);
  }

  return (
    <StyledContainer>
      <BlockStack gap="300">
        <Card>
          <Box paddingBlockEnd="300">
            <BlockStack gap="100">
              <Text as="h3" variant="headingMd">
                Settings
              </Text>
            </BlockStack>
          </Box>
          <BlockStack gap="300">
            <Card padding="300">
              <BlockStack gap="300">
                <Text as="h4" variant="headingSm">
                  When it shows
                </Text>
                <BlockStack gap="200">
                  <Controller
                    name={`condition`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <BlockStack gap="100">
                        <RadioButton
                          checked={value == "always"}
                          label="Always"
                          onChange={() => onChange("always")}
                        ></RadioButton>
                        <RadioButton
                          checked={value == "stock_quantity"}
                          label="Show if stock quantity is equal or less than"
                          onChange={() => onChange("stock_quantity")}
                          helpText={value == "stock_quantity" ? (
                            <Controller
                              name={`conditionStock`}
                              control={control}
                              render={({ field: { onChange: onChangeStockQuantity, value: valueStockQuantity } }) => (
                                <TextField
                                  label="Stock quantity"
                                  labelHidden
                                  type="number"
                                  value={valueStockQuantity || ""}
                                  onChange={(val) => {
                                    onChangeStockQuantity(val);
                                  }}
                                  autoComplete="off"
                                  prefix="minutes"
                                  error={
                                    errors?.conditionStock?.message
                                  }
                                />
                              )}
                            />
                          ) : undefined}
                        ></RadioButton>
                      </BlockStack>
                    )}
                  />
                </BlockStack>
              </BlockStack>
            </Card>
            <Card padding="300">
              <BlockStack gap="100">
                <Text as="h4" variant="headingSm">
                  Announcement text
                </Text>
                <BlockStack gap="200">
                  <Controller
                    name={`text`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        label="Announcement text"
                        labelHidden
                        value={value || ""}
                        onChange={(val) => {
                          onChange(val);
                        }}
                        autoComplete="off"
                        clearButton
                        onClearButtonClick={() => onChange("")}
                        multiline={3}
                        error={
                          errors?.text?.message
                        }
                      />
                    )}
                  />
                  <InlineStack gap="200" wrap={false}>
                    <Text as="span" variant="bodyMd">Variables</Text>
                    <InlineStack gap="200">
                      <Tag onClick={() => insertVariables(`{stock_quantity}`)}>{`{stock_quantity}`}</Tag>
                    </InlineStack>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </Card>
        <Card>
          <Box paddingBlockEnd="300">
            <BlockStack gap="100">
              <Text as="h3" variant="headingMd">
                Appearance
              </Text>
            </BlockStack>
          </Box>
          <BlockStack gap="300">
            <Card padding="300">
              <Box paddingBlockEnd="300">
                <BlockStack gap="100">
                  <Text as="h4" variant="headingSm">
                    Template
                  </Text>
                </BlockStack>
              </Box>
              <Controller
                name={`template`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <BlockStack gap="200">
                    <RadioButton
                      checked={value == "default"}
                      label="Default"
                      onChange={() => onChange("default")}
                    ></RadioButton>
                    <RadioButton
                      checked={value == "comfortable"}
                      label="Comfortable"
                      onChange={() => onChange("comfortable")}
                    ></RadioButton>
                  </BlockStack>
                )}
              />
            </Card>
            <Card padding="300">
              <Box paddingBlockEnd="300">
                <BlockStack gap="100">
                  <Text as="h4" variant="headingSm">
                    Color
                  </Text>
                </BlockStack>
              </Box>
              <BlockStack gap="300">
                <InlineGrid 
                  columns={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                  gap="300"
                >
                  <Controller
                    name={`backgroundColor`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <ColorPicker
                        allowInput={true}
                        allowAlpha={true}
                        label={"Background color"}
                        value={value}
                        disabled={form.template == "inline"}
                        onChange={(val: any) => onChange(val)}
                      />
                    )}
                  />
                  <Controller
                    name={`borderColor`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <ColorPicker
                        allowInput={true}
                        allowAlpha={true}
                        label={"Border color"}
                        value={value}
                        disabled={form.template == "inline"}
                        onChange={(val: any) => onChange(val)}
                      />
                    )}
                  />
                  <Controller
                    name={`textColor`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <ColorPicker
                        allowInput={true}
                        allowAlpha={true}
                        label={"Text color"}
                        value={value}
                        onChange={(val: any) => onChange(val)}
                      />
                    )}
                  />
                </InlineGrid>
              </BlockStack>
            </Card>
            <Card padding="300">
              <Box paddingBlockEnd="200">
                <BlockStack gap="100">
                  <Text as="h4" variant="headingSm">
                  Position
                  </Text>
                </BlockStack>
              </Box>
              <BlockStack gap="200">
                <Text variant="bodyMd" as="p">Choose a placement where customers can access the information they may need to make an informed purchase decision</Text>
                <Link>Learn how to custom position on Product page</Link>
              </BlockStack>
            </Card>
          </BlockStack>
        </Card>
      </BlockStack>
    </StyledContainer>
  );
};
export default General;
