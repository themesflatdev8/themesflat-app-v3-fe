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
  Link,
  Button,
  RadioButton,
  InlineGrid,
  InlineStack,
  Icon,
  Thumbnail,
} from "@shopify/polaris";
import { DeleteIcon, DragHandleIcon } from "@shopify/polaris-icons";
import {
  StyledContainer,
  StyledRangeSlider,
  StyledBadgeList,
  StyledBadgeItem,
  StyledBadgeDrag,
  StyledBadgeDelete
} from "./styled-components";
import { Controller } from "react-hook-form";
import { ColorPicker } from "@/components/core"
import ModalChooseIcon from "@/components/shared/ModalChooseIcon";
import { getOnlyDigit } from "@/utils/money";
import { _paymentIcons } from "@/constants/icons"
import { getImgFromServer } from "@/utils/cdn";
import { isEqual } from "@/utils/lodash";

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
  const [modalChooseBadges, setModalChooseBadges] = useState(false)

  const handleChooseBadges = (list: string[]) => {
    setValue("icons", list, { shouldDirty: true });
    setModalChooseBadges(false);
  };

  const onRemove = (name: string) => {
    if (!name) return;
    let arr = [...form.icons];
    let index = arr.findIndex((img: string) => img == name);
    arr.splice(index, 1);
    setValue?.("icons", arr);
  };

  const handleDrag = useCallback((newList: any, oldList: any) => {
    if (!isEqual(newList, oldList)) {
      setValue("icons", newList, { shouldDirty: true });
    }
  }, []);

  return (
    <StyledContainer>
      <BlockStack gap="300">
        <Card>
          <Box paddingBlockEnd="300">
            <BlockStack gap="100">
              <Text as="h3" variant="headingMd">
                Content
              </Text>
            </BlockStack>
          </Box>
          <BlockStack gap="300">
            <Controller
              name={`heading`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextField
                  label="Heading"
                  value={value || ""}
                  onChange={(val: string) => {
                    onChange(val);
                  }}
                  autoComplete="off"
                  clearButton
                  onClearButtonClick={() => onChange("")}
                  error={
                    errors?.heading?.message
                  }
                />
              )}
            />
          </BlockStack>
        </Card>
        <Card>
          <Box paddingBlockEnd="300">
            <BlockStack gap="100">
              <Text as="h3" variant="headingMd">
                Customization
              </Text>
            </BlockStack>
          </Box>
          <BlockStack gap="300">
            <Button
              onClick={() => setModalChooseBadges(true)}
            >Choose badges</Button>
            <StyledBadgeList>
              <ReactSortable
                className="StyledBadgeSortable"
                list={form?.icons}
                setList={(val: any) => handleDrag(val, form?.icons)}
              >
                {[...form.icons].map((icon: any) => (
                  <StyledBadgeItem
                    key={icon}
                  >
                    <Thumbnail source={getImgFromServer("icons/payment", icon)} alt={icon} />
                    <StyledBadgeDrag><Icon source={DragHandleIcon}></Icon></StyledBadgeDrag>
                    <StyledBadgeDelete
                      onClick={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove(icon);
                      }}
                    >
                      <Icon source={DeleteIcon}></Icon>
                    </StyledBadgeDelete>
                  </StyledBadgeItem>
                ))}
              </ReactSortable>
            </StyledBadgeList>
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
                    Templates
                  </Text>
                </BlockStack>
              </Box>
              <BlockStack gap="300">
                <Controller
                  name={`template`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <BlockStack gap="100">
                      <RadioButton
                        label="Inline"
                        checked={value === 'inline'}
                        id="template-inline"
                        name="template"
                        onChange={() => onChange("inline")}
                      />
                      <RadioButton
                        label="Box-covered"
                        id="template-box"
                        name="template"
                        checked={value === 'box'}
                        onChange={() => onChange("box")}
                      />
                    </BlockStack>
                  )}
                />
              </BlockStack>
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
              <Box paddingBlockEnd="300">
                <BlockStack gap="100">
                  <Text as="h4" variant="headingSm">
                    Widget Size
                  </Text>
                </BlockStack>
              </Box>
              <BlockStack gap="300">
              <Controller
                  name={`desktop.size`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <StyledRangeSlider>
                      <RangeSlider
                        label="Desktop badge size"
                        min={16}
                        max={80}
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
                              } else if (value > 80) {
                                onChange(80);
                              } else if (value < 16) {
                                onChange(16);
                              }
                            }}
                            autoComplete="off"
                            suffix="px"
                            error={
                              errors?.size?.message
                            }
                          />
                        }
                      />
                    </StyledRangeSlider>
                  )}
                />
                <Controller
                  name={`mobile.size`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <StyledRangeSlider>
                      <RangeSlider
                        label="Mobile badge size"
                        min={16}
                        max={80}
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
                              } else if (value > 80) {
                                onChange(80);
                              } else if (value < 16) {
                                onChange(16);
                              }
                            }}
                            autoComplete="off"
                            suffix="px"
                            error={
                              errors?.size?.message
                            }
                          />
                        }
                      />
                    </StyledRangeSlider>
                  )}
                />
                <Controller
                  name={`headingSize`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <StyledRangeSlider>
                      <RangeSlider
                        label="Heading text size"
                        min={10}
                        max={40}
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
                                onChange(10);
                              } else if (value > 40) {
                                onChange(40);
                              } else if (value < 10) {
                                onChange(10);
                              }
                            }}
                            autoComplete="off"
                            suffix="px"
                            error={
                              errors?.size?.message
                            }
                          />
                        }
                      />
                    </StyledRangeSlider>
                  )}
                />
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
                <Text variant="bodyMd" as="p">It should catch the attention of customers without distracting them from the main product information</Text>
                <Link>Learn how to custom position on Product page</Link>
              </BlockStack>
            </Card>
          </BlockStack>
        </Card>
      </BlockStack>

      <ModalChooseIcon
        className="payment"
        open={modalChooseBadges}
        title="Choose your payment badges"
        searchLabel="Search"
        icons={_paymentIcons}
        pathIcon={"icons/payment"}
        selectedIcons={form?.icons || []}
        countLabel={`Showing {{count}} badges`}
        isLoading={false}
        primaryBtnText="Choose badges"
        onClose={() => setModalChooseBadges(false)}
        onOk={handleChooseBadges}
      ></ModalChooseIcon>
      
    </StyledContainer>
  );
};
export default General;
