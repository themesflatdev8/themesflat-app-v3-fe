import { Button, Popover, ActionList, Text } from "@shopify/polaris";
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
};

const minWidth = 126;

const SelectActionList = ({
  options,
  value,
  onChange,
  disclosureType = "down",
  isLoaded = false,
  fieldLabel = "label",
  fieldValue = "value",
  btnPlaceHolderLabel = "",
}: Props) => {
  const [active, setActive] = useState(false);
  const [minWidthPopover, setMinWidthPopover] = useState("150px");
  const selectRef: any = useRef();
  const toggleActive = useCallback(() => {
    setActive((active) => !active);
  }, []);
  const [optionList, setOptionList]: any = useState([]);
  useEffect(() => {
    let newOptions: any = [];
    options.length > 0 &&
      options.forEach((op: any) => {
        newOptions.push({
          content: op[fieldLabel],
          value: op[fieldValue],
          helpText: op["helpText"] ? op["helpText"] : "",
          active: value == op[fieldValue] ? true : false,
          onAction: () => {
            handleChangeOption(op[fieldValue]);
          },
        });
      });
    setOptionList(newOptions);
  }, [options, value]);

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

  // useEffect(() => {
  //   window.addEventListener('resize', handleResize)
  //   return () => window.removeEventListener('resize', handleResize)
  // }, []);

  useEffect(() => {
    handleResize();
  }, [selectRef.current?.offsetWidth]);

  const getBtnAction = useMemo(() => {
    let option = optionList.find((i: any) => i.value == value);
    return option?.content;
  }, [value, optionList]);

  const activator = (
    <Button
      onClick={toggleActive}
      textAlign="left"
      disclosure={disclosureType}
      loading={isLoaded ? false : value ? false : true}
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
          <ActionList
            actionRole="menuitem"
            items={options.map((op: any) => {
              return {
                content: op[fieldLabel],
                value: op[fieldValue],
                helpText: op["helpText"] ? op["helpText"] : "",
                active: value == op[fieldValue] ? true : false,
                onAction: () => {
                  handleChangeOption(op[fieldValue]);
                },
              };
            })}
          />
        </OptionsListContainer>
      </Popover>
    </SelectContainer>
  );
};

export default SelectActionList;
