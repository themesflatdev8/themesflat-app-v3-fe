import { Button, Popover, OptionList, Text, IconProps } from "@shopify/polaris";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { SelectContainer, OptionsListContainer } from "./styled-components";

type Props = {
  children?: any;
  options?: any;
  value?: any;
  onChange: Function;
  fieldLabel?: string;
  fieldValue?: string;
  btnPlaceHolderLabel?: string;
  disclosureType?: any;
  isLoaded?: boolean;
  btnIcon?: any;
  btnText?: string;
  btnSize?: "medium" | "large" | "slim" | "micro" | undefined;
  titleOptionList?: string;
  disabled?: boolean;
};

const SelectOptionList = ({
  options,
  value,
  onChange,
  disclosureType = "down",
  isLoaded = false,
  btnIcon,
  btnSize = "large",
  titleOptionList,
  btnText,
  fieldLabel = "label",
  fieldValue = "value",
  btnPlaceHolderLabel = "",
  disabled = false,
}: Props) => {
  const [active, setActive] = useState(false);
  const [option, setOption]: any = useState([]);
  const [minWidthPopover, setMinWidthPopover] = useState("150px");
  const selectRef: any = useRef();
  const toggleActive = useCallback(() => {
    setActive((active) => !active);
  }, []);
  const [optionList, setOptionList]: any = useState([]);
  const minWidth = 126;
  useEffect(() => {
    let newOptions: any = [];
    if (fieldLabel !== "label" && fieldValue !== "value") {
      options.length > 0 &&
        options.forEach((op: any) => {
          newOptions.push({ label: op[fieldLabel], value: op[fieldValue] });
        });
    } else {
      newOptions = options;
    }
    setOptionList(newOptions);
  }, [options]);

  const handleChangeOption = (val: any) => {
    if (String(val) != String(value)) {
      onChange(String(val));
    }
    setActive(false);
  };

  const handleResize = useCallback(() => {
    let width =
      selectRef.current?.offsetWidth < minWidth
        ? minWidth
        : selectRef.current?.offsetWidth;
    setMinWidthPopover(`${width}px`);
  }, []);

  useEffect(() => {
    setOption([value]);
  }, [value]);

  // useEffect(() => {
  //   window.addEventListener('resize', handleResize)
  //   return () => window.removeEventListener('resize', handleResize)
  // }, []);

  useEffect(() => {
    handleResize();
  }, [selectRef.current?.offsetWidth]);

  const getBtnAction = useMemo(() => {
    if (btnText) return btnText;
    let option = optionList.find((i: any) => i.value == value);
    return option?.label;
  }, [value, optionList, btnText]);

  const activator = (
    <Button
      size={btnSize}
      disabled={disabled}
      textAlign="left"
      onClick={toggleActive}
      disclosure={disclosureType}
      loading={isLoaded ? false : value ? false : true}
      icon={btnIcon ? btnIcon : undefined}
    >
      {btnPlaceHolderLabel && (
        <Text as="span" variant="bodyMd" tone="subdued">
          {btnPlaceHolderLabel}&nbsp;
        </Text>
      )}
      {getBtnAction}
    </Button>
  );

  return (
    <SelectContainer ref={selectRef}>
      <Popover
        active={active}
        activator={activator}
        autofocusTarget="first-node"
        onClose={toggleActive}
      >
        <OptionsListContainer style={{ minWidth: minWidthPopover }}>
          <OptionList
            title={titleOptionList || undefined}
            options={optionList}
            selected={option}
            onChange={(val: any) => handleChangeOption(val)}
          />
        </OptionsListContainer>
      </Popover>
    </SelectContainer>
  );
};

export default SelectOptionList;
