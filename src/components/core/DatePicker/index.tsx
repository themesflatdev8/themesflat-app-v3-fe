import { Popover, DatePicker, Icon, TextField } from "@shopify/polaris";
import { CalendarIcon } from "@shopify/polaris-icons";
import { useState, useCallback, useEffect } from "react";
import { getFormattedDate } from "@/utils/time";

type Props = {
  value: any;
  label: string;
  onChange: Function;
  disabled?: boolean;
  disableDatesBefore?: any;
};
const PopoverDatePicker = ({
  value,
  label = "",
  disabled,
  disableDatesBefore = null,
  onChange,
}: Props) => {
  const [popoverActive, setPopoverActive] = useState(false);
  const [{ month, year }, setDate] = useState({ month: 1, year: 2023 });
  const [selected, setSelected] = useState(new Date());

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const handleMonthChange = useCallback(
    (month: any, year: any) => setDate({ month, year }),
    []
  );

  const handleChange = (value: any) => {
    onChange(getFormattedDate(value.start));
    togglePopoverActive();
  };

  useEffect(() => {
    let date = value ? new Date(value) : new Date();
    setDate({ month: date.getMonth(), year: date.getFullYear() });
    setSelected(date);
  }, [value]);

  const activator = (
    <TextField
      label={label}
      value={value ? getFormattedDate(selected) : ""}
      labelHidden={label ? false : true}
      readOnly
      disabled={disabled}
      onChange={() => {}}
      prefix={<Icon source={CalendarIcon} />}
      onFocus={() => togglePopoverActive()}
      autoComplete="off"
    />
  );

  return (
    <Popover
      active={popoverActive}
      activator={activator}
      autofocusTarget="first-node"
      preferInputActivator={false}
      onClose={() => togglePopoverActive()}
    >
      <DatePicker
        month={month}
        year={year}
        onChange={handleChange}
        onMonthChange={handleMonthChange}
        selected={selected}
        disableDatesBefore={disableDatesBefore}
      />
    </Popover>
  );
};

export default PopoverDatePicker;
