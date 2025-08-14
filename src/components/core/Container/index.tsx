import * as React from "react";
import { StyledContainer } from "./styled-components";

type Props = {
  children?: React.ReactNode;
  className?: string;
  size?: string;
  style?: any;
  fullHeight?: boolean;
};

const Container: React.FC<Props> = ({
  children,
  className,
  size = "xl",
  style,
  fullHeight = false,
}: Props) => {
  return (
    <StyledContainer size={size} style={style} fullHeight={fullHeight}>
      {children}
    </StyledContainer>
  );
};

export default Container;
