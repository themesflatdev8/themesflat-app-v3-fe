import { useState, useCallback, useEffect, useMemo } from "react";
import {
  Filters,
  Button,
  InlineStack,
  Popover,
  OptionList,
  ChoiceList,
} from "@shopify/polaris";
import { StyledFilterContainer } from "./styled-components";
import { isEmpty } from "@/utils/lodash";
type Props = {
  filters: any;
  setFilters?: Function;
};

let timerQueryValue: any = null;
function Filter({ filters, setFilters = () => {} }: Props) {
  const [queryValue, setQueryValue] = useState(filters.keyword);
  const [queryValueTemp, setQueryValueTemp] = useState(filters.keyword);

  const handleFiltersQueryChange = useCallback((value: any) => {
    setQueryValueTemp(value);
    clearTimeout(timerQueryValue);
    timerQueryValue = setTimeout(() => {
      setQueryValue(value);
    }, 300);
  }, []);
  const handleQueryValueRemove = useCallback(() => {
    setQueryValue("");
    setQueryValueTemp("");
  }, []);

  const handleFiltersClearAll = useCallback(() => {
    setQueryValueTemp("");
    setFilters((prev: any) => {
      return {
        ...prev,
        keyword: "",
        page: 1,
        status: [],
      };
    });
  }, [setFilters]);

  const handleStatusRemove = useCallback(
    (value: any) => {
      setFilters((prev: any) => {
        return {
          ...prev,
          keyword: "",
          page: 1,
          status: [],
        };
      });
    },
    [setFilters]
  );

  const handleStatusChange = useCallback((value: string[]) => {
    setFilters((prev: any) => {
      return {
        ...prev,
        keyword: "",
        page: 1,
        status: value,
      };
    });
  }, []);

  const filtersTemp = [
    {
      key: "status",
      label: "Status",
      filter: (
        <ChoiceList
          title="Status"
          titleHidden
          choices={[
            { value: "1", label: "Active" },
            { value: "0", label: "Draft" },
          ]}
          selected={filters.status || []}
          onChange={handleStatusChange}
        />
      ),
      shortcut: true,
    },
  ];

  function disambiguateLabel(key: string, value: any) {
    switch (key) {
      case "status":
        return value
          ?.map((val: string) => `Status ${val == "1" ? "Active" : "Draft"}`)
          .join(", ");
      default:
        return value;
    }
  }

  const appliedFilters = useMemo(() => {
    const arr: any = [];
    if (!isEmpty(filters.status)) {
      const key = "status";
      arr.push({
        key,
        label: disambiguateLabel(key, filters.status),
        onRemove: handleStatusRemove,
      });
    }
    return arr;
  }, [filters, handleStatusRemove]);

  useEffect(() => {
    setFilters((prev: any) => {
      return {
        ...prev,
        keyword: queryValue,
        page: 1,
      };
    });
  }, [queryValue, setFilters]);

  return (
    <StyledFilterContainer>
      <Filters
        queryPlaceholder={"Search"}
        queryValue={queryValueTemp || ""}
        filters={filtersTemp}
        onQueryChange={handleFiltersQueryChange}
        onQueryClear={handleQueryValueRemove}
        onClearAll={handleFiltersClearAll}
        appliedFilters={appliedFilters}
      ></Filters>
    </StyledFilterContainer>
  );
}

export default Filter;
