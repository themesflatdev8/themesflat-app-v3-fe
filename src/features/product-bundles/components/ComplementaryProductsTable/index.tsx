import React, { useCallback } from "react";
import { Thumbnail, Icon, Tooltip, Scrollable, Card } from "@shopify/polaris";
import { DragHandleIcon, XSmallIcon, ViewIcon } from "@shopify/polaris-icons";
import {
  StyledList,
  StyledItem,
  StyledItemDrag,
  StyledItemNumber,
  StyledItemName,
  StyledItemStatus,
  StyledItemAction,
  StyledItemPrice,
  StyledItemImage,
  StyledBadge,
} from "./styled-components";
import { useAuthContext } from "@/features/auth/contexts";
import { ReactSortable } from "react-sortablejs";
import AutoGenIcon from "~/icons/auto-gen.svg";
import { STATUS_ACTIVE } from "@/features/product-bundles/constants";
import { isEqual } from "@/utils/lodash";
import { formatOutputPrice } from "@/utils/money";

type Props = {
  data: Array<any>;
  allData: Array<any>;
  onRemove: Function;
  setValue: any;
};

const ComplementaryProductsTable = ({
  data,
  allData,
  onRemove,
  setValue,
}: Props) => {
  const [{ store }]: any = useAuthContext();

  const handleDrag = useCallback((newList: any, oldList: any) => {
    if (!isEqual(newList, oldList)) {
      setValue("list_commendations", newList, { shouldDirty: true });
    }
  }, []);

  const openUrl = useCallback((url: string) => {
    window.open(url, "_blank");
  }, []);

  const renderItem = ({ item, isDisable, indexOfAllData }: any) => {
    return (
      <StyledItem key={item.id} disabled={isDisable}>
        <StyledItemDrag>
          <Icon source={DragHandleIcon} />
        </StyledItemDrag>
        <StyledItemImage>
          <Thumbnail
            source={item?.image || "/images/no-img.png"}
            size="small"
            alt="Black choker necklace"
          />
        </StyledItemImage>
        <StyledItemName>
          <span
            onClick={() =>
              openUrl(
                `https://${store?.shopify_domain}/products/${item.handle}`
              )
            }
          >
            {item.title}
          </span>
        </StyledItemName>
        <StyledItemAction
          onClick={(e: any) => {
            onRemove({ index: indexOfAllData, id: item.id });
          }}
        >
          <Icon source={XSmallIcon} tone="subdued" />
        </StyledItemAction>
      </StyledItem>
    );
  };

  return (
    <Card padding="0">
      <StyledList>
        <Scrollable style={{ maxHeight: "320px" }} horizontal={false}>
          <ReactSortable list={data} setList={(val) => handleDrag(val, data)}>
            {data.map((item, index) => {
              let indexOfAllData = allData.findIndex(
                (itemAll) => itemAll.id == item.id
              );
              let isDisable =
                item.status != STATUS_ACTIVE ||
                (item.inventory_management && item.stock <= 0);
              // let isDisable = item.status != STATUS_ACTIVE
              if (!isDisable) {
                return renderItem({ item, isDisable, indexOfAllData });
              }
              return (
                <Tooltip
                  key={item.id}
                  content={isDisable ? "This product is out of stock" : ""}
                >
                  {renderItem({ item, isDisable, indexOfAllData })}
                </Tooltip>
              );
            })}
          </ReactSortable>
        </Scrollable>
      </StyledList>
    </Card>
  );
};

export default ComplementaryProductsTable;
