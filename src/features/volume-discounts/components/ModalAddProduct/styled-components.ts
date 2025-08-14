import styled from "styled-components";

type StyledModalContentProps = {
  isEmptyResources?: boolean;
};

export const StyledModalContent = styled.div<StyledModalContentProps>`
  padding: 16px;
  min-height: 440px;
  display: flex;
  flex-direction: column;
  .Polaris-Card {
    position: relative;
    margin-top: var(--p-space-400);
    margin-bottom: var(--p-space-400);
    ${(props) =>
      props.isEmptyResources
        ? `
    `
        : `
      max-height: calc(100vh - 450px);
      min-height: calc(100vh - 450px);
    `}
    overflow: hidden;
    &__Section {
      position: absolute;
      width: 100%;
      height: 100%;
      padding: 0;
      .search-resource-empty {
        margin-top: 0;
      }
    }
    .Polaris-Scrollable {
      .Polaris-OptionList {
        &-Option {
          &__Label {
            display: flex;
            align-items: center;
          }
          &__Checkbox {
            margin-right: var(--p-space-400);
          }
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
  margin-bottom: 16px;
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
  flex-grow: 1;
  border-radius: 8px;
  background: var(--Surface-Default, #fff);
  box-shadow:
    0px 0px 5px 0px rgba(0, 0, 0, 0.05),
    0px 1px 2px 0px rgba(0, 0, 0, 0.15);
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
    border: 0.66px solid var(--p-color-border, #E3E3E3);
    border-radius: var(--p-border-radius-200);
    padding: var(--p-space-5);
  `
      : ``}
  margin-bottom: var(--p-space-500);
  p {
    margin-bottom: var(--p-space-200);
    font-weight: var(--p-font-weight-semibold);
  }
`;

export const SwitchContainer = styled.div`
  margin-top: 16px;
`;

export const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  span {
    font-weight: 600;
    font-size: 13px;
    line-height: 20px;
  }
`;

type ImgResourceProps = {
  hasBorder: boolean;
};
export const ImgResource = styled.div<ImgResourceProps>`
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: var(--p-space-600);
  ${(props) =>
    props.hasBorder
      ? `
    border: 0.66px solid var(--p-color-border, #E3E3E3);
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
