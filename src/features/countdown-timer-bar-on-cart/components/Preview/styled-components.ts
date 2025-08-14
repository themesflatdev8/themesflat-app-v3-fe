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

export const StyledCheckout = styled.div<any>`
  border-top: 1px solid #12121233;
  margin-top: 24px;
  padding-top: 24px;
  >p{
    font-size: 13px;
    font-weight: 400;
    line-height: 16px;
    color: #121212;
    opacity: 0.75;
    margin: 0 0 20px 0;
  }
`;

export const StyledCheckoutTotal = styled.div<any>`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
  span{
    font-size: 16px;
    font-weight: 400;
    line-height: 16px;
    color: #121212;
  }
  strong{
    font-size: 18px;
    font-weight: 400;
    line-height: 18px;
    color: #121212;
    opacity: 0.75;
  }
`;

export const StyledCart = styled.div<any>`
  margin-bottom: 16px;
`;
export const StyledCartHeader = styled.div<any>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  h3 {
    color: var(--Text-color-Default-text, #121212);
    font-size: 30px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  a {
    color: var(--Text-color-Default-text, #121212);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 27.52px;
    letter-spacing: 0.64px;
    text-decoration: underline;
  }
`;
export const StyledCartSubHeader = styled.div<any>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  margin-bottom: 16px;
  box-shadow: 0px -1px 0px 0px #e1e3e5 inset;
  span {
    color: var(--Text-color-Subdued-text, rgba(18, 18, 18, 0.75));
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.39px;
  }
`;
export const StyledCartItem = styled.div<any>`
  display: flex;
  gap: 16px;
  img {
    width: 74px;
    min-width: 74px;
    height: 74px;
  }
  > div {
    flex-grow: 1;
    a {
      color: var(--Text-color-Default-text, #121212);
      font-style: normal;
      font-weight: 400;
      line-height: 27.52px;
      letter-spacing: 0.64px;
      margin-bottom: 8px;
      display: block;
    }
    p {
      color: var(--Text-color-Subdued-text, rgba(18, 18, 18, 0.75));
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 21px;
      letter-spacing: 0.28px;
    }
    > div {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
    }
  }
  > span {
    color: var(--Text-color-Default-text, #121212);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 27.52px;
    letter-spacing: 0.64px;
    white-space: nowrap;
  }
`;

export const StyledCartQuantity = styled.div<any>`
  color: #000000;
  position: relative;
  width: 132px;
  display: flex;
  border: 1px solid #f0f0f0;
  padding: 12px;
  background-color: #fff;
  button {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    font-size: 16px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000000;
    padding: 2px;
    background: transparent;
    &:disabled {
      cursor: not-allowed;
      // pointer-events: none;
      opacity: 0.5;
    }
    svg {
      pointer-events: none;
    }
  }
  input {
    width: 100%;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    box-shadow: none;
    margin: 0 4px;
    text-align: center;
    color: var(--Text-color-Subdued-text, rgba(18, 18, 18, 0.75));
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0.39px;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    /* Firefox */
    &[type="number"] {
      -moz-appearance: textfield;
    }
    &:disabled {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
    }
  }
  &-button[name="minus"] {
    background-color: transparent;
    svg {
      fill: #000000;
    }
  }
  &-button[name="plus"] {
    background-color: #000000;
    svg {
      fill: #fff;
    }
  }
`;

export const StyledStorefront = styled.div<any>`
  .Msell-Countdown-Timer-Bar{
    max-width: 100% !important;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    gap: 8px;
    background-color: var(--msell-countdown-timer-bar-background-color);
    border: 1px solid var(--msell-countdown-timer-bar-border-color);
    border-radius: 8px;
    margin: 16px auto;
    &[data-template='default'] {
      padding: 8px 16px;
      column-gap: 4px;
      .Msell-Countdown-Timer-Bar__Icon {
        svg{
          width: 20px;
          height: 20px;
          margin-bottom: -6px;
        }
      }
    }
    &[data-template='comfortable'] {
      padding: 12px 16px;
      column-gap: 8px;
      .Msell-Countdown-Timer-Bar__Icon {
        svg{
          width: 50px;
          height: 50px;
        }
      }
      &.Msell-Countdown-Timer-Bar--Cart{
        padding: 8px 16px;
      }
    }
    &__Icon{
      flex-shrink: 0;
      svg{
        fill: var(--msell-countdown-timer-bar-text-color);
      }
    }
    &__Box{
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      margin: 0 1px;
    }
    &__Content{
      // display: inline-flex;
      // align-items: center;
      display: block;
      font-size: 14px;
      font-weight: 400;
      line-height: 21px;
      color: var(--msell-countdown-timer-bar-text-color);
      padding: 0;
      &[data-template='default'] {
        column-gap: 2px;
        margin: 0 2px;
        .Msell-Countdown-Timer-Bar__Rotor {
          background: rgba(51, 51, 51, 0.12);
        }
      }
      &[data-template='comfortable'] {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0;
        .Msell-Countdown-Timer-Bar__Rotor {
          background: rgba(255, 255, 255, 0.22);
          margin: 6px;
        }
      }
    }
    &__Rotor{
      position: relative;
      border-radius: 6px;
      padding: 2px 6px;
      font-size: 14px;
      font-weight: 700;
      line-height: 21px;
      letter-spacing: 1.5px;
      color: var(--msell-countdown-timer-bar-timer-color);
    }
    &__Separator{
      color: var(--msell-countdown-timer-bar-timer-color);
      margin: 0 2px;
    }
  }
`;