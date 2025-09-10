import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Page, Card, BlockStack } from "@shopify/polaris";
import _routes from "@/constants/routes";
import Welcome from "@/features/dashboard/components/Welcome";
import { Container } from "@/components/core";
import { useAuthContext } from "@/features/auth/contexts";
import SyncDiscount from '@/features/dashboard/components/Discount/SyncDiscount';

const HomePage: NextPage = () => {
  const router = useRouter();
  const [{ store }]: any = useAuthContext();

  return (
    
    <Container size="lg">

      <Page fullWidth title="Dashboard">
                      <SyncDiscount />

        <BlockStack gap="400">
          <Welcome></Welcome>

          {/* <SetupGuide></SetupGuide> */}

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
