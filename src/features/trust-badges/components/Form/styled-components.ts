import styled from "styled-components";

export const StyledContainer = styled.div``;

export const StyledContent = styled.div`
  flex: 1;
  display: flex;
  height: 100%;
  border-radius: var(--p-border-radius-200);
  gap: 16px;
  @media (max-width: 767px) {
    flex-direction: column;
  }
  .Polaris-Scrollable:focus {
    outline: none;
  }
`;
export const StyledSettings = styled.div`
  flex-basis: 400px;
  min-width: 400px;
  /* background: #FFFFFF; */
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  > .Polaris-ShadowBevel {
    border-top-right-radius: 0;
    height: 100%;
    &:before {
      border-top-right-radius: 0;
    }
  }
  @media (max-width: 767px) {
    min-width: unset;
    flex-basis: 100%;
    border-right: none;
  }
`;
export const StyledPreview = styled.div`
  flex: 1;
  overflow: hidden;
`;