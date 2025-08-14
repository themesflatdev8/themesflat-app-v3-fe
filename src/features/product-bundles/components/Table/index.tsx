import React, { useCallback, useMemo, useState } from "react";
import {
  IndexTable,
  Thumbnail,
  Button,
  Badge,
  Tooltip,
  useIndexResourceState,
  InlineStack,
} from "@shopify/polaris";
import { ComposeIcon, DeleteIcon } from "@shopify/polaris-icons";
import { Image, Switch } from "@/components/core";
import ModalRequireExtension from "@/components/shared/ModalRequireExtension";
import { useRouter } from "next/router";
import _routes from "@/constants/routes";
import {
  StyledTable,
  StyledThumbnail,
  StyledName,
  StyledBundleName,
  StyledProduct,
  StyledThumbnailWrap,
} from "./styled-components";
import PopoverAction from "@/features/product-bundles/components/PopoverAction";
import { useAuthContext } from "@/features/auth/contexts";
import { checkInstallExtension } from "@/utils/chrome-extension";
import { clone, isEmpty } from "@/utils/lodash";
import {
  STATUS_ACTIVE,
  TYPE_SPECIFIC,
  TYPE_COLLECTION,
  TYPE_GENERAL,
  STRATEGY_MANUAL_PICK,
  STRATEGY_AI,
} from "@/features/product-bundles/constants";

type Props = {
  data: any;
  onPublish: any;
  onRegenerate: any;
  onRemove: any;
  pagination: any;
  onEdit: any;
};

const Table = ({
  data,
  onPublish,
  onRegenerate,
  onRemove,
  pagination,
  onEdit,
}: Props) => {
  const router = useRouter();
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

  const handleRegenerate = () => {
    let ids = allResourcesSelected ? [] : selectedResources;
    setListGenerate(ids);
    onRegenerate({
      ids,
      cb: (res: any) => {
        setListGenerate(() => []);
      },
    });
    resetSelectedResources();
  };

  const checkExtensionGen = () => {
    if (!isEmpty(store?.bl)) {
      handleRegenerate();
      return;
    }
    checkInstallExtension({
      cb: (res: any) => {
        if (res.status) {
          handleRegenerate();
        } else {
          setOpenModalRequireExtension(true);
        }
      },
    });
  };

  const getBundleName = useCallback((record: any) => {
    return record.name;
  }, []);

  const getStrategy = useCallback((record: any) => {
    if (!record.mode) return "";
    switch (record.mode) {
      case STRATEGY_AI:
        return "M-Sell AI";
      default:
        return "Hand pick";
    }
  }, []);

  const getBundleType = useCallback((record: any) => {
    if (!record.type) return "";
    switch (record.type) {
      case TYPE_GENERAL:
        return "Any products";
      case TYPE_COLLECTION:
        return (
          record.list_default_collections?.[0]?.title || "Specific collections"
        );
      default:
        return record.list_default_products?.length <= 1 &&
          record.list_default_products[0]
          ? record.list_default_products[0].title
          : "Specific products";
    }
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
        if (
          item.list_commendations?.length <= 0 &&
          item.mode == STRATEGY_MANUAL_PICK
        ) {
          isDisablePublish = true;
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
        if (
          obj.list_commendations?.length <= 0 &&
          obj.mode == STRATEGY_MANUAL_PICK
        ) {
          isDisablePublish = true;
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
      icon: DeleteIcon,
      destructive: true,
      onAction: () => {
        handleRemove({});
      },
    });
    // arr.push({
    //   content: 'Generate by M-Sell AI',
    //   onAction: () => {
    //     checkExtensionGen()
    //   }
    // })
    return arr;
  }, [
    data,
    allResourcesSelected,
    selectedResources,
    handlePublish,
    checkExtensionGen,
  ]);

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
        {/* <IndexTable.Cell className="bundle-table-publish" >
            <span onClick={(e: any) => e.stopPropagation()}>
              {item.list_commendations?.length <= 0 && item.mode == STRATEGY_MANUAL_PICK ? (
                <Tooltip content={"To publish this product, please add at least one recommended product first."}>
                  <Switch
                    checked={false}
                    disabled={true}
                  ></Switch>
                </Tooltip>
              ) : (
                <Switch
                  checked={item.status}
                  disabled={listGenerate.includes(item.id) || listPublish.includes(item.id)}
                  onChange={(val: boolean) => handlePublish({isPublish: val, ids: [item.id]})}
                ></Switch>
              )}
            </span>
          </IndexTable.Cell> */}
        <IndexTable.Cell className="bundle-table-name">
          <StyledBundleName title={getBundleName(item)}>
            {getBundleName(item)}
          </StyledBundleName>
        </IndexTable.Cell>
        <IndexTable.Cell className="bundle-table-publish">
          {item.status ? (
            <Badge tone="success">Active</Badge>
          ) : (
            <Badge>Draft</Badge>
          )}
        </IndexTable.Cell>
        <IndexTable.Cell className="">
          {getBundleType(item)}{" "}
          {item.type == "collection"
            ? `${item.list_default_collections.length ? `(${item.list_default_collections.length} collections selected)` : ""}`
            : item.type == "specific"
              ? `${item.list_default_products?.length ? `(${item.list_default_products?.length} products selected)` : ""}`
              : ""}
        </IndexTable.Cell>
        <IndexTable.Cell className="">{getStrategy(item)}</IndexTable.Cell>
        <IndexTable.Cell className="bundle-table-actions">
          <InlineStack gap="200" wrap={false}>
            <Button
              onClick={() => onEdit(item.id)}
              disabled={listPublish.includes(item.id)}
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
          { title: "Bundle name" },
          { title: "Status" },
          { title: "Type" },
          { title: "Strategy" },
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
