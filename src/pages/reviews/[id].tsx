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
  Modal,
  TextField,
} from "@shopify/polaris";
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

  // --- FETCH REVIEWS ---
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
      setTotal(res.data?.total || apiData.length);
    } catch (err) {
      console.error("Failed to fetch product reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductReviews();
  }, [id, page]);

  // --- UPDATE STATUS (SINGLE) ---
  const handleStatusChange = async (
    reviewId: string,
    status: "approved" | "pending"
  ) => {
    try {
      await axios.post(`/review/bulk-action`, {
        action: status,
        select_all: false,
        unselected: [],
        ids: [reviewId],
      });

      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
      );
      setToastContent("Update success");
      setToastActive(true);
    } catch (err) {
      console.error(err);
    }
  };

  // --- DELETE SINGLE REVIEW ---
  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const openDeleteModal = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setDeleteModalActive(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await axios.post(`/review/bulk-action`, {
        action: "delete",
        select_all: false,
        unselected: [],
        ids: [reviewToDelete],
      });
      setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete));
      setToastContent("Delete success");
      setToastActive(true);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteModalActive(false);
      setReviewToDelete(null);
    }
  };

  // --- EDIT MODAL ---
  const [editModalActive, setEditModalActive] = useState(false);
  const [editReview, setEditReview] = useState<Review | null>(null);

  const openEditModal = (review: Review) => {
    setEditReview(review);
    setEditModalActive(true);
  };

  const closeEditModal = () => {
    setEditModalActive(false);
    setEditReview(null);
  };

  const handleEditSave = async () => {
    if (!editReview) return;
    try {
      await axios.post(`/review/update/${editReview.id}`, {
        rating: editReview.rating,
        review_title: editReview.review_title,
        review_text: editReview.review_text,
      });

      setReviews((prev) =>
        prev.map((r) => (r.id === editReview.id ? editReview : r))
      );

      setToastContent("Review updated successfully");
      setToastActive(true);
      closeEditModal();
    } catch (err) {
      console.error(err);
    }
  };

  const resourceName = { singular: "review", plural: "reviews" };

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
                <IndexTable
                  resourceName={resourceName}
                  itemCount={total}
                  selectable={false} // 👈 tắt chọn nhiều
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
                  {reviews.map((r, index) => (
                    <IndexTable.Row id={r.id} key={r.id} position={index}>
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
                         label="Status"
                          options={[
                            { label: "Approved", value: "approved" },
                            { label: "Pending", value: "pending" },
                          ]}
                          value={r.status}
                          onChange={(value) =>
                            handleStatusChange(
                              r.id,
                              value as "approved" | "pending"
                            )
                          }
                        />
                      </IndexTable.Cell>
                      <IndexTable.Cell>{r.created_at}</IndexTable.Cell>
                      <IndexTable.Cell>
                        <div className="flex gap-2">
                          <Button
                            icon={EditIcon}
                            onClick={() => openEditModal(r)}
                          />
                          <Button
                            icon={DeleteIcon}
                            tone="critical"
                            onClick={() => openDeleteModal(r.id)}
                          />
                        </div>
                      </IndexTable.Cell>
                    </IndexTable.Row>
                  ))}
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

        {toastActive && (
          <Toast content={toastContent} onDismiss={toggleToast} />
        )}

        {/* Edit Modal */}
        {editModalActive && editReview && (
          <Modal
            open={editModalActive}
            onClose={closeEditModal}
            title="Edit Review"
            primaryAction={{
              content: "Save",
              onAction: handleEditSave,
            }}
            secondaryActions={[{ content: "Cancel", onAction: closeEditModal }]}
          >
            <Modal.Section>
              <div className="space-y-4">
                <TextField
                  label="Review Title"
                  value={editReview.review_title}
                  onChange={(val) =>
                    setEditReview({ ...editReview, review_title: val })
                  }
                  autoComplete="off"
                />

                <TextField
                  label="Review Content"
                  value={editReview.review_text}
                  onChange={(val) =>
                    setEditReview({ ...editReview, review_text: val })
                  }
                  multiline={4}
                  autoComplete="off"
                />

                <Select
                  label="Rating"
                  options={[
                    { label: "1 ⭐", value: "1" },
                    { label: "2 ⭐⭐", value: "2" },
                    { label: "3 ⭐⭐⭐", value: "3" },
                    { label: "4 ⭐⭐⭐⭐", value: "4" },
                    { label: "5 ⭐⭐⭐⭐⭐", value: "5" },
                  ]}
                  value={String(editReview.rating)}
                  onChange={(val) =>
                    setEditReview({ ...editReview, rating: Number(val) })
                  }
                />
              </div>
            </Modal.Section>
          </Modal>
        )}

        {/* Confirm Delete Modal */}
        {deleteModalActive && (
          <Modal
            open={deleteModalActive}
            onClose={() => setDeleteModalActive(false)}
            title="Confirm Delete"
            primaryAction={{
              content: "Delete",
              destructive: true,
              onAction: confirmDelete,
            }}
            secondaryActions={[
              { content: "Cancel", onAction: () => setDeleteModalActive(false) },
            ]}
          >
            <Modal.Section>
              <Text as="p">Are you sure you want to delete this review?</Text>

            </Modal.Section>
          </Modal>
        )}
      </Frame>
    </Container>
  );
};

export default ProductReviewsPage;
