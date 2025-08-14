import { useCallback } from "react";
import { useRouter } from "next/router";
import { Button, Text } from "@shopify/polaris";
import { Modal, Image } from "@/components/core";
import unlockImage from "~/images/popup-unlock.png";
import { StyledModalContent } from "./styled-components";
import _routes from "@/constants/routes";

type Props = {
  open: boolean;
  onClose: Function;
};

const ModalUnlock = ({ open, onClose }: Props) => {
  const router = useRouter();

  const openUrl = useCallback((url: string) => {
    window.open(url, "_blank");
    onClose();
  }, []);

  return (
    <Modal
      open={open}
      title="Unlock Exclusive Benefits with Loyalty Program"
      closable={true}
      className=""
      onClose={() => onClose()}
      width="620px"
      sectioned={true}
      footerAlign="center"
      secondaryAction={{
        content: "Maybe later",
        onAction: () => onClose(),
      }}
      primaryAction={{
        content: "Join now",
        onAction: () => {
          onClose();
          router.push(_routes.LOYALTY);
        },
      }}
    >
      <StyledModalContent>
        <div style={{ textAlign: "center" }}>
          <Image
            root={true}
            src={unlockImage.src}
            width="80"
            height="80"
            style={{ objectFit: "cover", objectPosition: "center" }}
            alt=""
          ></Image>
        </div>
        <Text variant="bodyMd" as="p" fontWeight="semibold">
          {`As a valued member, you'll gain access to a fantastic feature that's exclusive to our loyal customers – the power to generate product recommendations in bulk using M-Sell AI.`}
        </Text>
      </StyledModalContent>
    </Modal>
  );
};

export default ModalUnlock;
