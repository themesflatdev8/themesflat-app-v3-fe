import styled from "styled-components";

export const StyledContainer = styled.div``;

export const StyledContent = styled.div`
  flex: 1;
  display: flex;
  height: 100%;
  border-radius: var(--p-border-radius-200);
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
  position: sticky;
  top: 0;
  max-height: calc(100vh - 24px);
  @media (max-width: 767px) {
    border-top: 1px solid #dcdbdb;
  }
`;

export const StyledSkeleton = styled.div`
  padding: 20px;
  .Polaris-SkeletonTabs__Tab {
    width: 100% !important;
  }
`;

export const StyledFooter = styled.div`
  padding: 16px;
  border-top: 1px solid #c9cccf;
  text-align: right;
`;
