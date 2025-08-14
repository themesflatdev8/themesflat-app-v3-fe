import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Box, Text, Card, Grid } from "@shopify/polaris";
import { SelectOptionList } from "@/components/core";
import { StyledContainer, StyledCardHeader } from "./styled-components";
import _routes from "@/constants/routes";
import { useAuthContext } from "@/features/auth/contexts";
import { _queryKey } from "@/constants/react-query";
import api from "@/features/dashboard/api";

export default function Analytics({}) {
  const router = useRouter();

  const [{ store }]: any = useAuthContext();
  const [by, setBy] = useState("30_days");

  const { data } = useQuery([_queryKey.getStatistics, { by }], async () => {
    const res = await api.getStatistics({ date_range: by });
    if (res.status && res.data) {
      return res.data;
    }
    return {
      total_order: 0,
      total_bundle: 0,
      total_revenue: 0,
    };
  });

  return (
    <StyledContainer>
      <Card>
        <Box paddingBlockEnd="400">
          <Text as="h3" variant="headingMd">
            Analytics
          </Text>
          <Text as="p" variant="bodyMd" tone="subdued">
            Keep track of the total orders and how M-Sell could help across all
            sales channels in a specific time frame
          </Text>
        </Box>
        <Grid
          columns={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
          gap={{ xs: "24px", sm: "24px", md: "24px", lg: "24px", xl: "24px" }}
        >
          <Card>
            <StyledCardHeader>
              <label>Total published bundle</label>
              <strong>{data?.total_bundle || 0}</strong>
            </StyledCardHeader>
          </Card>
          <Card>
            <StyledCardHeader>
              <label>Total orders</label>
              <strong>{data?.total_order || 0}</strong>
            </StyledCardHeader>
          </Card>
          <Card>
            <StyledCardHeader>
              <label>Total revenue</label>
              <strong>{data?.total_revenue || 0}</strong>
            </StyledCardHeader>
          </Card>
        </Grid>
      </Card>
    </StyledContainer>
  );
}
