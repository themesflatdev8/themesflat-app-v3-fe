import { useRouter } from "next/router";
import _routes from "@/constants/routes";
import { Banner } from "@shopify/polaris";
import { StyledBlockFeature } from "./styled-components";
import { CSSProperties } from "styled-components";

type Props = {
  content?: any;
  hasIcon?: boolean;
  style?: CSSProperties;
  btnText?: string;
  onAction?: Function | null;
  type?: any;
};

const BlockFeature = ({
  content,
  hasIcon = true,
  style,
  btnText = "",
  type = "info",
  onAction,
}: Props) => {
  const router = useRouter();

  const doAction = () => {
    if (onAction) {
      onAction();
    } else {
      router.push(_routes.PRICING);
    }
  };

  return (
    <StyledBlockFeature hasIcon={hasIcon} style={style}>
      <Banner
        action={{
          content: btnText ? btnText : "Upgrade now",
          onAction: doAction,
        }}
        tone={type}
      >
        <span dangerouslySetInnerHTML={{ __html: content }}></span>
      </Banner>
    </StyledBlockFeature>
  );
};

export default BlockFeature;
