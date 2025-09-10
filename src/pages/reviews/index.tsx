import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Page,
  Card,
  IndexTable,
  Text,
  useIndexResourceState,
  Button,
  Spinner,
} from "@shopify/polaris";

import { DeleteIcon, EditIcon, ViewIcon } from "@shopify/polaris-icons";
import axios from "@/utils/axios";
import { Container } from "@/components/core";

type ProductReviewSummary = {
  product_id: number;
  title: string | null;
  handle: string | null;
  total_reviews: number;
  avg_rating: string; // từ API trả về dạng string
  created_at: string;
};

const ReviewPageManage: NextPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<(ProductReviewSummary & { id: string })[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/review");

      const items =
        res.data?.map((p: ProductReviewSummary) => ({
          ...p,
          id: p.product_id.toString(), // Polaris yêu cầu id dạng string
        })) || [];

      setProducts(items);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const resourceName = {
    singular: "product",
    plural: "products",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(products);

  return (
    <Container size="xl">
      <Page fullWidth title="Manage Reviews" subtitle="Product review summary">
        <Card>
          {loading ? (
            <div className="flex justify-center p-6">
              <Spinner accessibilityLabel="Loading reviews" />
            </div>
          ) : products.length === 0 ? (
            <div className="p-6 text-center">
              <Text variant="bodyMd" as="p">
                No products found
              </Text>
            </div>
          ) : (
            <IndexTable
              resourceName={resourceName}
              itemCount={products.length}
              selectedItemsCount={
                allResourcesSelected ? "All" : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: "Title" },
                { title: "Handle" },
                { title: "Avg Rating" },
                { title: "Total Reviews" },
                { title: "Last Review At" },
                { title: "Actions" },
              ]}
            >
              {products.map((p, index) => (
                <IndexTable.Row
                  id={p.id}
                  key={p.id}
                  selected={selectedResources.includes(p.id)}
                  position={index}
                >
                  <IndexTable.Cell>
                    <Text as="span" variant="bodyMd">
                      {p.title || "—"}
                    </Text>
                  </IndexTable.Cell>
                  <IndexTable.Cell>{p.handle || "—"}</IndexTable.Cell>
                  <IndexTable.Cell>{p.avg_rating} ⭐</IndexTable.Cell>
                  <IndexTable.Cell>{p.total_reviews}</IndexTable.Cell>
                  <IndexTable.Cell>{p.created_at}</IndexTable.Cell>
                  <IndexTable.Cell>
                    <div className="flex gap-2">
                       <Button
    icon={ViewIcon}
    onClick={() => router.push(`/reviews/${p.product_id}`)}
  />
                    </div>
                  </IndexTable.Cell>
                </IndexTable.Row>
              ))}
            </IndexTable>
          )}
        </Card>
      </Page>
    </Container>
  );
};

export default ReviewPageManage;
