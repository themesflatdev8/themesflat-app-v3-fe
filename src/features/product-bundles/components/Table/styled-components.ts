import styled from "styled-components";

export const StyledTable = styled.div`
  .bundling-table-name {
    span {
      white-space: normal;
    }
  }
  .bundle-table--publish {
    text-align: center;
  }
  .bundle-table--actions {
    width: 15%;
  }
  .Polaris-IndexTable {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

export const StyledThumbnail = styled.div<any>`
  position: relative;
  border: 1px solid #c9cccf;
  border-radius: 2px;
  display: inline-flex;
  width: 40px;
  min-width: 40px;
  height: 40px;
  border-radius: var(--p-border-radius-200, 8px);
  background: var(--Color-input-bg-surface, #fdfdfd);
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.08) inset;
  span {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #202223;
    z-index: 2;
    font-weight: 400;
    font-size: 12px;
    line-height: 12px;
  }
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
    border-radius: var(--p-border-radius-200, 8px);
  }
  svg {
    position: absolute;
    z-index: 1;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
  }
  ${(props) =>
    props.more &&
    `
    &::after{
      content: "";
      background: rgba(255, 255, 255, 0.5);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }
  `}
`;

export const StyledName = styled.div`
  font-weight: 400;
  white-space: normal;
  text-transform: capitalize;
`;

export const StyledBundleName = styled.div`
  font-weight: 500;
  white-space: normal;
`;

export const StyledProduct = styled.div<any>`
  display: flex;
  align-items: center;
  gap: 16px;
  ${(props) =>
    props.disabled &&
    `
    opacity: 0.5;
  `}
`;

export const StyledThumbnailWrap = styled.div<any>`
  display: flex;
  align-items: center;
  gap: 12px;
  ${(props) =>
    props.disabled &&
    `
    opacity: 0.5;
  `}
`;
