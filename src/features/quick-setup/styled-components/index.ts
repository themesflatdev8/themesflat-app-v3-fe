import styled from "styled-components";

export const StyledContainer = styled.div`
  max-width: 998px;
  margin-left: auto;
  margin-right: auto;
  //  padding: 0 24px;
  @media (max-width: 489px) {
    padding: 0 16px;
    & > .Polaris-Page {
      & > .Polaris-Box {
        padding: 16px 0;
      }
    }
  }
`;
