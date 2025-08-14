import styled from "styled-components";

export const StyledContainer = styled.div<any>`
  ${(props) =>
    props.size == "2xl"
      ? `
    max-width: 1320px;
  `
      : ""}
  ${(props) =>
    props.size == "xl"
      ? `
    max-width: 1200px;
  `
      : ""}
  ${(props) =>
    props.size == "lg"
      ? `
    max-width: 998px;
  `
      : ""}
  ${(props) =>
    props.size == "md"
      ? `
    max-width: 796px;
  `
      : ""}
  ${(props) =>
    props.fullHeight
      ? `
    min-height: 100vh;
  `
      : ""}
  margin-left: auto;
  margin-right: auto;
  padding: 24px 24px 24px;
  .Polaris-Page {
    max-width: unset;
    padding: 0;
    > .Polaris-Box {
      padding-top: 0;
    }
    &-Header {
      padding-top: 0;
    }
  }
  @media (max-width: 489px) {
    padding: 0 16px 16px;
  }
`;
