import styled from "styled-components";

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const StyledContent = styled.div<any>`
  background: #f7f7f7;
  box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  padding: 8px;
  height: 100%;
`;
export const StyledHeader = styled.div<any>`
  border-bottom: 1px solid #babfc4;
  padding: 12px 16px;
`;
export const StyledImage = styled.div`
  position: relative;
  flex-basis: 288px;
  img {
    width: 100% !important;
    height: auto !important;
    position: unset !important;
  }
`;
export const StyledInfo = styled.div`
  flex: 1;
`;

export const StyledQuantity = styled.div`
  margin: 14px 0;
  > label {
    color: rgba(18, 18, 18, 0.75);
    margin-bottom: 6px;
    display: block;
    font-size: 13px;
    line-height: 17px;
    opacity: 0.8,
  }
  > div {
    color: rgba(18, 18, 18, 0.75);
    position: relative;
    display: flex;
    border-radius: 0;
    min-height: 44px;
    width: 142px;
    border: 1px solid #d0d0d0;
    button {
      cursor: not-allowed;
      /* opacity: .5; */
      width: 45px;
      flex-shrink: 0;
      border: 0;
      font-size: 18px;
      background-color: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      svg {
        width: 10px;
        pointer-events: none;
      }
    }
    input {
      color: rgba(18, 18, 18, 1);
      font-size: 14px;
      font-weight: 50;
      opacity: 0.85;
      text-align: center;
      background-color: transparent;
      border: 0;
      padding: 0 0.5rem;
      width: 100%;
      flex-grow: 1;
      &:focus {
        outline: none;
        border: none;
      }
    }
  }
`;

export const StyledButtonCart = styled.button<any>`
  display: flex;
  width: 100%;
  border: 1px solid #121212;
  justify-content: center;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  text-decoration: none;
  background-color: transparent;
  height: 45px;
  border-radius: 0;
  margin-bottom: 8px;
  span{
    color: #121212;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 1px;
    line-height: 18px;
  }
`;
export const StyledButtonBuyNow = styled.button<any>`
  display: flex;
  width: 100%;
  border: 1px solid #121212;
  justify-content: center;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  text-decoration: none;
  background-color: #121212;
  height: 45px;
  border-radius: 0;
  span{
    color: #FFF;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 1px;
    line-height: 18px;
  }
`;
export const StyledButtonDenomination = styled.div`
  background: transparent;
  border-radius: 99px;
  color: #121212;
  padding: 7px 12px;
  font-weight: 400;
  font-size: 13px;
  line-height: 17px;
  letter-spacing: 0.03em;
  border: 1px solid #7d7d7d;
  cursor: pointer;
  &:first-child {
    background: #000000;
    color: #fff;
    border: 1px solid #000000;
  }
`;

export const StyledBadges = styled.div<any>`
  margin: 20px 0;
  p{
    font-weight: 500;
    font-size: 13px;
    text-align: center;
    margin: 0;
    padding: 0;
  }
  ${props => props.template == "box" ? `
    padding: 16px;
    border-radius: 8px;
    border: 1px solid ${props.borderColor};
    background-color: ${props.backgroundColor};
  ` : `
    padding: 0 8px 20px 8px;
    border-bottom: 1px solid #e1e3e5;
  `}
`;

export const StyledBadgesList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 16px;
`;

export const StyledBadgesItem = styled.div`
  
`;