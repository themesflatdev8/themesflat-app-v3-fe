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
import guideImage from "~/images/guide-app-embed.png";

type Props = {
  open: boolean;
  onClose: Function;
};

const GuideAddAppEmbed = ({ open, onClose }: Props) => {
  const [{ store }]: any = useAuthContext();

  const openUrl = useCallback((path: string) => {
    window.open(`shopify://admin${path}`, "_blank");
  }, []);

  return (
    <Modal
      open={open}
      title="How to activate M-Sell App embed"
      width="980px"
      onClose={() => onClose()}
    >
      <StyledContainer>
        <StyledContent>
          <StyledSteps>
            <StyledStep>
              <Badge tone="info">1</Badge>
              <Text variant="bodyMd" as="p">
                Go to{" "}
                <Link
                  onClick={() =>
                    openUrl(
                      `/themes/current/editor?context=apps&template=&activateAppId=${SHOPIFY_THEME_APP_EXTENSION_ID}/app-embed`
                    )
                  }
                  removeUnderline
                >
                  App embed
                </Link>{" "}
                in your Theme Editor
              </Text>
            </StyledStep>
            <StyledStep>
              <Badge tone="info">2</Badge>
              <Text variant="bodyMd" as="p">
                {`Turn on the “M-Sell" toggle to activate it`}
              </Text>
            </StyledStep>
            <StyledStep>
              <Badge tone="info">3</Badge>
              <Text variant="bodyMd" as="p">
                Click Save at top right corner
              </Text>
            </StyledStep>
            <StyledStep>
              <Badge tone="info">4</Badge>
              <Text variant="bodyMd" as="p">
                Click below button to verify your settings
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
export default GuideAddAppEmbed;
