import styled from "styled-components";

export const StyledContainer = styled.div`
  // background: #fff;
  .Polaris-Button__Text {
    white-space: nowrap;
  }
  .Polaris-Banner .Polaris-Link {
    color: #2c6ecb;
  }
`;

export const StyledItem = styled.div`
  /* padding: 20px; */
`;
export const StyledItemClose = styled.div`
  position: absolute;
  top: 8px;
  right: 14px;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
`;
