import styled from "styled-components";

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  .gvl-popup {
    z-index: 1 !important;
    position: absolute !important;
  }
`;
export const StyledContent = styled.div<any>`
  position: relative;
  padding: 12px;
  height: 100%;
  overflow: scroll;
`;

export const StyledContentWrapper = styled.div<any>`
  width: 100%;
  background: #ffffff;
  ${(props) =>
    props.isVertical
      ? `
    padding: 24px;
    height: max-content;
    max-width: 414px;
    margin: auto;
    transform: scale(0.85);
    margin-left: 27%;
    margin-bottom: -15%;
    transform-origin: left top;
    ${
      props.type == "bundle"
        ? `
    `
        : `
      position: absolute;
      left: 0;
    `
    }
  `
      : `
    padding: 40px 24px;
    transform: scale(0.75);
    margin-left: 20px;
   
    ${
      props.type == "bundle"
        ? `
      transform-origin: left top;
      margin-bottom: -18%;
    `
        : `
       transform-origin: left center;
      position: absolute;
      left: 0;
    `
    }
    min-width: 960px;
  `}
`;

export const StyledHeader = styled.div<any>`
  .Polaris-Select__Backdrop {
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;