import styled from "styled-components";

export const StyledContainer = styled.div`
  display: flex;
  gap: 24px;
  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

export const StyledContent = styled.div`
  flex-basis: 284px;
  min-width: 284px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const StyledPreview = styled.div`
  flex: 1;
  background: #ffffff;
  box-shadow:
    0px 0px 0px 1px rgba(6, 44, 82, 0.1),
    0px 2px 16px rgba(33, 43, 54, 0.08);
  border-radius: 4px;
`;

export const StyledSteps = styled.div`
  /* padding: 20px 16px; */
  /* background-color: #EBF9FC; */
  margin-bottom: 40px;
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
