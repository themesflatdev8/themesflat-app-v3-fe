import { useState, useCallback, useEffect, useMemo } from "react";
import { Filters, ChoiceList } from "@shopify/polaris";
import { StyledFilterContainer } from "./styled-components";
import { isEmpty, clone } from "@/utils/lodash";
import {
  TYPE_SPECIFIC,
  TYPE_COLLECTION,
  TYPE_GENERAL,
  SWAPPABLE_OPTION_CROSS,
  SWAPPABLE_OPTION_FIXED,
  STRATEGY_MANUAL_PICK,
  STRATEGY_AI,
} from "@/features/product-bundles/constants";

type Props = {
  filters: any;
  setFilters?: Function;
};

let timerQueryValue: any = null;
function Filter({ filters, setFilters = () => {} }: Props) {
  const [queryValue, setQueryValue] = useState(filters.keyword);
  const [queryValueTemp, setQueryValueTemp] = useState(filters.keyword);
  const [selected, setSelected] = useState<string[]>(
    clone([...filters.bundle_type, ...filters.status])
  );

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
        bundle_type: [],
      };
    });
  }, [setFilters]);

  const handleBundleTypeChange = useCallback((value: string[]) => {
    setFilters((prev: any) => {
      return {
        ...prev,
        keyword: "",
        page: 1,
        bundle_type: value,
      };
    });
  }, []);

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

  const handleStrategyChange = useCallback((value: string[]) => {
    setFilters((prev: any) => {
      return {
        ...prev,
        keyword: "",
        page: 1,
        mode: value,
      };
    });
  }, []);

  const handleBundleTypeRemove = useCallback(
    (value: any) => {
      setFilters((prev: any) => {
        return {
          ...prev,
          keyword: "",
          page: 1,
          bundle_type: [],
        };
      });
    },
    [setFilters]
  );

  const handleStrategyRemove = useCallback(
    (value: any) => {
      setFilters((prev: any) => {
        return {
          ...prev,
          keyword: "",
          page: 1,
          mode: [],
        };
      });
    },
    [setFilters]
  );

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

  const handleSwappableRemove = useCallback(
    (value: any) => {
      setFilters((prev: any) => {
        return {
          ...prev,
          keyword: "",
          page: 1,
          // cross_option: [],
        };
      });
    },
    [setFilters]
  );

  const filtersTemp = [
    {
      key: "bundleType",
      label: "Bundle type",
      filter: (
        <ChoiceList
          title="Bundle type"
          titleHidden
          choices={[
            { value: TYPE_SPECIFIC, label: "Specific" },
            { value: TYPE_COLLECTION, label: "Collection" },
            { value: TYPE_GENERAL, label: "Any products" },
          ]}
          selected={filters.bundle_type || []}
          onChange={handleBundleTypeChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    // {
    //   key: 'swappableCrossOption',
    //   label: 'Swappable cross option',
    //   filter: (
    //     <ChoiceList
    //       title="Swappable cross option type"
    //       titleHidden
    //       choices={[
    //         {value: SWAPPABLE_OPTION_FIXED, label: 'No'},
    //         {value: SWAPPABLE_OPTION_CROSS, label: 'Yes'},
    //       ]}
    //       selected={filters.cross_option || []}
    //       onChange={handleSwappableCrossOptionChange}
    //       allowMultiple
    //     />
    //   ),
    //   shortcut: true,
    // },
    // {
    //   key: 'mode',
    //   label: 'Recommendation strategy',
    //   filter: (
    //     <ChoiceList
    //       title="Recommendation strategy"
    //       titleHidden
    //       choices={[
    //         {value: STRATEGY_AI, label: 'M-Sell AI'},
    //         {value: STRATEGY_MANUAL_PICK, label: 'Manual pick'}
    //       ]}
    //       selected={filters.mode || []}
    //       onChange={handleStrategyChange}
    //     />
    //   ),
    //   shortcut: true,
    // },
    {
      key: "status",
      label: "Status",
      filter: (
        <ChoiceList
          title="Status"
          titleHidden
          choices={[
            { value: "1", label: "Active" },
            { value: "0", label: "Inactive" },
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
      case "bundleType":
        return value
          ?.map(
            (val: string) =>
              `Type ${val === TYPE_SPECIFIC ? "Specific" : val === TYPE_COLLECTION ? "Collection" : "Any products"}`
          )
          .join(", ");
      case "swappableCrossOption":
        return value
          ?.map(
            (val: string) =>
              `${val === SWAPPABLE_OPTION_CROSS ? "Yes" : "No"} swappable`
          )
          .join(", ");
      case "mode":
        return value
          ?.map(
            (val: string) =>
              `Recommendation strategy ${val == STRATEGY_AI ? "M-Sell AI" : val == STRATEGY_MANUAL_PICK ? "Manual pick" : "Same collection"}`
          )
          .join(", ");
      case "status":
        return value
          ?.map(
            (val: string) =>
              `Status ${val == "1" ? "Published" : "Unpublished"}`
          )
          .join(", ");
      default:
        return value;
    }
  }

  const appliedFilters = useMemo(() => {
    const arr = [];
    if (!isEmpty(filters.bundle_type)) {
      const key = "bundleType";
      arr.push({
        key,
        label: disambiguateLabel(key, filters.bundle_type),
        onRemove: handleBundleTypeRemove,
      });
    }
    // if (!isEmpty(filters.cross_option)) {
    //   const key = 'swappableCrossOption';
    //   arr.push({
    //     key,
    //     label: disambiguateLabel(key, filters.cross_option),
    //     onRemove: handleSwappableRemove,
    //   });
    // }
    // if (!isEmpty(filters.mode)) {
    //   const key = 'mode';
    //   arr.push({
    //     key,
    //     label: disambiguateLabel(key, filters.mode),
    //     onRemove: handleStrategyRemove,
    //   });
    // }
    if (!isEmpty(filters.status)) {
      const key = "status";
      arr.push({
        key,
        label: disambiguateLabel(key, filters.status),
        onRemove: handleStatusRemove,
      });
    }
    return arr;
  }, [
    filters,
    handleStrategyRemove,
    handleStatusRemove,
    handleSwappableRemove,
    handleBundleTypeRemove,
  ]);

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
