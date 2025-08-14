import styled from "styled-components";

export const StyledContainer = styled.div<any>`
  position: relative;
  border-radius: 8px;
  border: 1px solid #cccccc;
  background: #ffffff;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  /* margin-top: 16px; */
  padding: 16px;
  .Polaris-Thumbnail {
    ${(props) =>
      props.sizeImage == "sm"
        ? `
      width: 40px !important;
      height: 40px;
      min-width: 40px !important;
    `
        : `
      width: 60px !important;
      height: 60px;
      min-width: 60px !important;
    `}
  }
  a {
    font-size: 14px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const StyledPrice = styled.span`
  font-size: var(--p-font-size-100);
  line-height: var(--p-font-line-height-2);
  font-weight: 400;
  margin: 0 0 8px;
  text-align: inherit;
  display: block;
`;

export const StyledHelpText = styled.span`
  color: var(--Text-Default, #202223);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
`;

export const StyledClose = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  min-width: 20px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  svg {
    fill: #8a8a8a;
    transform: scale(1.15);
  }
`;
