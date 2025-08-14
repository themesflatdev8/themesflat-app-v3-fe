import { useCallback } from "react";
import { Button, Text } from "@shopify/polaris";
import { Modal, Image } from "@/components/core";
import logoShopifyImage from "~/images/logo-shopify.png";
import affiliateImage from "~/images/affiliate.png";
import {
  StyledModalContent,
  StyledModalButtons,
  StyledModalBody,
  StyledModalImage,
} from "./styled-components";
import _routes from "@/constants/routes";
import { LINK_AFF } from "@/constants/link";

type Props = {
  open: boolean;
  onClose: Function;
};

const ModalAffiliate = ({ open, onClose }: Props) => {
  const openUrl = useCallback((url: string) => {
    window.open(url, "_blank");
    onClose();
  }, []);

  return (
    <Modal
      open={open}
      closable={false}
      className=""
      onClose={() => onClose()}
      width="620px"
      sectioned={false}
    >
      <StyledModalContent>
        <StyledModalBody>
          <Image
            root={true}
            src={logoShopifyImage.src}
            width="58"
            height="16"
            style={{ objectFit: "cover", objectPosition: "center" }}
            alt=""
          ></Image>
          <Text variant="headingMd" as="h2">
            Five Ways to Grow the Average Order Value of Your Online Store
          </Text>
          <Text variant="bodyMd" as="p">
            {`It sounds simple enough: If you can get people to spend more money per order, you’ll make more money, right?`}
          </Text>
          <StyledModalButtons>
            <Button onClick={() => openUrl(LINK_AFF)}>Save it</Button>
            <Button variant="primary" onClick={() => openUrl(LINK_AFF)}>
              Read now
            </Button>
          </StyledModalButtons>
        </StyledModalBody>
        <StyledModalImage>
          <Image
            root={true}
            src={affiliateImage.src}
            width="200"
            height="200"
            style={{ objectFit: "cover", objectPosition: "center" }}
            alt=""
          ></Image>
        </StyledModalImage>
      </StyledModalContent>
    </Modal>
  );
};

export default ModalAffiliate;
