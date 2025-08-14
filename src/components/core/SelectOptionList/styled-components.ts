import styled from "styled-components";

export const SelectContainer = styled.div`
  .Polaris-Button {
    width: 100%;
    &__Content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
`;

export const OptionsListContainer = styled.div`
  .Polaris-OptionList {
    padding: var(--p-space-200);
    .Polaris-OptionList-Option__SingleSelectOption {
      padding: 10px var(--p-space-200);
      &::after {
        display: none !important;
      }
    }
  }
`;
