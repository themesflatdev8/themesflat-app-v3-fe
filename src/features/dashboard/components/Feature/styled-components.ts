import styled from "styled-components";

export const StyledContainer = styled.div`
  position: relative;
`;

export const StyledClose = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
`;

export const StyledItem = styled.div<any>`
  position: relative;
  .Polaris-ShadowBevel {
    /* box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.15), 0px 0px 5px 0px rgba(0, 0, 0, 0.05); */
    transition: box-shadow 0.3s linear;
    height: 100%;
    > .Polaris-Box {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding-top: 20px;
      padding-bottom: 20px;
    }
  }
  ${(props) =>
    props.active &&
    `
    .Polaris-ShadowBevel{
      box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.05) inset, 0px -1px 1px 0px rgba(0, 0, 0, 0.05) inset, 0px 8px 20px -4px rgba(0, 0, 0, 0.15);
    }
    .Polaris-Button{
      box-shadow: 0px 0px 0px 2px #458FFF;
    }
  `}
`;
