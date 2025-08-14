import { useState, useCallback } from "react";
import { ReactSortable } from "react-sortablejs";
import { useAuthContext } from "@/features/auth/contexts";
import {
  Text,
  TextField,
  Box,
  Card,
  RangeSlider,
  BlockStack,
  RadioButton,
  Icon,
  InlineStack,
  InlineGrid,
  Tag,
} from "@shopify/polaris";
import { DragHandleIcon } from "@shopify/polaris-icons";
import { Tabs, Switch, SelectOptionList, ComboBoxSelect, ColorPicker } from "@/components/core"
import {
  StyledContainer,
  StyledRangeSlider,
} from "./styled-components";
import { Controller } from "react-hook-form";
import { getOnlyDigit } from "@/utils/money";
import { isEqual } from "@/utils/lodash";
import { getImgFromServer } from "@/utils/cdn";
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
  const [tab, setTab] = useState("desktop");

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
              <BlockStack gap="100">
                <Text as="h4" variant="headingSm">
                  Show random orders from the past
                </Text>
                <Controller
                  name="lastOrders"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SelectOptionList
                      options={[
                        {label: "Today", value: 0},
                        {label: "Yesterday", value: 1},
                        {label: "Last 7 days", value: 7},
                        {label: "Last 30 days", value: 30},
                        {label: "Last 60 days", value: 60},
                      ]}
                      value={value}
                      onChange={(val: any) => onChange(Number(String(val)))}
                    ></SelectOptionList>
                  )}
                />
              </BlockStack>
            </Card>
            <Card padding="300">
              <BlockStack gap="300">
                <Text as="h4" variant="headingSm">
                  Order status display
                </Text>
                <Controller
                  name={`statusDisplayOrder`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <BlockStack gap="200">
                      <RadioButton
                        checked={value == "all"}
                        label="Open & Archived"
                        onChange={() => onChange("all")}
                      ></RadioButton>
                      <RadioButton
                        checked={value == "open"}
                        label="Open only"
                        onChange={() => onChange("open")}
                      ></RadioButton>
                      <RadioButton
                        checked={value == "archived"}
                        label="Archived only"
                        onChange={() => onChange("archived")}
                      ></RadioButton>
                    </BlockStack>
                  )}
                />
              </BlockStack>
            </Card>
            <Card padding="300">
              <BlockStack gap="100">
                <Text as="h4" variant="headingSm">
                  Sales pop up text
                </Text>
                <BlockStack gap="200">
                  <Controller
                    name={`text`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        label="Sales pop up text"
                        labelHidden
                        value={value || ""}
                        onChange={(val) => {
                          onChange(val);
                        }}
                        autoComplete="off"
                        clearButton
                        onClearButtonClick={() => onChange("")}
                        multiline={5}
                        error={
                          errors?.text?.message
                        }
                      />
                    )}
                  />
                  <InlineStack gap="200" wrap={false}>
                    {/* <Text as="span" variant="bodyMd">Variables</Text> */}
                    <InlineStack gap="200">
                      <Tag onClick={() => insertVariables(`{customer_full_name}`)}>{`{customer_full_name}`}</Tag>
                      <Tag onClick={() => insertVariables(`{customer_first_name}`)}>{`{customer_first_name}`}</Tag>
                      <Tag onClick={() => insertVariables(`{customer_last_name}`)}>{`{customer_last_name}`}</Tag>
                      <Tag onClick={() => insertVariables(`{city}`)}>{`{city}`}</Tag>
                      <Tag onClick={() => insertVariables(`{country_code}`)}>{`{country_code}`}</Tag>
                      <Tag onClick={() => insertVariables(`{product_name}`)}>{`{product_name}`}</Tag>
                      <Tag onClick={() => insertVariables(`{time_ago}`)}>{`{time_ago}`}</Tag>
                    </InlineStack>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>
            <Card padding="300">
              <BlockStack gap="300">
                <Text as="h4" variant="headingSm">
                  placement
                </Text>
                <Controller
                  name={`placement`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <BlockStack gap="200">
                      <RadioButton
                        checked={value == "all"}
                        label="Show on all pages"
                        onChange={() => onChange("all")}
                      ></RadioButton>
                      <RadioButton
                        checked={value == "specific"}
                        label="Show on specific pages"
                        onChange={() => onChange("specific")}
                        helpText={value == "specific" ? (
                          <Box paddingBlockStart="100">
                            <Controller
                              name={`specific_pages`}
                              control={control}
                              render={({ field: { onChange: onChangeSpecific, value: valueSpecific } }) => (
                                <ComboBoxSelect 
                                  value={valueSpecific}
                                  options={[
                                    {
                                      label: "Home page",
                                      value: "index",
                                    },
                                    {
                                      label: "Product pages",
                                      value: "product",
                                    },
                                    {
                                      label: "Collection list page",
                                      value: "collection_list",
                                    },
                                    {
                                      label: "Collection pages",
                                      value: "collection",
                                    },
                                    {
                                      label: "Cart page",
                                      value: "cart",
                                    },
                                  ]}
                                  onChange={onChangeSpecific}
                                  placeholder="Select pages"
                                />
                              )}
                            />
                          </Box>
                        ) : undefined }
                      ></RadioButton>
                    </BlockStack>
                  )}
                />
              </BlockStack>
            </Card>
            <Card padding="300">
              <BlockStack gap="100">
                <Text as="h4" variant="headingSm">
                  Timing
                </Text>
                <BlockStack gap="200">
                  <Controller
                    name={`timingFirst`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        label="When a visitor enters your store, trigger the first pop-up after"
                        value={value || ""}
                        onChange={(val) => {
                          onChange(val);
                        }}
                        autoComplete="off"
                        suffix="seconds"
                        error={
                          errors?.timingFirst?.message
                        }
                      />
                    )}
                  />
                  <Controller
                    name={`timingDuration`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        label="Show pop-up for"
                        value={value || ""}
                        onChange={(val) => {
                          onChange(val);
                        }}
                        autoComplete="off"
                        suffix="seconds"
                        error={
                          errors?.timingDuration?.message
                        }
                      />
                    )}
                  />
                  <Controller
                    name={`timingDelay`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextField
                        label="Delay time between pop-ups"
                        value={value || ""}
                        onChange={(val) => {
                          onChange(val);
                        }}
                        autoComplete="off"
                        suffix="seconds"
                        error={
                          errors?.timingDelay?.message
                        }
                      />
                    )}
                  />
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
              <Tabs
                items={[
                  {label: "Desktop", id: "desktop"},
                  {label: "Mobile", id: "mobile"}
                ]}
                selected={tab}
                onChange={(val: string) => {
                  setTab(val)
                }}
              >
                { tab == "desktop" ? (
                  <BlockStack gap="300" key="desktop">
                    <Card padding="300">
                      <Controller
                        name="desktop.visibility"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <InlineStack
                            gap="400"
                            align="space-between"
                            blockAlign="start"
                            wrap={false}
                          >
                            <Text as="p" variant="bodyMd">Visibility</Text>
                            <Switch
                              checked={value}
                              onChange={() => onChange(!value)}
                            ></Switch>
                          </InlineStack>
                        )}
                      />
                    </Card>
                    <Card padding="300">
                      <Box paddingBlockEnd="300">
                        <BlockStack gap="100">
                          <Text as="h4" variant="headingSm">
                            Position
                          </Text>
                        </BlockStack>
                      </Box>
                      <Controller
                        name={`desktop.position`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <BlockStack gap="200">
                            <RadioButton
                              checked={value == "top_left"}
                              label="Top left"
                              onChange={() => onChange("top_left")}
                              helpText={ value == "top_left" ? (
                                <BlockStack gap="200">
                                  <Controller
                                    name={`desktop.positionTop`}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                      <StyledRangeSlider>
                                        <RangeSlider
                                          label=""
                                          labelHidden
                                          min={0}
                                          max={1000}
                                          value={value}
                                          onChange={onChange}
                                          prefix="Top"
                                          suffix={
                                            <TextField
                                              label=""
                                              labelHidden
                                              value={value}
                                              onChange={(val) => {
                                                onChange(getOnlyDigit(val));
                                              }}
                                              onBlur={() => {
                                                if (value == "") {
                                                  onChange(0);
                                                } else if (value > 1000) {
                                                  onChange(1000);
                                                } else if (value < 0) {
                                                  onChange(0);
                                                }
                                              }}
                                              autoComplete="off"
                                              suffix="px"
                                              error={
                                                errors?.desktop?.positionTop?.message
                                              }
                                            />
                                          }
                                        />
                                      </StyledRangeSlider>
                                    )}
                                  />
                                  <Controller
                                    name={`desktop.positionLeft`}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                      <StyledRangeSlider>
                                        <RangeSlider
                                          label="Mobile"
                                          labelHidden
                                          min={0}
                                          max={1000}
                                          value={value}
                                          onChange={onChange}
                                          prefix="Left"
                                          suffix={
                                            <TextField
                                              label=""
                                              labelHidden
                                              value={value}
                                              onChange={(val) => {
                                                onChange(getOnlyDigit(val));
                                              }}
                                              onBlur={() => {
                                                if (value == "") {
                                                  onChange(0);
                                                } else if (value > 1000) {
                                                  onChange(1000);
                                                } else if (value < 0) {
                                                  onChange(0);
                                                }
                                              }}
                                              autoComplete="off"
                                              suffix="px"
                                              error={
                                                errors?.desktop?.positionLeft?.message
                                              }
                                            />
                                          }
                                        />
                                      </StyledRangeSlider>
                                    )}
                                  />
                                </BlockStack>
                              ) : undefined}
                            ></RadioButton>
                            <RadioButton
                              checked={value == "top_right"}
                              label="Top right"
                              onChange={() => onChange("top_right")}
                              helpText={ value == "top_right" ? (
                                <BlockStack gap="200">
                                  <Controller
                                    name={`desktop.positionTop`}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                      <StyledRangeSlider>
                                        <RangeSlider
                                          label=""
                                          labelHidden
                                          min={0}
                                          max={1000}
                                          value={value}
                                          onChange={onChange}
                                          prefix="Top"
                                          suffix={
                                            <TextField
                                              label=""
                                              labelHidden
                                              value={value}
                                              onChange={(val) => {
                                                onChange(getOnlyDigit(val));
                                              }}
                                              onBlur={() => {
                                                if (value == "") {
                                                  onChange(0);
                                                } else if (value > 1000) {
                                                  onChange(1000);
                                                } else if (value < 0) {
                                                  onChange(0);
                                                }
                                              }}
                                              autoComplete="off"
                                              suffix="px"
                                              error={
                                                errors?.desktop?.positionTop?.message
                                              }
                                            />
                                          }
                                        />
                                      </StyledRangeSlider>
                                    )}
                                  />
                                  <Controller
                                    name={`desktop.positionRight`}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                      <StyledRangeSlider>
                                        <RangeSlider
                                          label="Mobile"
                                          labelHidden
                                          min={0}
                                          max={1000}
                                          value={value}
                                          onChange={onChange}
                                          prefix="Right"
                                          suffix={
                                            <TextField
                                              label=""
                                              labelHidden
                                              value={value}
                                              onChange={(val) => {
                                                onChange(getOnlyDigit(val));
                                              }}
                                              onBlur={() => {
                                                if (value == "") {
                                                  onChange(0);
                                                } else if (value > 1000) {
                                                  onChange(1000);
                                                } else if (value < 0) {
                                                  onChange(0);
                                                }
                                              }}
                                              autoComplete="off"
                                              suffix="px"
                                              error={
                                                errors?.desktop?.positionRight?.message
                                              }
                                            />
                                          }
                                        />
                                      </StyledRangeSlider>
                                    )}
                                  />
                                </BlockStack>
                              ) : undefined}
                            ></RadioButton>
                            <RadioButton
                              checked={value == "bottom_left"}
                              label="Bottom left"
                              onChange={() => onChange("bottom_left")}
                              helpText={ value == "bottom_left" ? (
                                <BlockStack gap="200">
                                  <Controller
                                    name={`desktop.positionBottom`}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                      <StyledRangeSlider>
                                        <RangeSlider
                                          label=""
                                          labelHidden
                                          min={0}
                                          max={1000}
                                          value={value}
                                          onChange={onChange}
                                          prefix="Bottom"
                                          suffix={
                                            <TextField
                                              label=""
                                              labelHidden
                                              value={value}
                                              onChange={(val) => {
                                                onChange(getOnlyDigit(val));
                                              }}
                                              onBlur={() => {
                                                if (value == "") {
                                                  onChange(0);
                                                } else if (value > 1000) {
                                                  onChange(1000);
                                                } else if (value < 0) {
                                                  onChange(0);
                                                }
                                              }}
                                              autoComplete="off"
                                              suffix="px"
                                              error={
                                                errors?.desktop?.positionBottom?.message
                                              }
                                            />
                                          }
                                        />
                                      </StyledRangeSlider>
                                    )}
                                  />
                                   <Controller
                                    name={`desktop.positionLeft`}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                      <StyledRangeSlider>
                                        <RangeSlider
                                          label="Mobile"
                                          labelHidden
                                          min={0}
                                          max={1000}
                                          value={value}
                                          onChange={onChange}
                                          prefix="Left"
                                          suffix={
                                            <TextField
                                              label=""
                                              labelHidden
                                              value={value}
                                              onChange={(val) => {
                                                onChange(getOnlyDigit(val));
                                              }}
                                              onBlur={() => {
                                                if (value == "") {
                                                  onChange(0);
                                                } else if (value > 1000) {
                                                  onChange(1000);
                                                } else if (value < 0) {
                                                  onChange(0);
                                                }
                                              }}
                                              autoComplete="off"
                                              suffix="px"
                                              error={
                                                errors?.desktop?.positionLeft?.message
                                              }
                                            />
                                          }
                                        />
                                      </StyledRangeSlider>
                                    )}
                                  />
                                </BlockStack>
                              ) : undefined}
                            ></RadioButton>
                            <RadioButton
                              checked={value == "bottom_right"}
                              label="Bottom right"
                              onChange={() => onChange("bottom_right")}
                              helpText={ value == "bottom_right" ? (
                                <BlockStack gap="200">
                                  <Controller
                                    name={`desktop.positionBottom`}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                      <StyledRangeSlider>
                                        <RangeSlider
                                          label=""
                                          labelHidden
                                          min={0}
                                          max={1000}
                                          value={value}
                                          onChange={onChange}
                                          prefix="Bottom"
                                          suffix={
                                            <TextField
                                              label=""
                                              labelHidden
                                              value={value}
                                              onChange={(val) => {
                                                onChange(getOnlyDigit(val));
                                              }}
                                              onBlur={() => {
                                                if (value == "") {
                                                  onChange(0);
                                                } else if (value > 1000) {
                                                  onChange(1000);
                                                } else if (value < 0) {
                                                  onChange(0);
                                                }
                                              }}
                                              autoComplete="off"
                                              suffix="px"
                                              error={
                                                errors?.desktop?.positionBottom?.message
                                              }
                                            />
                                          }
                                        />
                                      </StyledRangeSlider>
                                    )}
                                  />
                                  <Controller
                                    name={`desktop.positionRight`}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                      <StyledRangeSlider>
                                        <RangeSlider
                                          label=""
                                          labelHidden
                                          min={0}
                                          max={1000}
                                          value={value}
                                          onChange={onChange}
                                          prefix="Right"
                                          suffix={
                                            <TextField
                                              label=""
                                              labelHidden
                                              value={value}
                                              onChange={(val) => {
                                                onChange(getOnlyDigit(val));
                                              }}
                                              onBlur={() => {
                                                if (value == "") {
                                                  onChange(0);
                                                } else if (value > 1000) {
                                                  onChange(1000);
                                                } else if (value < 0) {
                                                  onChange(0);
                                                }
                                              }}
                                              autoComplete="off"
                                              suffix="px"
                                              error={
                                                errors?.desktop?.positionRight?.message
                                              }
                                            />
                                          }
                                        />
                                      </StyledRangeSlider>
                                    )}
                                  />
                                </BlockStack>
                              ) : undefined}
                            ></RadioButton>
                          </BlockStack>
                        )}
                      />
                    </Card>
                  </BlockStack>
                ) : (
                  <BlockStack gap="300" key="mobile">
                    <Card padding="300">
                      <Controller
                        name="mobile.visibility"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <InlineStack
                            gap="400"
                            align="space-between"
                            blockAlign="start"
                            wrap={false}
                          >
                            <Text as="p" variant="bodyMd">Visibility</Text>
                            <Switch
                              checked={value}
                              onChange={() => onChange(!value)}
                            ></Switch>
                          </InlineStack>
                        )}
                      />
                    </Card>
                    <Card padding="300">
                      <Box paddingBlockEnd="300">
                        <BlockStack gap="100">
                          <Text as="h4" variant="headingSm">
                            Position
                          </Text>
                        </BlockStack>
                      </Box>
                      <Controller
                        name={`mobile.position`}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <BlockStack gap="200">
                            <RadioButton
                              checked={value == "top"}
                              label="Top"
                              onChange={() => onChange("top")}
                            ></RadioButton>
                            <RadioButton
                              checked={value == "bottom"}
                              label="Bottom"
                              onChange={() => onChange("bottom")}
                            ></RadioButton>
                          </BlockStack>
                        )}
                      />
                    </Card>
                  </BlockStack>
                )}
              </Tabs>
            </Card>
          </BlockStack>
        </Card>
      </BlockStack>
    </StyledContainer>
  );
};
export default General;
