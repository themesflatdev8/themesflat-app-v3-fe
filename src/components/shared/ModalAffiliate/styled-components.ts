import styled from "styled-components";

export const StyledModalContent = styled.div`
  display: flex;
  padding: 20px;
  background: #fff;
  // color: #fff;
  h2 {
    font-weight: 600;
    font-size: 24px;
    line-height: 28px;
    margin-bottom: 12px;
    margin-top: 12px;
  }
  .Polaris-Card {
    box-shadow: none;
  }
  .Polaris-Heading {
    padding: 20px;
  }
  @media (max-width: 489px) {
    flex-direction: column-reverse;
  }
`;
export const StyledModalButtons = styled.div`
  display: flex;
  // padding-bottom: 20px;
  margin-top: 20px;
  a + a,
  button + button {
    margin-left: 12px;
  }
  @media (max-width: 489px) {
    justify-content: center;
  }
`;
export const StyledModalBody = styled.div`
  flex: 1;
  margin-right: 40px;
  img {
    margin-top: 4px;
  }
`;

export const StyledModalImage = styled.div`
  flex-basis: 200px;
  display: flex;
  align-items: center;
  @media (max-width: 489px) {
    justify-content: center;
  }
`;
