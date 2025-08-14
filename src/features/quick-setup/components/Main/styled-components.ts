import styled from "styled-components";

export const StyledContainer = styled.div``;

export const StyledCampaign = styled.div<any>`
  border: 1px solid var(--p-color-border, #d9d9d9);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  ${(props) =>
    props.active
      ? `
    border: 1px solid var(--p-color-border-emphasis, rgba(0, 91, 211, 1));
  `
      : ""}
`;

export const StyledModalView = styled.div`
  img {
    position: unset !important;
  }
`;
