import styled from "styled-components";
type PopoverActionProps = {
  popoverActive?: boolean;
};
export const StyledActivatorActionContainer = styled.div<PopoverActionProps>`
  .Polaris-Link {
    width: 30px;
    height: 30px;
    border: 1px solid var(--p-border-neutral-subdued);
    box-shadow: inset 0px 2px 0px rgba(0, 0, 0, 0.05);
    border-radius: var(--p-space-100);
    display: flex;
    align-items: center;
    justify-content: center;
    outline: unset !important;
    svg {
      fill: var(--p-icon);
    }
  }

  ${(props) =>
    props.popoverActive &&
    `
    .Polaris-Link {
      background: var(--p-action-secondary-depressed);
      border-color: var(--p-border-depressed);
      svg {
        fill: var(--p-icon-on-interactive);
      }
    }
  `}
`;
