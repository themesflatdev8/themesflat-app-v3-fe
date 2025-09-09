import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import {
  Page,
  Card,
  IndexTable,
  Text,
  Spinner,
  Button,
  Select,
  Pagination,
  Toast,
  Frame,
  Icon,
  useIndexResourceState,
  ButtonGroup,
} from "@shopify/polaris";
import type { IndexTableProps } from "@shopify/polaris";
import type { Range } from "@shopify/polaris/build/ts/src/utilities/index-provider";
import { EditIcon, DeleteIcon, CheckIcon } from "@shopify/polaris-icons";
import axios from "@/utils/axios";
import { Container } from "@/components/core";

interface Review {
  id: string;
  user_name: string;
  parent_id: string | number | null;
  review_text: string;
  review_title: string;
  rating: number;
  status: "approved" | "pending";
  created_at: string;
  [key: string]: unknown;
}

type SelectionType = Parameters<
  NonNullable<IndexTableProps["onSelectionChange"]>
>[0];

const ProductReviewsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [total, setTotal] = useState(0);

  const [toastActive, setToastActive] = useState(false);
  const [toastContent, setToastContent] = useState("");
  const toggleToast = useCallback(() => setToastActive(false), []);

  const [unselected, setUnselected] = useState<string[]>([]);

  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
    clearSelection,
  } = useIndexResourceState(reviews);

  const [selectAcrossPages, setSelectAcrossPages] = useState(false);

  // ✅ custom handle selection
  const customHandleSelectionChange = (
    selectionType: SelectionType,
    toggleType: boolean,
    selection?: string | Range,
    position?: number
  ) => {
    if (selectionType === "page") {
      handleSelectionChange(selectionType, toggleType, selection, position);
      setSelectAcrossPages(false);
      setUnselected([]);
      return;
    }

    if (
      selectAcrossPages &&
      selectionType === "single" &&
      typeof selection === "string"
    ) {
      const id = selection;
      if (toggleType) {
        setUnselected((prev) => prev.filter((x) => x !== id));
      } else {
        setUnselected((prev) => (prev.includes(id) ? prev : [...prev, id]));
      }
      return;
    }

    handleSelectionChange(selectionType, toggleType, selection, position);
  };

  const fetchProductReviews = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await axios.get(`/review/${id}`, {
        params: { page, per_page: perPage },
      });

      const apiData = Array.isArray(res.data?.data) ? res.data.data : [];
      setReviews(
        apiData.map((r: any, index: number) => ({
          id: r.id?.toString() ?? index.toString(),
          user_name: r.user_name || "",
          parent_id: r.parent_id ?? null,
          review_text: r.review_text || "",
          review_title: r.review_title || "",
          rating: r.rating || 0,
          status: r.status || "pending",
          created_at: r.created_at || "",
        }))
      );
      setTotal(res.data?.total ?? apiData.length);
    } catch (err) {
      console.error("Failed to fetch product reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductReviews();
    clearSelection();
    setUnselected([]);
    setSelectAcrossPages(false);
  }, [id, page]);

  const handleBulkAction = async (action: "approved" | "pending" | "delete") => {
    try {
      let payload: any = { action };

      if (selectAcrossPages) {
        payload.select_all = true;
        payload.unselected = unselected;
        payload.ids = [];
      } else if (allResourcesSelected) {
        payload.ids = reviews.map((r) => r.id);
        payload.select_all = false;
        payload.unselected = [];
      } else {
        payload.ids = selectedResources;
        payload.select_all = false;
        payload.unselected = [];
      }

      await axios.post(`/review/bulk-action`, payload);

      if (action === "delete") {
        setReviews((prev) =>
          prev.filter((r) => {
            const isSelected =
              payload.select_all
                ? !payload.unselected.includes(r.id)
                : payload.ids.includes(r.id);
            return !isSelected;
          })
        );
      } else {
        setReviews((prev) =>
          prev.map((r) => {
            const isSelected =
              payload.select_all
                ? !payload.unselected.includes(r.id)
                : payload.ids.includes(r.id);
            return isSelected ? { ...r, status: action } : r;
          })
        );
      }

      setToastContent("Bulk action success");
      setToastActive(true);

      clearSelection();
      setUnselected([]);
      setSelectAcrossPages(false);
    } catch (err) {
      console.error(err);
      setToastContent("Bulk action failed");
      setToastActive(true);
    }
  };

  const resourceName = { singular: "review", plural: "reviews" };

  return (
    <Container size="xl">
      <Frame>
        <Page
          fullWidth
          title={`Reviews for Product #${id}`}
          backAction={{
            content: "Back",
            onAction: () => router.push("/reviews"),
          }}
        >
          <Card>
            {loading ? (
              <div className="flex justify-center p-6">
                <Spinner accessibilityLabel="Loading reviews" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="p-6 text-center">
                <Text variant="bodyMd" as="p">
                  No reviews found
                </Text>
              </div>
            ) : (
              <>
                {(selectedResources.length > 0 ||
                  allResourcesSelected ||
                  selectAcrossPages) && (
                  <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-4">
                      <Button
                        size="slim"
                        variant="plain"
                        onClick={() => {
                          clearSelection();
                          setUnselected([]);
                          setSelectAcrossPages(false);
                        }}
                      >
                        Clear selection
                      </Button>
                    </div>
                    <ButtonGroup>
                      <Button onClick={() => handleBulkAction("approved")}>
                        Approve
                      </Button>
                      <Button onClick={() => handleBulkAction("pending")}>
                        Set Pending
                      </Button>
                      <Button
                        tone="critical"
                        onClick={() => handleBulkAction("delete")}
                      >
                        Delete
                      </Button>
                    </ButtonGroup>
                  </div>
                )}

                {/* ✅ Nút Select All */}
                <div className="flex justify-start px-4 py-3">
                  <Button
                    size="slim"
                    variant="plain"
                    onClick={() => {
                      setSelectAcrossPages(true);
                      setUnselected([]);
                    }}
                  >
                    Select All
                  </Button>
                </div>

                <IndexTable
                  resourceName={resourceName}
                  itemCount={total}
                  selectedItemsCount={
                    selectAcrossPages
                      ? "All"
                      : allResourcesSelected
                      ? selectedResources.length
                      : selectedResources.length
                  }
                  onSelectionChange={customHandleSelectionChange}
                  bulkActions={[]}
                  headings={[
                    { title: "User Name" },
                    { title: "Is Replace" },
                    { title: "Title" },
                    { title: "Content" },
                    { title: "Rating" },
                    { title: "Status" },
                    { title: "Created At" },
                    { title: "Manage Review" },
                  ]}
                >
                  {reviews.map((r, index) => {
                    const rowSelected = selectAcrossPages
                      ? !unselected.includes(r.id)
                      : allResourcesSelected
                      ? selectedResources.includes(r.id)
                      : selectedResources.includes(r.id);

                    return (
                      <IndexTable.Row
                        id={r.id}
                        key={r.id}
                        position={index}
                        selected={rowSelected}
                      >
                        <IndexTable.Cell>{r.user_name}</IndexTable.Cell>
                        <IndexTable.Cell>
                          {r.parent_id ? (
                            <Icon source={CheckIcon} tone="success" />
                          ) : (
                            "-"
                          )}
                        </IndexTable.Cell>
                        <IndexTable.Cell>{r.review_title}</IndexTable.Cell>
                        <IndexTable.Cell>{r.review_text}</IndexTable.Cell>
                        <IndexTable.Cell>{r.rating} ⭐</IndexTable.Cell>
                        <IndexTable.Cell>
                          <Select
                            label=""
                            options={[
                              { label: "Approved", value: "approved" },
                              { label: "Pending", value: "pending" },
                            ]}
                            value={r.status}
                            onChange={(value) =>
                              handleBulkAction(value as "approved" | "pending")
                            }
                          />
                        </IndexTable.Cell>
                        <IndexTable.Cell>{r.created_at}</IndexTable.Cell>
                        <IndexTable.Cell>
                          <div className="flex gap-2">
                            <Button icon={EditIcon} onClick={() => {}} />
                            <Button icon={DeleteIcon} onClick={() => {}} />
                          </div>
                        </IndexTable.Cell>
                      </IndexTable.Row>
                    );
                  })}
                </IndexTable>

                <div className="flex justify-center p-4">
                  <Pagination
                    hasPrevious={page > 1}
                    onPrevious={() => setPage((prev) => prev - 1)}
                    hasNext={page * perPage < total}
                    onNext={() => setPage((prev) => prev + 1)}
                  />
                </div>
              </>
            )}
          </Card>
        </Page>

        {toastActive && <Toast content={toastContent} onDismiss={toggleToast} />}
      </Frame>
    </Container>
  );
};

export default ProductReviewsPage;
