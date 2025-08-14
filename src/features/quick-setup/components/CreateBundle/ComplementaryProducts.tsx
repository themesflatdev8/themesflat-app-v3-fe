import { useState, useMemo } from "react";
import { Text, InlineStack, Card, BlockStack } from "@shopify/polaris";
import ComplementaryProductsTable from "@/features/product-bundles/components/ComplementaryProductsTable";
import ComplementaryProductsFilter from "@/features/product-bundles/components/ComplementaryProductsFilter";
import ModalAddProducts from "@/features/product-bundles/components/ModalAddProduct";
import { useFieldArray } from "react-hook-form";
import { clone } from "@/utils/lodash";

type Props = {
  errors: any;
  control: any;
  watch: any;
  setValue: any;
  mainData: any;
};

function ComplementaryProducts({
  errors,
  control,
  watch,
  setValue,
  mainData,
}: Props) {
  const [modalAddProducts, setModalAddProducts] = useState({
    open: false,
    keyword: "",
  });

  const { remove } = useFieldArray({
    control,
    name: "list_commendations",
  });
  let allWatchedValues = watch({ nest: true });

  const data = useMemo(() => {
    return [...allWatchedValues.list_commendations];
  }, [allWatchedValues]);

  const onRemove = ({ index, id }: any) => {
    if (index < 0) return;
    remove(index);
  };

  const onAddProducts = (payload: any) => {
    setValue("list_commendations", payload.list, { shouldDirty: true });
  };

  const checkExtensionAdd = (payload: any) => {
    setModalAddProducts((prev: any) => {
      return { open: true, keyword: payload.keyword || "" };
    });
  };

  return (
    <>
      <Card padding="400">
        <BlockStack gap="100">
          <InlineStack
            gap="500"
            wrap={false}
            align="space-between"
            blockAlign="start"
          >
            <BlockStack gap="200">
              <Text variant="bodyMd" as="h3" fontWeight="semibold">
                Recommended products in bundle
              </Text>
            </BlockStack>
          </InlineStack>
          <div>
            <ComplementaryProductsFilter
              error={
                errors?.list_commendations?.message &&
                allWatchedValues.list_commendations?.length <= 0
                  ? errors?.list_commendations?.message
                  : ""
              }
              onAdd={(payload: any) => checkExtensionAdd(payload)}
            ></ComplementaryProductsFilter>
            {data &&
              (data.length > 0 ? (
                <ComplementaryProductsTable
                  allData={allWatchedValues.list_commendations}
                  data={clone(data)}
                  setValue={setValue}
                  onRemove={(payload: any) => onRemove(payload)}
                ></ComplementaryProductsTable>
              ) : null)}
          </div>
        </BlockStack>
      </Card>

      {modalAddProducts.open ? (
        <ModalAddProducts
          idsExclude={mainData.map((item: any) => item.id) || []}
          open={modalAddProducts.open}
          selected={allWatchedValues.list_commendations}
          onAdd={(payload: any) => onAddProducts(payload)}
          onClose={() =>
            setModalAddProducts((prev: any) => {
              return { open: false, keyword: "" };
            })
          }
          title={"Add recommended products"}
          keyword={modalAddProducts.keyword}
        ></ModalAddProducts>
      ) : null}
    </>
  );
}

export default ComplementaryProducts;
