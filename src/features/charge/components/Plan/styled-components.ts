import styled from "styled-components";
import {
  PLAN_FREE,
  PLAN_PREMIUM,
  PLAN_ESSENTIAL,
} from "@/features/charge/constants";

export const StyledContainer = styled.div`
  filter: drop-shadow(0px 31px 41px rgba(32, 42, 53, 0.2))
    drop-shadow(0px 2px 16px rgba(32, 42, 54, 0.08));
  border-radius: 8px;
  max-width: 756px;
  margin: 12px auto 0;
`;

type CardContentContainerProps = {
  active?: boolean;
};
export const StyledCardContentContainer = styled.div<CardContentContainerProps>`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

type CardContentProps = {
  activeTooltip?: boolean;
  name?: string;
  active?: boolean;
};
export const StyledCardContent = styled.div<CardContentProps>`
  // padding: 16px 24px 0;
  margin-top: 16px;
  margin-bottom: 24px;
  .Polaris-Icon {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .Polaris-List {
    list-style: none;
    padding-left: 0;
    &__Item {
      display: flex;
      margin-top: 16px;
      cursor: ${(props: any) =>
        props.activeTooltip == true ? "pointer" : "inherit"};
      :hover {
        .Polaris-Icon__Svg {
          visibility: visible;
        }
      }
      .Polaris-Icon {
        margin: 0;
        margin-right: 8px;
        display: block !important;
        &__Svg {
          max-width: initial !important;
          fill: ${(props: any) =>
            props.name != PLAN_FREE || props.active
              ? "var(--p-text-primary)"
              : "var(--p-icon-subdued)"};
        }
      }
    }
  }

  .Polaris-ExceptionList {
    margin-top: 16px;
  }
  .Polaris-ExceptionList__Item {
    color: var(--p-text);
  }
  .Polaris-ExceptionList__Item + .Polaris-ExceptionList__Item {
    margin-top: 16px;
  }
  .Polaris-ExceptionList__Icon svg {
    fill: ${(props: any) =>
      props.name != PLAN_FREE
        ? "var(--p-text-primary)"
        : "var(--p-icon-subdued)"};
  }
  .Polaris-ExceptionList__Description {
    color: var(--p-text);
  }
`;

type CardSectionActionProps = {
  active?: boolean;
};
export const StyledCardSectionAction = styled.div<CardSectionActionProps>`
  text-align: center;
  .Polaris-Button--plain {
    margin-bottom: 0;
  }
  .Polaris-Button {
    height: 44px;
  }

  ${(props: any) =>
    props.active == true
      ? `
    .Polaris-Button {
      color: var(--p-text);
      background-color: #E4E5E7 !important;
      cursor: default;
      box-shadow: none;
      border-radius: 0;
    }
  `
      : `&[name='free']{
    .Polaris-Button {
      background-color: var(--p-surface);
    }
  }`};
`;

export const StyledCardItem = styled.div<any>`
  padding: 0 24px 24px;
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;
  box-shadow:
    0px 3px 6px -3px rgba(23, 24, 24, 0.08),
    0px 8px 20px -4px rgba(23, 24, 24, 0.12);
  border-radius: 4px;
  background: #ffffff;
  ${(props: any) =>
    props.name != PLAN_FREE &&
    `
    border: 1px solid #00B4CD;
  `};
`;

type CardHeaderProps = {
  name?: string;
};
export const StyledCardHeader = styled.div<CardHeaderProps>`
  // min-height: 152px;
  padding: 16px 20px 20px;
  border-radius: 0px 0px 8px 8px;
  background-color: ${(props: any) =>
    props.name != PLAN_FREE ? "#F1F8F5" : "#F6F6F7"};
  ${(props: any) =>
    props.name != PLAN_FREE
      ? `
    h2, span{
      color: #003D2C !important;
    }
    strong{
      color: #008060 !important;
    }
  `
      : `
  `}
`;

type TextPlanTitleProps = {
  name?: string;
};
export const StyledTextPlanTitle = styled.h2<TextPlanTitleProps>`
  font-weight: 600;
  font-size: 20px;
  line-height: 32px;
  color: "#202223";
  /* text-transform: uppercase; */
`;
export const StyledTextPlanSubtitle = styled.p<any>`
  min-height: 40px;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  margin-bottom: 12px;
  margin-top: 4px;
  color: ${(props: any) =>
    props.name == PLAN_ESSENTIAL ? "#A2BCB0" : "#8C9196"};
`;

type TextPriceProps = {
  name?: string;
};
export const StyledTextPrice = styled.div<TextPriceProps>`
  display: flex;
  strong {
    font-weight: 400;
    font-size: 14px;
    line-height: 30px;
    color: #8c9196;
  }
  span {
    font-weight: 600;
    font-size: 42px;
    line-height: 48px;
    color: ${(props: any) => (props.name != PLAN_FREE ? "#6D7175" : "#6D7175")};
  }
  p {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    align-self: end;
    margin-left: 2px;
    color: ${(props: any) => (props.name != PLAN_FREE ? "#008060" : "#8C9196")};
  }
`;
export const StyledTextPricePerOrder = styled.p<any>`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${(props: any) =>
    props.name != PLAN_FREE ? "#008060" : "#6D7175"} !important;
  margin-top: 8px;
`;
