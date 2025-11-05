"use client";

import {
  Card,
  Box,
  BlockStack,
  InlineStack,
  Icon,
  Text,
  Badge,
  Button,
} from "@shopify/polaris";
import {
  ThemeTemplateIcon,
  ProductIcon,
  AppsIcon,
  ViewIcon,
} from "@shopify/polaris-icons";
import Image from "next/image";
import styles from "./setup-guide.module.scss";
import { useAuthContext } from "@/features/auth/contexts";

// Import static GIFs
import step1Img from "../../assets/step1.gif";
import step2Img from "../../assets/step2.gif";
import step3Img from "../../assets/step3.gif";
import step4Img from "../../assets/step4.gif";

export default function SetupGuide() {
  const [{ store }]: any = useAuthContext();
  const storeName = store?.shop
    ? store.shop.replace(".myshopify.com", "")
    : "your-store-name";

  const steps = [
    {
      icon: ThemeTemplateIcon,
      title: "Open Theme Editor",
      detail:
        "Go to Online Store → Themes → Customize to open your store’s visual editor.",
      image: step1Img,
    },
    {
      icon: ProductIcon,
      title: "Select Product Page",
      detail: "Select ‘Products → Default product page’.",
      image: step2Img,
    },
    {
      icon: AppsIcon,
      title: "Add Review Widget",
      detail:
        "Click ‘Add block’ → choose ‘App blocks’ → select Review Widget.",
      image: step3Img,
    },
    {
      icon: ViewIcon,
      title: "Preview your store",
      detail:
        "Check that the Review Widget appears correctly on the product page.",
      image: step4Img,
    },
  ];

  return (
    <div className={styles.wrapper}>
      <Card>
        <Box padding="800">
          <BlockStack gap="400">
            {/* Header */}
            <div className={styles.header}>
              <Text as="h2" variant="headingLg" alignment="center">
                👋 Welcome to Your Review App
              </Text>
              <Text as="p" tone="subdued" alignment="center">
                Follow these simple steps to install your Review Widget.
              </Text>
            </div>

            {/* Steps */}
            <div className={styles.steps}>
              <BlockStack gap="400">
                {steps.map((step, idx) => {
                  const imageSrc =
                    typeof step.image === "string"
                      ? step.image
                      : step.image.src;
                  const isGif = imageSrc.toLowerCase().endsWith(".gif");

                  return (
                    <div key={idx} className={styles.stepItem}>
                      <div className={styles.stepInfo}>
                        <div className={styles.iconBox}>
                          <Icon source={step.icon} color="base" />
                        </div>
                        <div className={styles.textBox}>
                          <InlineStack gap="100" blockAlign="center">
                            <Text as="h3">{step.title}</Text>
                            {step.badge && (
                              <Badge tone="success">{step.badge}</Badge>
                            )}
                          </InlineStack>
                          <Text as="p" tone="subdued">
                            {step.detail}
                          </Text>
                        </div>
                      </div>

                      {/* ✅ GIF loop vĩnh viễn */}
                      <div className={styles.imageWrapper}>
                        {isGif ? (
                          <img
                            src={`${imageSrc}?t=${Date.now()}`}
                            alt={step.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              borderRadius: "8px",
                              display: "block",
                            }}
                            loading="lazy"
                          />
                        ) : (
                          <Image
                            src={imageSrc}
                            alt={step.title}
                            fill
                            unoptimized
                            style={{
                              objectFit: "contain",
                              borderRadius: "8px",
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </BlockStack>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <BlockStack gap="400">
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="primary"
                    size="large"
                    url={`https://admin.shopify.com/store/${
                      storeName || "your-store-name"
                    }/themes`}
                    target="_blank"
                  >
                    Go to Theme Editor
                  </Button>
                </div>
                {/* <Text as="p" tone="subdued" alignment="center">
                  Need help?{" "}
                  <a
                    href="https://help.shopify.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View documentation
                  </a>
                </Text> */}
              </BlockStack>
            </div>
          </BlockStack>
        </Box>
      </Card>
    </div>
  );
}
