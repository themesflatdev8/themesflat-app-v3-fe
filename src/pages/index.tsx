import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Page, Card, BlockStack } from "@shopify/polaris";
import { StyledContainer } from "@/features/dashboard/styled-components";
import _routes from "@/constants/routes";
import Feature from "@/features/dashboard/components/Feature";
import SetupGuide from "@/features/dashboard/components/SetupGuide";
import Welcome from "@/features/dashboard/components/Welcome";
import Blog from "@/features/dashboard/components/Blog";
import Analytics from "@/features/dashboard/components/Analytics";
import FAQs from "@/features/dashboard/components/FAQs";
import { Container } from "@/components/core";
import { useAuthContext } from "@/features/auth/contexts";
import { isEmpty } from "@/utils/lodash";

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
