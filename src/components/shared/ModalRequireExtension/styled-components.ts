import styled from "styled-components";

export const StyledModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > svg {
    width: 115px;
    height: 54px;
  }
  h2 {
    margin-right: 0;
    padding: 20px 50px 16px;
  }
  .Polaris-Card {
    box-shadow: none;
  }
  .Polaris-Heading {
    padding: 20px;
  }
`;
export const StyledModalSteps = styled.div`
  padding: 20px 16px;
  background-color: #ebf9fc;
  margin-top: 16px;
  margin-bottom: 16px;
  > div + div {
    margin-top: 12px;
  }
`;
export const StyledModalStep = styled.div`
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
