import { useCallback } from "react";
import { Button, Text, Grid } from "@shopify/polaris";
import { Modal, Image } from "@/components/core";
import diamond from "~/images/diamond.png";
import {
  StyledModalContent,
  StyledModalInfo,
  StyledModalFooter,
  StyledLine,
  StyledModalImage,
} from "./styled-components";
import { LINK_RATE } from "@/constants/link";

type Props = {
  open: boolean;
  onClose: Function;
  planName?: string;
};

const ModalUpgradePlan = ({ open, onClose, planName = "" }: Props) => {
  const openUrl = useCallback((url: string) => {
    window.open(url, "_blank");
    onClose();
  }, []);

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      width="620px"
      // animation="left-to-right"
    >
      <StyledModalContent>
        <Grid
          columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }}
          gap={{ xs: "16px", sm: "16px", md: "24px", lg: "24px", xl: "24px" }}
        >
          <div>
            <StyledModalInfo>
              <h3>Upgraded successfully to</h3>
              <Text variant="headingMd" as="h2">
                <span style={{ textTransform: "capitalize" }}>
                  {planName || ""}
                </span>
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                You are on the right track! <br></br>Keep going and explore new
                features.
              </Text>
              <Button variant="primary" onClick={() => onClose()}>
                Explore now
              </Button>
            </StyledModalInfo>
          </div>
          <div>
            <StyledModalImage>
              <Image
                root={true}
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  maxWidth: "196px",
                }}
                src={diamond.src}
                width="170"
                height="168"
                alt=""
              ></Image>
            </StyledModalImage>
          </div>
        </Grid>
      </StyledModalContent>
      <StyledLine></StyledLine>
      <StyledModalFooter>
        <Text as="p" variant="bodyMd">
          Do you find app helpful?{" "}
        </Text>
        <div>
          <Button onClick={() => openUrl(LINK_RATE)}>Yes! Rate app now</Button>
          <Button variant="plain" onClick={() => onClose()}>
            Maybe later
          </Button>
        </div>
      </StyledModalFooter>
    </Modal>
  );
};

export default ModalUpgradePlan;
