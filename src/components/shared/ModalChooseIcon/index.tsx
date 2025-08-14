import { Modal } from "@/components/core";
import {
  BlockStack,
  Checkbox,
  Icon,
  InlineGrid,
  Scrollable,
  Text,
  TextField,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import { isEqual } from "@/utils/lodash";
import { getImgFromServer } from "@/utils/cdn";

enum EStoreFrontPath {
  POLARIS_ICONS = "icons/polaris",
  PAYMENT_ICONS = "icons/payment",
  TRUST_ICONS = "icons/trust",
  IMAGES = "images",
  PREVIEW = "preview",
}

type Props = {
  icons: string[];
  pathIcon: any;
  className: string;
  title: string;
  searchLabel: string;
  open: boolean;
  countLabel?: string;
  selectedIcons: string[];
  isLoading: boolean;
  primaryBtnText: string;
  columns?: number;
  multiple?: boolean;
  zIndex?: number;
  onClose: () => void;
  onOk: (list: string[]) => void;
};

const ModalChooseIcon = (props: Props) => {
  const {
    className = "",
    title,
    searchLabel,
    columns = 10,
    selectedIcons = [],
    countLabel,
    open,
    isLoading,
    primaryBtnText,
    multiple = true,
    zIndex,
    icons,
    pathIcon,
    onClose,
    onOk,
  } = props;

  const [filteredIcons, setFilteredIcons] = useState<string[]>(icons);
  const [items, setItems] = useState<string[]>(selectedIcons);
  const [keyword, setKeyword] = useState<string>("");

  const handleClose = () => {
    onClose();
  };

  const handleSearch = (value: string) => {
    setKeyword(value);
    if (!value) {
      setFilteredIcons(icons);
      return;
    }
    setFilteredIcons(
      icons?.filter((i) => value.toLowerCase().includes(i.toLowerCase()))
    );
  };

  const handleSelectItem = (type: string) => {
    if (items.includes(type)) {
      if (items.length === 1) {
        return;
      }
      setItems(items?.filter((i) => i !== type));
    } else {
      setItems(multiple ? [...items, type] : [type]);
    }
  };

  const handleSave = () => {
    onOk(items);
  };

  useEffect(() => {
    if (open) {
      setItems(selectedIcons);
      setFilteredIcons(icons);
      setKeyword("");
    }
  }, [open]);

  const isAllSelected = useMemo(() => {
    return items.length === icons.length;
  }, [items])
  
  const handleSelect = useCallback(() => {
    if (isAllSelected) {
      setItems([]);
      return;
    }
    setItems(icons);
  }, [isAllSelected, items]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      width="620px"
      zIndex={zIndex}
      secondaryAction={{
        content: "Cancel",
        disabled: isLoading,
        onAction: handleClose,
      }}
      primaryAction={{
        content: primaryBtnText,
        loading: isLoading,
        disabled: isEqual(selectedIcons, items),
        onAction: handleSave,
      }}
      sectioned={false}
    >
      <BlockStack gap="400">
        <div style={{ padding: "0px 10px" }}>
          <BlockStack gap="400">
            <TextField
              prefix={<Icon source={SearchIcon} />}
              onChange={handleSearch}
              label={searchLabel}
              labelHidden
              value={keyword}
              placeholder={searchLabel}
              autoComplete="off"
            />
            {countLabel && (
              <Checkbox
                checked={items.length > 0 && items.length < icons.length ? "indeterminate" : isAllSelected}
                onChange={handleSelect}
                label={
                  <Text variant="bodyMd" as="span" fontWeight="semibold">
                    {isAllSelected ? `All ${items.length} selected` : countLabel.replace("{{count}}", items.length.toString())}
                  </Text>
                }
              />
            )}
          </BlockStack>
        </div>
        <Scrollable style={{ height: "250px" }}>
          <div
            className={`${styles["ms-modal-choose-icon-container"]} ${className}`}
          >
            <BlockStack gap="400" inlineAlign="center">
              <InlineGrid columns={columns} gap="400">
                { filteredIcons?.map((i: string, index: number) => {
                  const selected = items.includes(i);
                  return (
                    <div
                      key={index}
                      className={`${styles["ms-icon-container"]} ${selected ? "checked" : ""}`}
                      onClick={() => handleSelectItem(i)}
                    >
                      <img src={getImgFromServer(pathIcon, i)} alt={i} />
                      {selected && <Checkbox checked label="" tone="magic" />}
                    </div>
                  );
                })}
              </InlineGrid>
            </BlockStack>
          </div>
        </Scrollable>
      </BlockStack>
    </Modal>
  );
};

export default ModalChooseIcon;
