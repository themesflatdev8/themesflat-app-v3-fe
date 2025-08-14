import { useState, useCallback, useEffect, useMemo } from "react";
import { Filters, Button, Text, TextField, Icon } from "@shopify/polaris";
import {
  StyledFilterContainer,
  StyledFilterBody,
  StyledFilterFooter,
  LeftHeading,
} from "./styled-components";
import { SearchIcon } from "@shopify/polaris-icons";

type Props = {
  onAdd?: Function;
  error?: string;
};

let timerQueryValue: any = null;
function ComplementaryProductsFilter({ onAdd, error }: Props) {
  const [queryValueTemp, setQueryValueTemp] = useState("");

  const handleFiltersQueryChange = useCallback((value: any) => {
    onAdd?.({ keyword: value });
    setQueryValueTemp("");
  }, []);

  return (
    <StyledFilterContainer>
      <TextField
        label=""
        labelHidden
        value={queryValueTemp}
        placeholder={"Search products"}
        autoComplete="off"
        onChange={handleFiltersQueryChange}
        prefix={<Icon source={SearchIcon} />}
        connectedRight={
          <Button size="large" onClick={() => onAdd?.({ keyword: "" })}>
            Browse
          </Button>
        }
        error={error}
      ></TextField>
    </StyledFilterContainer>
  );
}

export default ComplementaryProductsFilter;
