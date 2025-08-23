import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Page, Card, BlockStack } from "@shopify/polaris";
import _routes from "@/constants/routes";
import Welcome from "@/features/dashboard/components/Welcome";
import { Container } from "@/components/core";
import { useAuthContext } from "@/features/auth/contexts";

const HomePage: NextPage = () => {
  const router = useRouter();
  const [{ store }]: any = useAuthContext();

  return (
    <Container size="lg">
      <Page fullWidth title="Dashboard">
        <BlockStack gap="400">
          {/* <SetupGuide></SetupGuide> */}
          <Welcome></Welcome>

          {/* <Feature></Feature> */}

          {/* <FAQs></FAQs> */}

          {/* <Analytics></Analytics> */}

          {/* <Blog></Blog> */}
        </BlockStack>
      </Page>
    </Container>
  );
};

export default HomePage;
