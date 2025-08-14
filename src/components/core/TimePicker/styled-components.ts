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
  height: 226px;
  .Polaris-OptionList {
    padding: var(--p-space-200);
  }
  .Polaris-OptionList-Option {
    min-height: 20px;
  }
  .Polaris-OptionList-Option__SingleSelectOption {
    padding: 6px var(--p-space-200);
    justify-content: center;
    &::after {
      display: none !important;
    }
  }
`;
