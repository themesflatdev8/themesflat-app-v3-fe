import styled from "styled-components";

export const StyledHeader = styled.div`
  margin-bottom: 24px;
  /* padding-bottom: 32px; */
  padding-top: 32px;
  /* border-bottom: 1px solid #E1E3E5; */
  svg,
  img {
    margin-bottom: 8px;
  }
`;

export const StyledProgress = styled.div`
  margin-top: 24px;
  margin-bottom: 12px;
`;

export const StyledProgressBar = styled.div`
  position: relative;
  margin-top: 12px;
  > div {
    height: 8px;
  }
  > span {
    position: absolute;
    bottom: 100%;
    right: 0;
    margin-bottom: 8px;
  }
  .Polaris-ProgressBar__Indicator {
    background-color: #91d0ff;
  }
`;

export const StyledSteps = styled.div`
  position: relative;
  margin-top: 20px;
  > div + div {
    padding-top: 20px;
  }
`;

export const StyledStep = styled.div`
  display: flex;
  align-items: start;
  position: relative;
  z-index: 1;
`;

export const StyledStepIcon = styled.div<any>`
  flex-basis: 28px;
  background-color: #fff;
  border-radius: 9999px;
  height: 28px;
  width: 28px;
  .Polaris-Icon {
    /* height: auto;
    width: auto; */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ${(props) =>
    props.step == "1" &&
    `
      border: 1px solid #CAE6FF;
    .Polaris-Icon{
      width: 26px;
      height: 26px;
      svg{
        width: 26px;
        height: 26px;
      }
    }
  `}
  ${(props) =>
    props.step == "2" || props.step == "3" || props.step == "4"
      ? `
    display: flex;
    align-items: center;
    justify-content: center;
    .Polaris-Icon{
      svg{
        width: 20px;
        height: 20px;
      }
    }
    ${
      props.status == "progress"
        ? `
      padding: 3px;
      outline: 1px solid #A4E8F2;
      .Polaris-Icon{
        border-radius: 9999px;
        background-color: #EAF4FF;
        padding: 2px;
      }
      svg{
        fill: #0094D5;
      }
    `
        : ``
    }
    ${
      props.status == ""
        ? `
      padding: 4px;
      outline: 1px solid #C9CCCF;
      svg{
        fill: #BABEC3;
      }
    `
        : ``
    }
  `
      : `
      
  `}
  ${(props) =>
    props.status == "complete"
      ? `
    background: #AEE9D1;
    padding: 4px;
    svg{
      fill: #007F5F;
    }
  `
      : ``}
`;
export const StyledStepContent = styled.div<any>`
  flex: 1;
  margin-left: 16px;
  h6 {
    /* text-transform: uppercase; */
    padding: 4px 0px;
    color: var(--p-color-text);
    font-size: 14px;
    font-style: normal;
    cursor: pointer;
    &:hover {
      color: var(--p-color-text);
    }
    ${(props) =>
      props.status == "complete"
        ? `
      font-weight: 650;
    `
        : `
      font-weight: 450;
    `}
  }
`;
export const StyledStepBody = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  @media (max-width: 489px) {
    flex-direction: column;
  }
`;
export const StyledStepContentImage = styled.div`
  flex-basis: 30%;
  img {
    border-radius: 8px;
    width: 100%;
  }
  @media (max-width: 489px) {
    margin-top: 20px;
  }
`;
export const StyledStepDescription = styled.div<any>`
  flex: 1;
  /* padding-right: 24px; */
  .Polaris-Icon {
    margin: unset;
    display: inline-block;
  }
  > p + p {
    margin-top: 8px;
  }
  > .Polaris-Button,
  > .Polaris-Link {
    margin-top: 16px;
    .Polaris-Icon {
      margin-bottom: -4px;
    }
  }
  > .Polaris-Link {
    display: flex;
    align-items: center;
    .Polaris-Icon {
      fill: var(--p-interactive);
    }
  }
  .Polaris-ExceptionList {
    margin-top: 16px;
    &__Description {
      color: #6d7175;
    }
    .Polaris-ExceptionList__Item + .Polaris-ExceptionList__Item {
      margin-top: 8px;
    }
    .Polaris-Link {
      color: #6d7175;
    }
  }
  .Polaris-ButtonGroup {
    margin-top: 8px;
  }
  .Polaris-Banner {
    background: #f6f6f7;
    border: 1px solid #babfc3;
    border-radius: 4px;
    margin-top: 24px;
    h2 {
      color: #347c84;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
    }
    ul {
      padding-left: 12px;
      margin: 16px 0;
      list-style-type: auto;
      li + li {
        margin-top: 8px;
      }
    }
  }
  ${(props) =>
    props.step == "2" || props.step == "3"
      ? `
    // .Polaris-Button{
    //   &__Content{
    //     display: flex;
    //     flex-direction: row-reverse;
    //   }
    //   &__Text{
    //     margin-left: 0;
    //     margin-right: var(--p-space-100);
    //   }
    // }
  `
      : ""}
  ${(props) =>
    props.step == "1"
      ? `
    >p{
      .Polaris-Icon{
        svg{
          fill: #FF375F;
        }
      }
    }
  `
      : ""}
  @media (max-width: 489px) {
    padding-right: 0;
  }
`;
export const StyledStepLine = styled.div`
  position: absolute;
  width: 1px;
  height: auto;
  top: 0px;
  bottom: 0;
  left: 13px;
  background-color: #e1e3e5;
  margin: 8px 0;
`;

export const StyledBenefits = styled.div<any>`
  ${(props) =>
    props.complete &&
    `
    border-radius: 8px;
    background: linear-gradient(281deg, #C9D5FF -5.52%, #F0F3FF 32.35%, #FFF 62.68%, #F4F7FF 83%, #D1DBFF 121.61%);
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.15), 0px 0px 5px 0px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    .Polaris-ShadowBevel{
      >.Polaris-Box, &:before{
        border-radius: 0;
        background: transparent;
        box-shadow: none;
      }
    }
    svg{
      fill: #8051FF !important;
    }
  `}
`;
export const StyledBenefitsHeader = styled.div<any>`
  padding: 24px 24px 20px;
  display: flex;
  align-items: flex-start;
  gap: 24px;
  border-bottom: 1px solid #c9cccf;
  h2 {
    color: var(--text-default, #202223);
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 28px;
    margin-bottom: 16px;
  }
  p {
    color: var(--text-default, #202223);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }
`;

export const StyledBenefitsExceptionList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  > div {
    /* flex-basis: 50%; */
    /* max-width: calc(50% - 8px); */
  }
  > .Polaris-Text--root {
    margin-bottom: 16px;
  }
  .Polaris-Icon {
    margin: 0 4px 0 0;
    flex-basis: 20px;
    svg {
      fill: #007b5c;
    }
  }
  > div {
    display: flex;
    align-items: start;
    > p {
      flex: 1;
    }
  }
`;

export const StyledRating = styled.div<any>`
  border-radius: 8px;
  border: 1px solid var(--border-neutral-subdued, #babfc3);
  background: var(--surface-neutral-subdued, #f6f6f7);
  padding: 16px 16px 16px 20px;
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

export const StyledRatingImage = styled.div``;

export const StyledRatingContent = styled.div`
  p {
    color: var(--text-default, #202223);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    margin-bottom: 12px;
  }
`;

export const StyledInlineError = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  strong {
    color: #8e1f0b;
    font-size: 13px;
    font-style: normal;
    font-weight: 550;
    line-height: 20px;
    margin-left: 4px;
    margin-right: 4px;
  }
  .Polaris-Icon {
    margin: unset;
    svg {
      fill: #8e1f0b;
    }
  }
  a,
  button,
  a:hover,
  button:hover {
    color: #616161;
  }
  p,
  div {
    color: #616161;
    font-size: 13px;
    font-style: normal;
    font-weight: 450;
    line-height: 20px;
  }
`;

export const StyledApplyStatus = styled.div`
  ul {
    list-style-type: none;
    padding: 16px 12px;
    border-radius: var(--p-border-radius-200, 8px);
    background: var(--p-color-surface-magic, #f8f7ff);
    li + li {
      margin-top: 12px;
    }
  }
  li {
    display: flex;
    align-items: flex-start;
    gap: 4px;
    > span {
      width: 20px;
      min-width: 20px;
      height: 20px;
      border-radius: 100px;
      background: var(--p-color-surface-magic-active, #e9e5ff);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--p-color-text-magic, #5700d1);
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: 16px;
    }
    > div {
      color: var(--Text-Default, #202223);
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      > div {
        display: inline-block;
        > span {
          display: inline-block;
          margin: 0 2px -8px;
          cursor: pointer;
          padding: 4px;
          border-radius: var(--p-border-radius-button, 8px);
          background: var(--p-color-bg-fill, #ffffff);
          box-shadow:
            0px -1px 0px 0px #b5b5b5 inset,
            -1px 0px 0px 0px #e3e3e3 inset,
            1px 0px 0px 0px #e3e3e3 inset,
            0px 1px 0px 0px #e3e3e3 inset;
        }
      }
      .Polaris-Icon {
        width: 20px;
        height: 20px;
      }
    }
  }
`;

export const StyledActionApplyStatus = styled.div`
  .Polaris-Badge {
    background-color: #cdfee1;
    span {
      color: #0c5132;
      font-weight: 600;
    }
    svg {
      fill: #29845a;
    }
  }
`;
