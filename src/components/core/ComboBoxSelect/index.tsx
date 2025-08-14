import { useState, useCallback, useEffect } from "react";
import {
  Combobox,
  Box,
  Tag,
  InlineStack,
  Button,
  Listbox,
} from "@shopify/polaris";
import { SelectIcon } from "@shopify/polaris-icons";
import { StyledContainer } from "./styled-components";

type Props = {
  value: any;
  options: any;
  onChange: Function;
  placeholder?: string;
};

const ComboBoxSelect = ({
  value,
  options = [],
  onChange,
  placeholder,
}: Props) => {
  const [focus, setFocus] = useState<boolean>(false);

  const updateSelection = useCallback(
    (selected: string) => {
      if (value.includes(selected)) {
        onChange(value.filter((option: any) => option !== selected));
      } else {
        onChange([...value, selected]);
      }
    },
    [value]
  );

  const removeTag = (tag: string) => {
    onChange(value.filter((x: any) => x !== tag));
    setFocus(false);
  };

  const tagsMarkup = (
    <InlineStack gap={"100"}>
      {value.map((option: any) => {
        const label = options.find((x: any) => x.value === option)?.label;
        return (
          <Tag key={`option-${option}`} onRemove={() => removeTag(option)}>
            {label}
          </Tag>
        );
      })}
    </InlineStack>
  );

  return (
    <StyledContainer>
      <Combobox
        allowMultiple
        activator={
          <div  onClick={() => setFocus((prev: any) => !prev)}>
            <Combobox.TextField
              focused={focus}
              onChange={() => { }}
              label=""
              labelHidden
              value={""}
              placeholder={
                placeholder ? placeholder : "Select pages"
              }
              autoComplete="off"
              suffix={
                <InlineStack align="center" blockAlign="center">
                  <Button
                    icon={SelectIcon}
                    variant="plain"
                  />
                </InlineStack>
              }
            />
          </div>
        }
        onClose={() => setFocus(false)}
      >
        <Listbox onSelect={updateSelection}>
          {options.map((item: any) => {
            return (
              <Listbox.Option
                key={item.value}
                selected={value.includes(item.value)}
                value={item.value}
              >
                {item.label}
              </Listbox.Option>
            );
          })}
        </Listbox>
      </Combobox>

      <Box paddingBlockStart="100">
        {tagsMarkup}
      </Box>

    </StyledContainer>
  );
};

export default ComboBoxSelect;
