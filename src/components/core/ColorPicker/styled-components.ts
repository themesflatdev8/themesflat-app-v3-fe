import styled from "styled-components";

export const StyledColorPickerContainer = styled.div<any>`
  label {
    display: inline-block;
    margin-bottom: 4px;
    font-size: 13px;
    font-style: normal;
    font-weight: 450;
    line-height: 20px;
  }
  ${props => props.disabled ? `
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  ` : ""}
`;

export const StyledColorPickerContent = styled.div`
  display: flex;
  align-items: center;
  .Polaris-TextField__Backdrop {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

export const StyledBtnColorPicker = styled.div`
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  border: 0.66px solid #8a8a8a;
  border-right: none;
  /* background: #FF0276; */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  span {
    display: inline-block;
    width: 100%;
    height: 100%;
    /* min-width: 20px; */
    /* border-radius: 100%; */
    box-shadow: 0px 0px 1px 1px rgba(63, 63, 68, 0.15);
  }
  /* margin-right: 4px; */
`;
