import styled from "styled-components";

export const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  @media only screen and (max-width: 767px) {
    width: 100% !important;
    border-radius: 0 !important;
  }
`;

export const StyledModalDialog = styled.div`
  min-height: calc(100% - (16px * 2));
  margin: 16px auto;
  width: 100%;
  display: flex;
  align-items: center;
  @media only screen and (max-width: 767px) {
    align-items: flex-end;
    margin: 0;
    min-height: 100%;
    max-width: 100% !important;
  }
`;
export const StyledModalContent = styled.div`
  width: 100%;
  background: #fff;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--p-shadow-modal);
  @media only screen and (max-width: 767px) {
    width: 100% !important;
    border-radius: 0 !important;
  }
`;

export const StyledModalBody = styled.div``;

export const StyledModalFooter = styled.div<any>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  min-height: var(--p-space-1600);
  padding: var(--p-space-400);
  border-top: 1px solid #e3e3e3;
  @media (max-width: 489px) {
    justify-content: center !important;
  }
`;

export const StyledModalHeader = styled.div`
  position: absolute;
  right: 12px;
  top: 12px;
  button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    .Polaris-Icon {
      height: 20px;
      width: 20px;
      color: rgb(138, 138, 138);
    }
    &:hover {
      background: rgba(0, 0, 0, 0.05);
      .Polaris-Icon {
        color: rgb(97, 97, 97);
      }
    }
  }
`;

export const StyledModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

type StyledModalContainerProps = {
  active?: boolean;
  out?: boolean;
  animation: string;
};
export const StyledModalContainer = styled.div<StyledModalContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // display: flex;
  // justify-content: center;
  // align-items: center;

  ${(props: any) =>
    props.active
      ? `

  `
      : ``};
  ${(props: any) =>
    props.animation == "default"
      ? `
    transform:scale(1);
    .modal-backdrop {
      animation: fadeIn .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;
    }
    .modal {
      opacity:0;
      animation: scaleUp .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;
    }
  `
      : ""};
  ${(props: any) =>
    props.animation == "left-to-right"
      ? `
    transform:scale(1);
    .modal-backdrop {
      background:rgba(0,0,0,.0);
      animation: fadeIn .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;
    }
    .modal {
      transform:translateX(-1500px);
      animation: roadRunnerIn .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;
    }
  `
      : ""};
  ${(props: any) =>
    props.animation == "right-to-left"
      ? `
    transform:scale(1);
    .modal-backdrop {
      background:rgba(0,0,0,.0);
      animation: fadeIn .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;
    }
    .modal {
      transform:translateX(-1500px);
      animation: roadRunnerInReversive .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;
    }
  `
      : ""};
  ${(props: any) =>
    props.animation == "default" && props.out
      ? `
    animation: quickScaleDown 0s .5s linear forwards;
    .modal-backdrop {
      animation: fadeOut .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;
    }
    .modal {
      animation: scaleDown .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;
    }
  `
      : ``};
  ${(props: any) =>
    props.animation == "left-to-right" && props.out
      ? `
    animation: quickScaleDown 0s .5s linear forwards;
    .modal-backdrop {
      animation: fadeOut .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;
    }
    .modal {
      animation: roadRunnerOut .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;
    }
  `
      : ``};
  ${(props: any) =>
    props.animation == "right-to-left" && props.out
      ? `
    animation: quickScaleDown 0s .5s linear forwards;
    .modal-backdrop {
      animation: fadeOut .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;
    }
    .modal {
      animation: roadRunnerOutReversive .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards;
    }
  `
      : ``};
  @media only screen and (max-width: 767px) {
    align-items: end;
  }
`;

export const StyledModalTitle = styled.h2`
  font-size: 14px;
  font-weight: 650;
  line-height: 20px;
  color: #303030;
  padding: 16px 45px 16px 16px;
  border-bottom: 1px solid #e3e3e3;
  background: #f3f3f3;
`;
