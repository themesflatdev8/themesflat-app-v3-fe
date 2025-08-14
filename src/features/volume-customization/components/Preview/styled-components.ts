import styled from "styled-components";

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  .gvl-popup {
    z-index: 1 !important;
    position: absolute !important;
  }
`;
export const StyledContent = styled.div<any>`
  position: relative;
  height: 100%;
  overflow: scroll;
  padding: 12px;
`;

export const StyledContentWrapper = styled.div<any>`
  width: 100%;
  /* height: 100%; */
  background: #fff;
  display: flex;
  align-items: center;
  margin: auto;
  ${(props) =>
    props.type == "offer"
      ? `
    padding: 8px 12px;
  `
      : `
    padding: 32px 24px;
    max-width: 480px;
    min-width: 480px;
  `}
`;

export const StyledHeader = styled.div<any>`
  > div {
    display: inline-flex;
    border: var(--p-border-width-0165) solid var(--p-color-input-border);
    border-radius: 0 var(--p-border-radius-200) var(--p-border-radius-200) 0;
    background-color: var(--p-color-input-bg-surface);
    padding: 6px 12px 6px 16px;
  }
  .Polaris-Select__Backdrop {
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
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