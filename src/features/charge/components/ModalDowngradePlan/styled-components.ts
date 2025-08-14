import styled from "styled-components";

export const StyledModalContainer = styled.div`
  .Polaris-Modal-Dialog__Modal {
    max-width: 560px;
  }
`;
export const StyledModalInfo = styled.div`
  background-color: var(--p-background);
  border: 1.5px solid #b98900;
  box-shadow: 0px 4px 16px #e1b878;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
`;
export const StyledModalInfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  h2 {
    color: #916a00;
    font-weight: 600;
    font-size: 28px;
    line-height: 32px;
    text-transform: uppercase;
    margin-top: -8px;
  }
`;
export const StyledModalInfoHeaderPrice = styled.div`
  display: flex;
  align-items: start;
  color: #8c9196;
  i {
    font-weight: 400;
    font-size: 12px;
    line-height: 24px;
    font-style: normal;
  }
  strong {
    font-weight: 600;
    font-size: 28px;
    line-height: 32px;
    color: var(--p-text-subdued);
  }
  span {
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    margin-top: auto;
  }
`;
export const StyledModalInfoHeaderOrder = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #6d7175;
`;
export const StyledModalInfoContent = styled.div`
  .Polaris-ExceptionList {
    margin-top: 12px;
  }
  .Polaris-ExceptionList__Description {
    color: var(--p-text);
  }
  .Polaris-ExceptionList__Icon svg {
    fill: var(--p-icon-critical);
  }
  .Polaris-ExceptionList__Item + .Polaris-ExceptionList__Item {
    margin-top: 8px;
  }
`;
