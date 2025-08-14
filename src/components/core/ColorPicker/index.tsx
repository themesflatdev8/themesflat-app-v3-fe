import { useState, useCallback } from "react";
import {
  Popover,
  ColorPicker,
  hsbToHex,
  TextField,
  Icon,
} from "@shopify/polaris";
import { rgbToHsb } from "@shopify/polaris";
import { PaintBrushRoundIcon } from "@shopify/polaris-icons";
import { hexToRGB, convertColor } from "@/utils/color";
import {
  StyledColorPickerContainer,
  StyledBtnColorPicker,
  StyledColorPickerContent,
} from "./styled-components";

type Props = {
  children?: React.ReactNode;
  label?: string | null;
  value?: string | null;
  disabled?: boolean;
  onChange?: Function;
  labelPosition?: "left" | "right";
  allowAlpha?: boolean;
  allowInput?: boolean;
};

const PopoverColorPicker = ({
  label,
  value,
  disabled,
  onChange = () => {},
  labelPosition = "left",
  allowAlpha = false,
  allowInput = false,
}: Props) => {
  const [color, setColor]: any = useState({
    hue: 120,
    brightness: 1,
    saturation: 1,
    alpha: 1,
  });
  const [isValidColor, setIsValidColor]: any = useState(true);

  const selectColor = (color: any) => {
    onChange(convertColor(color, hsbToHex));
    setColor(color);
  };

  const [popoverActive, setPopoverActive] = useState(false);
  const valueDefault = "#fff";

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const handleChange = useCallback((newValue: any) => {
    onChange(newValue);
    let ex = /^#([\da-f]{3}){1,2}$/i;
    let exa = /^#([\da-f]{4}){1,2}$/i;
    if (ex.test(newValue) || exa.test(newValue)) {
      setColor(rgbToHsb(hexToRGB(newValue)));
      setIsValidColor(true);
    } else {
      setIsValidColor(false);
    }
  }, []);
  const handleBlur = useCallback(() => {
    if (!isValidColor) {
      onChange("#fff");
      setColor({
        hue: 120,
        brightness: 1,
        saturation: 1,
        alpha: 1,
      });
    }
  }, []);

  const activator = (
    <StyledColorPickerContainer disabled={disabled}>
      {label && <label>{label}</label>}
      <StyledColorPickerContent>
        <StyledBtnColorPicker onClick={togglePopoverActive}>
          <span
            style={{
              background:
                value && typeof value == "object"
                  ? hsbToHex(value)
                  : value
                    ? value
                    : valueDefault,
            }}
          ></span>
        </StyledBtnColorPicker>
        {allowInput && (
          <TextField
            labelHidden
            label=""
            value={value ? value : valueDefault}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="off"
            maxLength={9}
            suffix={
              <span onClick={togglePopoverActive} style={{ cursor: "pointer" }}>
                <Icon source={PaintBrushRoundIcon}></Icon>
              </span>
            }
          />
        )}
      </StyledColorPickerContent>
    </StyledColorPickerContainer>
  );

  return (
    <Popover
      active={popoverActive}
      activator={activator}
      autofocusTarget="first-node"
      onClose={togglePopoverActive}
    >
      <div className="color-picker-container">
        {/* @ts-ignore */}
        <ColorPicker
          onChange={selectColor}
          color={color}
          allowAlpha={allowAlpha}
        />
      </div>
    </Popover>
  );
};

export default PopoverColorPicker;
