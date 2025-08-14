import { Text, Badge, Link } from "@shopify/polaris";
import { Modal } from "@/components/core";
import {
  StyledModalContent,
  StyledModalSteps,
  StyledModalStep,
} from "./styled-components";
import ChromeIcon from "~/icons/chrome.svg";
import { LINK_CHROME_EXTENSION } from "@/constants/link";
import { useCallback } from "react";

type Props = {
  open: boolean;
  onClose: Function;
  onCancel: Function;
};

const ModalRequireExtension = ({ open, onClose, onCancel }: Props) => {
  const onOpenUrl = useCallback((url: string) => {
    window.open(url, "_blank");
  }, []);

  return (
    <Modal
      open={open}
      closable={true}
      className=""
      onClose={() => onClose()}
      width="620px"
      title="M-Sell extension is required to use this feature"
      primaryAction={{
        content: "Install extension now",
        onAction: () => {
          onOpenUrl(LINK_CHROME_EXTENSION);
          onClose();
        },
      }}
      secondaryAction={{
        content: "Cancel",
        onAction: () => onCancel(),
      }}
    >
      <StyledModalContent>
        <ChromeIcon></ChromeIcon>
        <StyledModalSteps>
          <StyledModalStep>
            <Badge tone="info">1</Badge>
            <Text variant="bodyMd" as="p">
              {`The M-Sell Chrome extension is a powerful tool, fueled by M-Sell AI. It analyzes store theme compatibility, continuously learns from millions of products and orders, along with your store's historical and real-time data. Leveraging this information, it generates add-on product recommendations aimed at enhancing your Average Order Value (AOV) and revenue.`}
            </Text>
          </StyledModalStep>
          <StyledModalStep>
            <Badge tone="info">2</Badge>
            <Text variant="bodyMd" as="p">
              We value your trust and respect your privacy. Our extension
              strictly follows our Privacy Policy and does not collect any
              personal or sensitive data from you or your browser. Learn more
              about our Privacy Policy{" "}
              <Link
                monochrome
                onClick={() =>
                  onOpenUrl("https://msell.app/pages/privacy-policy")
                }
              >
                here
              </Link>
              .
            </Text>
          </StyledModalStep>
        </StyledModalSteps>
      </StyledModalContent>
    </Modal>
  );
};

export default ModalRequireExtension;
