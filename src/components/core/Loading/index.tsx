import { StyledLoadingContainer } from "./styled-components";
import { Spinner } from "@shopify/polaris";
type Props = {
  children?: React.ReactNode;
  size?: any;
  position?: any;
};
const Loading = ({ size = "small", position = "fixed" }: Props) => {
  return (
    <StyledLoadingContainer style={{ position: position }}>
      <Spinner accessibilityLabel="Loading" size={size} />
    </StyledLoadingContainer>
  );
};

export default Loading;
