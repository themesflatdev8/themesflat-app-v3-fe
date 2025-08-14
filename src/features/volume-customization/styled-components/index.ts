import styled from "styled-components";

export const StyledContainer = styled.div`
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 24px;
  height: calc(100vh - 16px);
  overflow: hidden;
  .Polaris-Page {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0;
    max-width: unset;
    > div:nth-child(2) {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      > .Polaris-Banner {
        margin-bottom: 20px;
      }
    }
  }
  .Polaris-Banner .Polaris-Link {
    color: #2c6ecb;
  }
  @media (max-width: 489px) {
    padding: 0 16px;
    & > .Polaris-Page > .Polaris-Box {
      padding: 20px 0;
    }
  }
  @media (max-width: 767px) {
    height: auto;
  }
`;

export const StyledContent = styled.div`
  flex: 1;
  display: flex;
  height: 100%;
  border-radius: var(--p-border-radius-200);
  overflow: hidden;
  background: #ffffff;
  @media (max-width: 767px) {
    flex-direction: column;
  }
`;
export const StyledSettings = styled.div`
  flex-basis: 426px;
  min-width: 426px;
  background: #ffffff;
  border-right: 1px solid #babfc4;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* .Polaris-LegacyTabs{
    padding: 0 12px;
    &__TabContainer{
      flex-basis: 50%;
    }
    &__Panel{
      overflow: hidden;
      height: 100%;
      flex: 1;
    }
  }
  >div:nth-child(1){
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex-grow: 1;
  } */
  @media (max-width: 767px) {
    min-width: unset;
    flex-basis: 100%;
    border-right: none;
  }
`;
export const StyledPreview = styled.div`
  flex: 1;
  overflow: hidden;
  @media (max-width: 767px) {
    border-top: 1px solid #dcdbdb;
  }
`;

export const StyledSkeleton = styled.div`
  .Polaris-SkeletonTabs__Tab {
    width: 100% !important;
  }
`;

export const StyledFooter = styled.div`
  padding: 16px;
  border-top: 1px solid #c9cccf;
  text-align: right;
`;

export const StyledAnalyze = styled.div`
  /* margin-bottom: 20px; */
  margin: 16px 16px 4px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow:
    1px 0px 0px 0px rgba(0, 0, 0, 0.13) inset,
    -1px 0px 0px 0px rgba(0, 0, 0, 0.13) inset,
    0px -1px 0px 0px rgba(0, 0, 0, 0.17) inset,
    0px 1px 0px 0px rgba(204, 204, 204, 0.5) inset,
    0px 3px 1px -1px rgba(26, 26, 26, 0.07);
  padding: 16px;
  .Polaris-Badge {
    border-radius: 8px;
    background: #ffe600;
    padding: 4px 8px;
    span {
      font-weight: 550;
    }
  }
`;
