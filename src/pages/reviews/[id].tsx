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
  Modal,
  Link,
} from "@shopify/polaris";
import type { IndexTableProps } from "@shopify/polaris";
import type { Range } from "@shopify/polaris/build/ts/src/utilities/index-provider";
import { DeleteIcon } from "@shopify/polaris-icons";
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

const MAX_LENGTH = 60;

const ProductReviewsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
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

  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [contentModalActive, setContentModalActive] = useState(false);
  const [contentModalText, setContentModalText] = useState("");

  const handleOpenDeleteModal = (id: string) => {
    setDeleteId(id);
    setDeleteModalActive(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.post(`/review/delete/${deleteId}`);
      setReviews((prev) => prev.filter((r) => r.id !== deleteId));
      setToastContent("Delete success");
      setToastActive(true);
    } catch (err) {
      console.error(err);
      setToastContent("Delete failed");
      setToastActive(true);
    } finally {
      setDeleteModalActive(false);
      setDeleteId(null);
    }
  };

  // custom selection
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
    if (!id) return;

    try {
      let payload: any = { action, product_id: id };

      if (selectAcrossPages) {
        payload.select_all = true;
        payload.unselected = unselected;
        payload.selected = [];
      } else {
        // Chỉ lấy những review được tick
        payload.select_all = false;
        payload.unselected = [];
        payload.selected = selectedResources;
      }

      if (!payload.select_all && payload.selected.length === 0) {
        setToastContent("No reviews selected");
        setToastActive(true);
        return;
      }

      await axios.post(`/review/bulk-action`, payload);

      if (action === "delete") {
        setReviews((prev) =>
          prev.filter((r) => {
            const isSelected = payload.select_all
              ? !payload.unselected.includes(r.id)
              : payload.selected.includes(r.id);
            return !isSelected;
          })
        );
      } else {
        setReviews((prev) =>
          prev.map((r) => {
            const isSelected = payload.select_all
              ? !payload.unselected.includes(r.id)
              : payload.selected.includes(r.id);
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

  const handleSingleStatusChange = async (
    reviewId: string,
    status: "approved" | "pending"
  ) => {
    if (!id) return;

    try {
      await axios.post(`/review/update-status/${reviewId}`, {
        status,
        product_id: id,
      });
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
      );
      setToastContent(`Review status updated to ${status}`);
      setToastActive(true);
    } catch (err) {
      console.error(err);
      setToastContent("Status update failed");
      setToastActive(true);
    }
  };

  const resourceName = { singular: "review", plural: "reviews" };

  const truncateText = (text: string) => {
    if (text.length > MAX_LENGTH) {
      return (
        <>
          {text.slice(0, MAX_LENGTH)}...
          <Link
            removeUnderline
            onClick={() => {
              setContentModalText(text);
              setContentModalActive(true);
            }}
          >
            View
          </Link>
        </>
      );
    }
    return text;
  };

  return (
    <Container size="xl">
      <Frame>
        <Page
          fullWidth
          title={`Reviews for Product #${id}`}
          backAction={{ content: "Back", onAction: () => router.push("/reviews") }}
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
                    selectAcrossPages ? "All" : selectedResources.length
                  }
                  onSelectionChange={customHandleSelectionChange}
                  bulkActions={[]}
                  headings={[
                    { title: "Reviewer" },
                    { title: "Title" },
                    { title: "Content" },
                    { title: "Rating" },
                    { title: "Status" },
                    { title: "Created At" },
                    { title: "Actions" },
                  ]}
                >
                  {reviews.map((r, index) => {
                    const rowSelected = selectAcrossPages
                      ? !unselected.includes(r.id)
                      : selectedResources.includes(r.id);

                    return (
                      <IndexTable.Row
                        id={r.id}
                        key={r.id}
                        position={index}
                        selected={rowSelected}
                      >
                        <IndexTable.Cell>{r.user_name}</IndexTable.Cell>
                        <IndexTable.Cell className="truncate">
                          {truncateText(r.review_title)}
                        </IndexTable.Cell>
                        <IndexTable.Cell className="truncate">
                          {truncateText(r.review_text)}
                        </IndexTable.Cell>
                        <IndexTable.Cell>{r.rating} ⭐</IndexTable.Cell>
                        <IndexTable.Cell>
                          <Select
                            label=""
                            labelHidden
                            options={[
                              { label: "Approved", value: "approved" },
                              { label: "Pending", value: "pending" },
                            ]}
                            value={r.status}
                            onChange={(value) =>
                              handleSingleStatusChange(r.id, value as "approved" | "pending")
                            }
                          />
                        </IndexTable.Cell>
                        <IndexTable.Cell>{r.created_at}</IndexTable.Cell>
                        <IndexTable.Cell>
                          <Button
                            icon={DeleteIcon}
                            tone="critical"
                            onClick={() => handleOpenDeleteModal(r.id)}
                          />
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

        <Modal
          open={deleteModalActive}
          onClose={() => setDeleteModalActive(false)}
          title="Delete review"
          primaryAction={{
            content: "Delete",
            destructive: true,
            onAction: handleConfirmDelete,
          }}
          secondaryActions={[{ content: "Cancel", onAction: () => setDeleteModalActive(false) }]}
        >
          <Modal.Section>
            <Text variant="bodyMd" as="p">
              Are you sure you want to delete this review?
            </Text>
          </Modal.Section>
        </Modal>

        <Modal
          open={contentModalActive}
          onClose={() => setContentModalActive(false)}
          title="Full content"
          primaryAction={{ content: "Close", onAction: () => setContentModalActive(false) }}
        >
          <Modal.Section>
            <Text variant="bodyMd" as="p">{contentModalText}</Text>
          </Modal.Section>
        </Modal>

        {toastActive && <Toast content={toastContent} onDismiss={toggleToast} />}
      </Frame>
    </Container>
  );
};

export default ProductReviewsPage;
