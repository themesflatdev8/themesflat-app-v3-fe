import { useState, useCallback, useMemo, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Card,
  Box,
  Button,
  Text,
  Collapsible,
  BlockStack,
  Icon,
  InlineStack,
  Divider,
  ButtonGroup,
  Toast,
  Tooltip,
  Badge,
  Banner,
  Link,
} from "@shopify/polaris";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from "@shopify/polaris-icons";
import { Image } from "@/components/core";
import {
  StyledContainer,
  StyledCard,
  StyledGuideIcon,
  StyledBadge,
  StyledGuideCollapse,
} from "./styled-components";
import CircleCheckIcon from "@/features/dashboard/assets/circle-check.svg";
import CircleCheckedIcon from "@/features/dashboard/assets/circle-checked.svg";
import { useAuthContext } from "@/features/auth/contexts";
import api from "@/features/quick-setup/api";
import verifyAppApi from "@/api/verify-app";
import apiBundle from "@/features/product-bundles/api";
import { _queryKey } from "@/constants/react-query";
import { _typeReducer } from "@/features/auth/constants";
import { SHOPIFY_THEME_APP_EXTENSION_ID } from "@/config/env";
import SyncDiscount from '@/features/dashboard/components/Discount/SyncDiscount';

export default function SetupGuide({}) {
   return (
    <Card>
      <Box padding="600">
        <BlockStack gap="300" align="center">
          <Text variant="headingLg" as="h2">
            👋 Welcome to the app!
          </Text>
        
          <SyncDiscount />
        </BlockStack>
      </Box>
    </Card>
  );
}
