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
} from "@shopify/polaris";
import { DragHandleIcon } from "@shopify/polaris-icons";
import { Tabs, Switch, Image } from "@/components/core"
import {
  StyledContainer,
  StyledRangeSlider,
  StyledList,
  StyledItem,
} from "./styled-components";
import { Controller } from "react-hook-form";
import { getOnlyDigit } from "@/utils/money";
import { isEqual } from "@/utils/lodash";
import { getImgFromServer } from "@/utils/cdn";

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

  const handleDrag = useCallback((newList: any, oldList: any) => {
    if (!isEqual(newList, oldList)) {
      setValue("socials", newList, { shouldDirty: true });
    }
  }, []);

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
            <StyledList>
              <ReactSortable
                list={form?.socials}
                setList={(val: any) => handleDrag(val, form?.socials)}
              >
                { form?.socials.map((item: any, index: number) => (
                  <StyledItem key={item.id}>
                    <Card padding="200">
                      <InlineGrid columns={"20px 32px auto"} gap="200">
                        <Icon source={DragHandleIcon} tone="subdued" />
                        <Image
                          src={getImgFromServer(`icons/socials`, `${item.id}-icon.jpg`)}
                          width="32"
                          height="32"
                          alt={item.label}
                        />
                        <Controller
                          key={index}
                          name={`socials.${index}.link`}
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <TextField
                              label={item.name}
                              value={value || ""}
                              onChange={(val: string) => {
                                onChange(val);
                              }}
                              autoComplete="off"
                              clearButton
                              onClearButtonClick={() => onChange("")}
                              placeholder={`Enter your ${item.label?.toLowerCase()} link here`}
                              error={
                                errors?.socials?.[index]?.message
                              }
                            />
                          )}
                        />
                      </InlineGrid>
                    </Card>
                  </StyledItem>
                )) }
              </ReactSortable>
            </StyledList>
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
                        Style
                      </Text>
                    </BlockStack>
                  </Box>
                  <Controller
                    name={`desktop.style`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <BlockStack gap="200">
                        <RadioButton
                          checked={value == "vertical"}
                          label="Vertical"
                          onChange={() => onChange("vertical")}
                        ></RadioButton>
                        <RadioButton
                          checked={value == "horizontal"}
                          label="Horizontal"
                          onChange={() => onChange("horizontal")}
                        ></RadioButton>
                      </BlockStack>
                    )}
                  />
                </Card>
                <Card padding="300">
                  <Box paddingBlockEnd="300">
                    <BlockStack gap="100">
                      <Text as="h4" variant="headingSm">
                        Template
                      </Text>
                    </BlockStack>
                  </Box>
                  <Controller
                    name={`desktop.template`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <BlockStack gap="200">
                        <RadioButton
                          checked={value == "circle"}
                          label="Circle"
                          onChange={() => onChange("circle")}
                        ></RadioButton>
                        <RadioButton
                          checked={value == "square"}
                          label="Square"
                          onChange={() => onChange("square")}
                        ></RadioButton>
                      </BlockStack>
                    )}
                  />
                </Card>
                <Card padding="300">
                  <Box paddingBlockEnd="300">
                    <BlockStack gap="100">
                      <Text as="h4" variant="headingSm">
                        Size
                      </Text>
                    </BlockStack>
                  </Box>
                  <Controller
                    name={`desktop.size`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <StyledRangeSlider>
                        <RangeSlider
                          label="Desktop"
                          labelHidden
                          min={16}
                          max={100}
                          value={value}
                          onChange={onChange}
                          suffix={
                            <TextField
                              label=""
                              labelHidden
                              value={value || ""}
                              onChange={(val) => {
                                onChange(getOnlyDigit(val));
                              }}
                              onBlur={() => {
                                if (value == "") {
                                  onChange(16);
                                } else if (value > 100) {
                                  onChange(100);
                                } else if (value < 16) {
                                  onChange(16);
                                }
                              }}
                              autoComplete="off"
                              suffix="px"
                              error={
                                errors?.desktop?.size?.message
                              }
                            />
                          }
                        />
                      </StyledRangeSlider>
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
                          checked={value == "bottom_left"}
                          label="Bottom left"
                          onChange={() => onChange("bottom_left")}
                          helpText={ value == "bottom_left" ? (
                            <BlockStack gap="200">
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
                        Style
                      </Text>
                    </BlockStack>
                  </Box>
                  <Controller
                    name={`mobile.style`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <BlockStack gap="200">
                        <RadioButton
                          checked={value == "vertical"}
                          label="Vertical"
                          onChange={() => onChange("vertical")}
                        ></RadioButton>
                        <RadioButton
                          checked={value == "horizontal"}
                          label="Horizontal"
                          onChange={() => onChange("horizontal")}
                        ></RadioButton>
                      </BlockStack>
                    )}
                  />
                </Card>
                <Card padding="300">
                  <Box paddingBlockEnd="300">
                    <BlockStack gap="100">
                      <Text as="h4" variant="headingSm">
                        Template
                      </Text>
                    </BlockStack>
                  </Box>
                  <Controller
                    name={`mobile.template`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <BlockStack gap="200">
                        <RadioButton
                          checked={value == "circle"}
                          label="Circle"
                          onChange={() => onChange("circle")}
                        ></RadioButton>
                        <RadioButton
                          checked={value == "square"}
                          label="Square"
                          onChange={() => onChange("square")}
                        ></RadioButton>
                      </BlockStack>
                    )}
                  />
                </Card>
                <Card padding="300">
                  <Box paddingBlockEnd="300">
                    <BlockStack gap="100">
                      <Text as="h4" variant="headingSm">
                        Size
                      </Text>
                    </BlockStack>
                  </Box>
                  <Controller
                    name={`mobile.size`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <StyledRangeSlider>
                        <RangeSlider
                          label="Mobile"
                          labelHidden
                          min={16}
                          max={100}
                          value={value}
                          onChange={onChange}
                          suffix={
                            <TextField
                              label=""
                              labelHidden
                              value={value || ""}
                              onChange={(val) => {
                                onChange(getOnlyDigit(val));
                              }}
                              onBlur={() => {
                                if (value == "") {
                                  onChange(16);
                                } else if (value > 100) {
                                  onChange(100);
                                } else if (value < 16) {
                                  onChange(16);
                                }
                              }}
                              autoComplete="off"
                              suffix="px"
                              error={
                                errors?.mobile?.size?.message
                              }
                            />
                          }
                        />
                      </StyledRangeSlider>
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
                          checked={value == "bottom_left"}
                          label="Bottom left"
                          onChange={() => onChange("bottom_left")}
                          helpText={ value == "bottom_left" ? (
                            <BlockStack gap="200">
                              <Controller
                                name={`mobile.position_left`}
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
                                            errors?.mobile?.position_left?.message
                                          }
                                        />
                                      }
                                    />
                                  </StyledRangeSlider>
                                )}
                              />
                              <Controller
                                name={`mobile.position_bottom`}
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
                                            errors?.mobile?.position_bottom?.message
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
                                name={`mobile.position_right`}
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
                                            errors?.mobile?.position_right?.message
                                          }
                                        />
                                      }
                                    />
                                  </StyledRangeSlider>
                                )}
                              />
                              <Controller
                                name={`mobile.position_bottom`}
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
                                            errors?.mobile?.position_bottom?.message
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
            )}
          </Tabs>
        </Card>
      </BlockStack>
    </StyledContainer>
  );
};
export default General;
