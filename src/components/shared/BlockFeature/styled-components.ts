import styled from "styled-components";

type StyledBlockFeatureProps = {
  hasIcon?: Boolean;
};

export const StyledBlockFeature = styled.div<any>`
  .Polaris-Banner {
    padding: var(--p-space-400);
    &__Button {
      &:focus::after {
        box-shadow: unset;
      }
    }
    &__Ribbon {
      ${(props) =>
        props.hasIcon
          ? ``
          : `
        display: none;
      `}
    }
  }
`;
