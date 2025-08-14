import { useState, useCallback } from "react";
import {
  Card,
  Box,
  Button,
  Text,
  Collapsible,
  BlockStack,
  Link,
  InlineStack,
  Icon,
} from "@shopify/polaris";
import { ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";

export default function FAQs({}) {
  const [open1, setOpen1] = useState(false);
  const handleToggle1 = useCallback(() => setOpen1((open) => !open), []);
  const [open2, setOpen2] = useState(false);
  const handleToggle2 = useCallback(() => setOpen2((open) => !open), []);
  const [open3, setOpen3] = useState(false);
  const handleToggle3 = useCallback(() => setOpen3((open) => !open), []);

  return (
    <Card>
      <Box paddingBlockEnd="400">
        <Text as="h3" variant="headingMd">
          FAQs
        </Text>
      </Box>
      <BlockStack gap="400">
        <BlockStack key={1} gap="200">
          <InlineStack wrap={false} gap="200">
            <Button
              onClick={handleToggle1}
              ariaControls={`fqa-${1}`}
              variant="monochromePlain"
              textAlign="left"
            >
              How many create bundle?
            </Button>
            <span>
              <Icon source={open1 ? ChevronUpIcon : ChevronDownIcon}></Icon>
            </span>
          </InlineStack>
          <Collapsible
            open={open1}
            id={`fqa-${1}`}
            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
            expandOnPrint
          >
            <div>
              <p>
                Your mailing list lets you contact customers or visitors who
                have shown an interest in your store. Reach out to them with
                exclusive offers or updates about your products.
              </p>
              <Link url="#">Test link</Link>
            </div>
          </Collapsible>
        </BlockStack>
        <BlockStack key={2} gap="200">
          <InlineStack wrap={false} gap="200">
            <Button
              onClick={handleToggle2}
              ariaControls={`fqa-${2}`}
              variant="monochromePlain"
              textAlign="left"
            >
              Does M-Sell work with Draft Bundle?
            </Button>
            <span>
              <Icon source={open2 ? ChevronUpIcon : ChevronDownIcon}></Icon>
            </span>
          </InlineStack>
          <Collapsible
            open={open2}
            id={`fqa-${2}`}
            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
            expandOnPrint
          >
            <Text as="p" variant="bodyMd" tone="subdued">
              <p>
                Your mailing list lets you contact customers or visitors who
                have shown an interest in your store. Reach out to them with
                exclusive offers or updates about your products.
              </p>
              <Link url="#">Test link</Link>
            </Text>
          </Collapsible>
        </BlockStack>
        <BlockStack key={3} gap="200">
          <InlineStack wrap={false} gap="200">
            <Button
              onClick={handleToggle3}
              ariaControls={`fqa-${3}`}
              variant="monochromePlain"
              textAlign="left"
            >
              How to customization bundle?
            </Button>
            <span>
              <Icon source={open3 ? ChevronUpIcon : ChevronDownIcon}></Icon>
            </span>
          </InlineStack>
          <Collapsible
            open={open3}
            id={`fqa-${3}`}
            transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
            expandOnPrint
          >
            <Text as="p" variant="bodyMd" tone="subdued">
              <p>
                Your mailing list lets you contact customers or visitors who
                have shown an interest in your store. Reach out to them with
                exclusive offers or updates about your products.
              </p>
              <Link url="#">Test link</Link>
            </Text>
          </Collapsible>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
