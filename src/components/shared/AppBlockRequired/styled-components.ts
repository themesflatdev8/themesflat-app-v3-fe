import styled from "styled-components";

export const StyledContainer = styled.div`
`;

export const StyledContent = styled.div`
  max-width: 552px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const StyledSteps = styled.div`
  /* padding: 20px 16px; */
  /* background-color: #EBF9FC; */
  border-radius: 12px;
  border: 1px solid var(--p-color-border-info);
  margin-top: 20px;
  padding: 20px 40px;
  > div + div {
    margin-top: 12px;
  }
  @media (max-width: 767px) {
    margin-bottom: 4px;
  }
`;
export const StyledStep = styled.div`
  display: flex;
  .Polaris-Badge {
    flex-basis: 20px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  > p {
    flex: 1;
    margin-left: 8px;
  }
`;
