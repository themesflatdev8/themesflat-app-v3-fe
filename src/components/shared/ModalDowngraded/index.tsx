import { useCallback } from "react";
import { Text } from "@shopify/polaris";
import { Modal, Image } from "@/components/core";
import { StyledModalContent } from "./styled-components";

type Props = {
  open: boolean;
  onClose: Function;
  planName: string;
};

const ModalDowngraded = ({ open, onClose, planName }: Props) => {
  const openUrl = useCallback((url: string) => {
    window.open(url, "_blank");
    onClose();
  }, []);

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      title={`Downgraded successfully`}
      footerAlign="center"
      primaryAction={{
        content: "Explore now",
        onAction: () => onClose(),
      }}
      secondaryAction={{
        content: "Learn more",
        onAction: () =>
          openUrl(
            "https://msell.freshdesk.com/support/solutions/articles/150000095921-what-will-happen-with-my-data-when-i-upgrade-or-downgrade-my-plan"
          ),
      }}
    >
      <StyledModalContent>
        <Image
          root={true}
          style={{ objectFit: "cover", objectPosition: "center" }}
          src={""}
          width="48"
          height="48"
          alt=""
        ></Image>
        <Text as="p" variant="bodyMd">
          {`You’re `}
          <strong style={{ fontWeight: "600" }}>{planName}</strong>
          {` plan now. Some features will be limited ​following the new plan.`}
        </Text>
      </StyledModalContent>
    </Modal>
  );
};

export default ModalDowngraded;
