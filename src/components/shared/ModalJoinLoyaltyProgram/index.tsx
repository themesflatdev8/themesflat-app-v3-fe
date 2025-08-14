import { useCallback } from "react";
import { useRouter } from "next/router";
import { BlockStack, Button, Text } from "@shopify/polaris";
import { Modal, Image } from "@/components/core";
import { StyledModalContent } from "./styled-components";
import _routes from "@/constants/routes";

type Props = {
  open: boolean;
  onClose: Function;
};

const ModalJoinLoyaltyProgram = ({ open, onClose }: Props) => {
  const router = useRouter();

  const openUrl = useCallback((url: string) => {
    window.open(url, "_blank");
    onClose();
  }, []);

  return (
    <Modal
      open={open}
      closable={true}
      className=""
      onClose={() => onClose()}
      width="620px"
      sectioned={false}
    >
      <StyledModalContent>
        <BlockStack gap="400">
          <div style={{ textAlign: "center" }}>
            <Image
              root={true}
              src={""}
              width="80"
              height="80"
              style={{ objectFit: "cover", objectPosition: "center" }}
              alt=""
            ></Image>
          </div>
          <BlockStack gap="100">
            <Text variant="headingSm" as="h3">
              {`Join our Loyalty Program to gain exclusive access to M-Sell AI,`}
              <br></br>
              {`propel business to new heights`}
            </Text>
            <Text variant="bodyMd" as="p" tone="subdued">
              {`As a valued member, you'll gain access to a fantastic feature that's exclusive to our loyal customers – the power to generate product recommendations in bulk using M-Sell AI.`}
            </Text>
          </BlockStack>
          <div>
            <Button
              variant="primary"
              onClick={() => router.push(_routes.LOYALTY)}
            >
              Join now
            </Button>
          </div>
        </BlockStack>
      </StyledModalContent>
    </Modal>
  );
};

export default ModalJoinLoyaltyProgram;
