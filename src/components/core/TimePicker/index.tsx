import {
  Button,
  Popover,
  OptionList,
  Text,
  IconProps,
  Icon,
  TextField,
} from "@shopify/polaris";
import { ClockIcon } from "@shopify/polaris-icons";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { SelectContainer, OptionsListContainer } from "./styled-components";
import { getTimesList } from "@/utils/time";

type Props = {
  value: string;
  label: string;
  disabled?: boolean;
  onChange: Function;
};

const TimePicker = ({ value, label, disabled, onChange }: Props) => {
  const [active, setActive] = useState(false);
  const [text, setText] = useState("");
  const [option, setOption]: any = useState([]);
  const [minWidthPopover, setMinWidthPopover] = useState("150px");
  const selectRef: any = useRef();
  const toggleActive = useCallback(() => {
    setActive((active) => !active);
  }, []);
  const [optionList, setOptionList]: any = useState(getTimesList());
  const minWidth = 126;

  const replaceText = (val: string) => {
    let newText = val.replace(/(AM|PM)/gi, "");
    newText = `${newText.trim()}:00`;
    if (val.includes("PM")) {
      let arr: any = newText.split(":");
      arr[0] = Number(arr[0]) + 12;
      return arr.join(":");
    }
    return newText;
  };

  const handleChangeOption = (val: any) => {
    onChange(replaceText(String(val)));
    setActive(false);
  };

  const handleResize = useCallback(() => {
    let width =
      selectRef.current?.offsetWidth < minWidth
        ? minWidth
        : selectRef.current?.offsetWidth;
    setMinWidthPopover(`${width}px`);
  }, []);

  const onChangeTextFiled = useCallback((val: string) => {
    setText(val);
  }, []);

  const onBlurTextFiled = useCallback(() => {
    if (value == text) return;
    console.log(
      "text",
      value,
      text,
      /^([0-1][0-1]|0?[1-9]):[0-5][0-9] (AM|PM)$/gi.test(text)
    );
    if (/^([0-1][0-1]|0?[1-9]):[0-5][0-9] (AM|PM)$/gi.test(text)) {
      onChange(replaceText(text));
    } else {
      setText(value);
    }
  }, [text, value]);

  useEffect(() => {
    setText(value);
    setOption([value]);
  }, [value]);

  useEffect(() => {
    handleResize();
  }, [selectRef.current?.offsetWidth]);

  const activator = (
    <TextField
      label={label}
      labelHidden={label ? false : true}
      value={text}
      // readOnly
      disabled={disabled}
      onChange={(val) => onChangeTextFiled(val)}
      onBlur={() => onBlurTextFiled()}
      prefix={<Icon source={ClockIcon} />}
      onFocus={() => setActive(true)}
      autoComplete="off"
    />
  );

  return (
    <SelectContainer ref={selectRef}>
      <Popover
        active={active}
        activator={activator}
        autofocusTarget="none"
        preferInputActivator={false}
        onClose={toggleActive}
        fullHeight={false}
      >
        <OptionsListContainer style={{ minWidth: minWidthPopover }}>
          <OptionList
            options={optionList}
            selected={option}
            onChange={(val: any) => handleChangeOption(val)}
          />
        </OptionsListContainer>
      </Popover>
    </SelectContainer>
  );
};

export default TimePicker;
