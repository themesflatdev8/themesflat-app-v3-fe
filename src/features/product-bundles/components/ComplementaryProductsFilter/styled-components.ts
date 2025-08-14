import styled from "styled-components";

export const StyledFilterContainer = styled.div`
  background: #fff;
  /* box-shadow: inset 0px -1px 0px #E1E3E5; */
`;

export const StyledFilterBody = styled.div`
  padding: 8px 0 16px;
  /* border-bottom: 1px solid #E1E3E5; */
  .Polaris-Filters-ConnectedFilterControl__Item {
    .Polaris-Button {
      &[aria-expanded="true"] {
        background: var(--p-action-secondary-depressed);
        color: var(--p-text-on-interactive);
        .Polaris-Icon {
          svg {
            fill: var(--p-icon-on-interactive);
          }
        }
      }
    }
    .Polaris-Button {
      min-width: 150px;
      .Polaris-Button__Content {
        justify-content: space-between;
      }
    }
  }
`;

export const StyledFilterFooter = styled.div`
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LeftHeading = styled.div`
  display: flex;
  align-items: center;
  .Polaris-Button {
    margin-right: 10px;
    border-color: var(--p-surface-neutral-pressed);
  }
`;
