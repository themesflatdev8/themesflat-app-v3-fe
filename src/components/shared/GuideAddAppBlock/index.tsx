import { useCallback } from "react";
import { useAuthContext } from "@/features/auth/contexts";
import { Text, Badge, Link } from "@shopify/polaris";
import {
  StyledContainer,
  StyledContent,
  StyledPreview,
  StyledSteps,
  StyledStep,
} from "./styled-components";
import { Modal } from "@/components/core";
import { SHOPIFY_THEME_APP_EXTENSION_ID } from "@/config/env";
import { openChat } from "@/utils/chat";
import guideImage from "~/images/guide-app-block.png";

type Props = {
  open: boolean;
  onClose: Function;
};

const GuideAddAppBlock = ({ open, onClose }: Props) => {
  const [{ store }]: any = useAuthContext();

  const openUrl = useCallback((path: string) => {
    window.open(`shopify://admin${path}`, "_blank");
  }, []);

  return (
    <Modal
      open={open}
      title="How to activate M-Sell bundle widget on Product page"
      width="980px"
      onClose={() => onClose()}
    >
      <StyledContainer>
        <StyledContent>
          <StyledSteps>
            <StyledStep>
              <Badge tone="info">1</Badge>
              <Text variant="bodyMd" as="p">
                Go to Product page on{" "}
                <Link
                  onClick={() =>
                    openUrl(
                      `/themes/current/editor?template=product&addAppBlockId=${SHOPIFY_THEME_APP_EXTENSION_ID}/bundle&target=mainSection`
                    )
                  }
                  removeUnderline
                >
                  Themes Editor
                </Link>
                {/* Go to Product page on <Link onClick={() => openUrl(slugProduct ? `/themes/current/editor?previewPath=/products/${slugProduct}` : `/themes/current/editor?template=product&addAppBlockId=${SHOPIFY_THEME_APP_EXTENSION_ID}/bundle&target=mainSection`)} removeUnderline >Themes Editor</Link> */}
              </Text>
            </StyledStep>
            <StyledStep>
              <Badge tone="info">2</Badge>
              <Text variant="bodyMd" as="p">
                If you have not added M-Sell Bundles block before, click Add
                block on desired supported section (for e.g. Subtotal), and
                select block named “M-Sell Bundles”
              </Text>
            </StyledStep>
            <StyledStep>
              <Badge tone="info">3</Badge>
              <Text variant="bodyMd" as="p">
                Drag-and-drop M-Sell widget block to your desired position
              </Text>
            </StyledStep>
            <StyledStep>
              <Badge tone="info">4</Badge>
              <Text variant="bodyMd" as="p">
                Click Save on the top right screen to take effect.
              </Text>
            </StyledStep>
            <StyledStep>
              <Badge tone="info">5</Badge>
              <Text variant="bodyMd" as="p">
                Check your Product page again to make sure that the M-Sell
                widget is displayed properly
              </Text>
            </StyledStep>
          </StyledSteps>
          <div style={{ marginBottom: "8px" }}>
            <Text variant="bodyMd" as="span" tone="subdued">
              {`Doesn't work? Contact support `}
            </Text>
            <Link removeUnderline onClick={() => openChat()}>
              here
            </Link>
          </div>
        </StyledContent>
        <StyledPreview>
          <img src={guideImage.src} alt="" style={{ width: "100%" }} />
        </StyledPreview>
      </StyledContainer>
    </Modal>
  );
};
export default GuideAddAppBlock;
