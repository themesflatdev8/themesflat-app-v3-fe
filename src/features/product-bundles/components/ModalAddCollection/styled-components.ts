import styled from "styled-components";

type StyledModalContentProps = {
  isEmptyResources?: boolean;
};

export const StyledModalContent = styled.div<StyledModalContentProps>`
  /* padding: 16px; */
  .Polaris-Scrollable {
    > .Polaris-Box {
      padding: 0;
    }
    .Polaris-OptionList {
      &-Option {
        border-bottom: 0.66px solid var(--p-color-border, #e3e3e3);
        border-radius: 0 !important;
        margin-top: 0 !important;
        &__Label {
          display: flex;
          align-items: center;
          padding-left: 16px;
          border-radius: 0 !important;
        }
        &__Checkbox {
          margin-right: var(--p-space-300);
        }
        &--select {
          border-radius: 0 !important;
        }
        &__SingleSelectOption {
          padding: var(--p-space-150) 16px;
        }
      }
    }
  }
  .Polaris-Banner {
    margin-bottom: var(--p-space-400);
    border-radius: var(--p-border-radius-200);
    padding: var(--p-space-500);
  }
`;

export const ActionSelectAll = styled.div`
  padding-top: var(--p-space-200);
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledFilter = styled.div`
  padding: 12px 16px;
  border-bottom: 0.66px solid var(--p-color-border, #e3e3e3);
  p {
    margin-bottom: var(--p-space-200);
    font-weight: var(--p-font-weight-semibold);
  }
  .Polaris-Filters__Container {
    > .Polaris-Box {
      padding: 0;
    }
  }
`;

export const StyledList = styled.div`
  min-height: 340px;
  .Polaris-OptionList-Option {
    border-radius: 0;
    margin-top: 0;
  }
  .Polaris-OptionList-Option__Checkbox {
    margin: 0 20px 0 16px;
  }
  .Polaris-OptionList-Option__Label {
    box-shadow: inset 0px -1px 0px #e1e3e5;
    border-radius: 0;
    align-items: center;
  }
  .Polaris-OptionList-Option__SingleSelectOption {
    align-items: center;
  }
  > .Polaris-Scrollable {
    > .Polaris-Box {
      padding: 0;
    }
  }
`;

type AutoSyncContainerProps = {
  isEmptyResources?: boolean;
};
export const AutoSyncContainer = styled.div<AutoSyncContainerProps>`
  ${(props) =>
    props.isEmptyResources
      ? `
    border: 1px solid #D2D5D8;
    border-radius: var(--p-border-radius-200);
    padding: var(--p-space-500);
  `
      : ``}
  margin-bottom: var(--p-space-500);
  p {
    margin-bottom: var(--p-space-200);
    font-weight: var(--p-font-weight-semibold);
  }
`;

export const SwitchContainer = styled.div`
  margin-top: 18px;
`;

export const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  span {
    font-weight: 450;
    font-size: 14px;
    line-height: 20px;
  }
`;

type ImgResourceProps = {
  hasBorder: boolean;
};
export const ImgResource = styled.div<ImgResourceProps>`
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: var(--p-space-500);
  ${(props) =>
    props.hasBorder
      ? `
    border: 0.66px solid var(--p-color-border,#E3E3E3)
  `
      : ``}
`;
export const StyledEmptyData = styled.div`
  height: 352px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  .Polaris-Icon {
    height: 48px;
    width: 48px;
    margin-bottom: var(--p-space-300);

    svg {
      fill: #57b386;
    }
  }
`;

export const StyledModalFooter = styled.div`
  padding: 16px 20px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: inset 0px 1px 0px #e4e5e7;
  button {
    margin-left: 8px;
  }
`;
