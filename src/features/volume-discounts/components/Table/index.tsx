import React, { useCallback, useMemo, useState } from "react";
import {
  IndexTable,
  Button,
  Badge,
  Thumbnail,
  useIndexResourceState,
  InlineStack,
} from "@shopify/polaris";
import ModalRequireExtension from "@/components/shared/ModalRequireExtension";
import { StyledTable, StyledName, StyledOfferName } from "./styled-components";
import PopoverAction from "@/features/volume-discounts/components/PopoverAction";
import { useAuthContext } from "@/features/auth/contexts";

type Props = {
  data: any;
  onPublish: any;
  onRemove: any;
  onEdit: any;
  pagination: any;
};

const Table = ({ data, pagination, onPublish, onRemove, onEdit }: Props) => {
  const [{ store }]: any = useAuthContext();
  const [listGenerate, setListGenerate]: any = useState([]);
  const [listPublish, setListPublish]: any = useState([]);
  const [openModalRequireExtension, setOpenModalRequireExtension] =
    useState(false);

  const resetSelectedResources = useCallback(() => {
    let page: any = "all";
    handleSelectionChange(page, false, undefined);
  }, []);

  const resourceIDResolver = (record: any) => {
    return record.id;
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(data, {
      resourceIDResolver,
    });

  const handlePublish = ({ isPublish, ids }: any) => {
    let arr = ids ? ids : allResourcesSelected ? [] : selectedResources;
    setListPublish(arr);
    onPublish({
      ids: arr,
      isPublish,
      cb: () => {
        setListPublish(() => []);
      },
    });
    resetSelectedResources();
  };

  const handleRemove = ({ ids }: any) => {
    let arr = ids ? ids : allResourcesSelected ? [] : selectedResources;
    onRemove({ ids: arr });
    resetSelectedResources();
  };

  const openUrl = useCallback((url: string) => {
    window.open(url, "_blank");
  }, []);

  const resourceName = {
    singular: "product in this store",
    plural: "products in this store",
  };

  const promotedBulkActions = useMemo(() => {
    let isPublish = false;
    let isDisablePublish = false;
    let isUnpublish = false;
    let arr = [];
    if (allResourcesSelected) {
      data.map((item: any) => {
        if (item.status) {
          isUnpublish = true;
        } else {
          isPublish = true;
        }
      });
    } else {
      selectedResources.map((id) => {
        let obj = data.find((item: any) => item.id == id);
        if (obj.status) {
          isUnpublish = true;
        } else {
          isPublish = true;
        }
      });
    }
    if (isPublish) {
      arr.push({
        content: "Activate",
        disabled: isDisablePublish,
        onAction: () => {
          handlePublish({ isPublish: true });
        },
      });
    }
    if (isUnpublish) {
      arr.push({
        content: "Deactivate",
        onAction: () => {
          handlePublish({ isPublish: false });
        },
      });
    }
    arr.push({
      content: "Delete",
      destructive: true,
      onAction: () => {
        handleRemove({});
      },
    });
    return arr;
  }, [data, allResourcesSelected, selectedResources, handlePublish]);

  const rowMarkup = data.map((item: any, index: number) => {
    // let isDisable = item.product.status != STATUS_ACTIVE || (item.product.inventory_management && item.product.stock <= 0)
    return (
      <IndexTable.Row
        id={item.id}
        key={item.id}
        position={index}
        selected={selectedResources.includes(item.id)}
        disabled={
          listGenerate.includes(item.id) || listPublish.includes(item.id)
        }
        onClick={() => {}}
      >
        <IndexTable.Cell className="volume-discounts__table-name">
          <StyledOfferName title={item.name}>{item.name}</StyledOfferName>
        </IndexTable.Cell>
        <IndexTable.Cell className="volume-discounts__table-publish">
          {item.status ? (
            <Badge tone="success">Active</Badge>
          ) : (
            <Badge>Draft</Badge>
          )}
        </IndexTable.Cell>
        <IndexTable.Cell className="volume-discounts__table-product-name">
          <InlineStack gap="200" blockAlign="center" wrap={false}>
            <Thumbnail
              source={
                item.product.image ? item.product.image : "/images/no-img.png"
              }
              size="small"
              alt={item.product.title}
            ></Thumbnail>
            <StyledName
              title={item.product?.title}
              onClick={() =>
                openUrl(
                  `https://${store?.shopify_domain}/products/${item.product?.handle}`
                )
              }
            >
              {item.product?.title || ""}
            </StyledName>
          </InlineStack>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <InlineStack gap="200" wrap={false}>
            <Button
              onClick={() =>
                onEdit({id: item.id})
              }
              disabled={
                listGenerate.includes(item.id) || listPublish.includes(item.id)
              }
              variant="secondary"
            >
              Edit
            </Button>
            <PopoverAction
              record={item}
              onRemove={handleRemove}
              onPublish={handlePublish}
            ></PopoverAction>
          </InlineStack>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  return (
    <StyledTable>
      <IndexTable
        resourceName={resourceName}
        itemCount={(data && data.length) || 0}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        hasMoreItems
        promotedBulkActions={promotedBulkActions}
        // bulkActions={bulkActions}
        headings={[
          { title: "Volume discount name" },
          { title: "Status" },
          { title: "Product" },
          { title: "Actions" },
        ]}
        pagination={pagination}
      >
        {rowMarkup}
      </IndexTable>

      <ModalRequireExtension
        open={openModalRequireExtension}
        onClose={() => setOpenModalRequireExtension(false)}
        onCancel={() => setOpenModalRequireExtension(false)}
      ></ModalRequireExtension>
    </StyledTable>
  );
};

export default Table;
