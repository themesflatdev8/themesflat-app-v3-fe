import { useCallback, useState } from "react";
import { Box, Card, Text, CalloutCard, BlockStack } from "@shopify/polaris";
import { StyledItem } from "./styled-components";
import _routes from "@/constants/routes";
import { LINK_BLOG_1, LINK_BLOG_2, LINK_BLOG_3 } from "@/constants/link";
import img1 from "@/features/dashboard/assets/blog-1.jpg";
import img2 from "@/features/dashboard/assets/blog-2.png";
import img3 from "@/features/dashboard/assets/blog-3.png";

const listFeature = [
  {
    title: "Average Order Value: Definition and 5 Ways To Grow It (2024)",
    image: img1.src,
    description:
      "Looking for cost-effective ways to earn more revenue for your online store? Check out these five ideas to increase average order value—and the Shopify apps to help you execute.",
    url: LINK_BLOG_1,
    action: "Read more",
  },
  {
    title: "Price Bundling: How Price Bundling Helps Increase Sales",
    image: img2.src,
    description:
      "Price bundling allows you to offer related products for an enticing price, prompting customers to order more than they might have otherwise.",
    url: LINK_BLOG_2,
    action: "Read more",
  },
  {
    title: "Best Limited-Time Offer Ideas to Drive More Ecommerce Sales",
    image: img3.src,
    description:
      "Learn proven strategies to create compelling limited-time offers that turn hesitant shoppers into eager buyers.",
    url: LINK_BLOG_3,
    action: "Read more",
  },
];

export default function Feature({}) {
  const openUrl = useCallback((url: string) => {
    window.open(url, "_blank");
  }, []);

  return (
    <Card>
      <Box paddingBlockEnd="400">
        <Text as="h3" variant="headingMd">
          Shopify’s Best Kept Secrets
        </Text>
        <Text as="p" variant="bodyMd" tone="subdued">
          Stay ahead of the game with the freshest tips, trends, and tricks to
          make your store the hottest one on the block.
        </Text>
      </Box>
      <BlockStack gap="400">
        {listFeature.map((item, index) => (
          <StyledItem key={index}>
            <CalloutCard
              title={item.title}
              primaryAction={{
                content: item.action,
                onAction: () => openUrl(item.url),
              }}
              illustration={item.image}
            >
              <p>{item.description}</p>
            </CalloutCard>
          </StyledItem>
        ))}
      </BlockStack>
    </Card>
  );
}
