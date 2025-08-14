import type { NextPage } from "next";
import { Text, Card, Button } from "@shopify/polaris";
import styled from "styled-components";
import { openChat } from "@/utils/chat";

type Props = {};

const ContactPage: NextPage = ({}: Props) => {
  return (
    <StyledContainer>
      <Card padding="600">
        <StyledContent>
          <Text as="h2" variant="headingLg" fontWeight="semibold">
            Contact us to use M-Sell for development store
          </Text>
          <Text as="p" variant="bodyMd" tone="subdued">
            Users, agencies, or store builders who wish to to use M-Sell for
            specific purposes, feel free to contact our customer service team
          </Text>
        </StyledContent>
        <Button variant="primary" onClick={() => openChat()}>
          Contact us
        </Button>
      </Card>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  margin: 50px auto 0;
  padding: 20px;
  text-align: center;
  .Polaris-ShadowBevel > .Polaris-Box {
    padding: 64px 0;
  }
`;

const StyledContent = styled.div`
  margin: 0 auto;
  h2 {
    font-weight: 650;
  }
  p {
    margin-top: 16px;
    margin-bottom: 16px;
  }
`;

export default ContactPage;
