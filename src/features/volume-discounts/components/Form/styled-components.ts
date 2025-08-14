import styled from "styled-components";

export const StyledContainer = styled.div`
  .Polaris-Layout__Section--oneThird {
    min-width: 400px;
  }
`;
export const StyledContent = styled.div`
  flex: 1;
`;

export const StyledAnalyze = styled.div`
  margin-bottom: 20px;
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
