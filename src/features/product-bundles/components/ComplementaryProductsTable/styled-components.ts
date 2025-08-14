import styled from "styled-components";

export const StyledList = styled.div`
  margin-top: 8px;
  @media (max-width: 489px) {
    overflow: auto;
    > div {
      min-width: 600px;
    }
  }
`;

export const StyledItem = styled.div<any>`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  overflow: hidden;
  background: var(--p-color-bg-surface, #ffffff);
  padding: 12px;
  &:hover {
    background-color: rgba(241, 242, 244, 1);
  }
  ${(props) =>
    props.disabled &&
    `
    background-color: #FAFBFB !important;
    >div:nth-child(2),
    >div:nth-child(3),
    >div:nth-child(4){
      opacity: 0.5;
    }
  `}
  & + & {
    border-top: 0.66px solid rgba(235, 235, 235, 1);
  }
`;

export const StyledItemDrag = styled.div<any>`
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    fill: #5c5f62;
  }
`;

export const StyledItemNumber = styled.div<any>`
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  font-weight: 450;
  font-size: 14px;
  line-height: 20px;
`;
export const StyledItemImage = styled.div<any>`
  /* padding: 8px; */
`;
export const StyledItemName = styled.div<any>`
  flex: 1;
  /* padding: 8px 4px; */
  font-style: normal;
  font-weight: 450;
  font-size: 13px;
  line-height: 20px;
  display: flex;
  gap: 8px;
  > span {
    /* display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: normal; */
  }
  > div {
    opacity: 0;
    visibility: hidden;
  }
  &:hover {
    > span {
      text-decoration: underline;
    }
    > div {
      opacity: 1;
      visibility: visible;
    }
  }
`;
export const StyledItemPrice = styled.span<any>`
  color: var(--p-color-text, #303030);
  font-size: 14px;
  font-style: normal;
  font-weight: 450;
  line-height: 20px;
  white-space: nowrap;
  flex-basis: 200px;
  min-width: 200px;
`;
export const StyledItemStatus = styled.div<any>`
  width: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const StyledBadge = styled.div<any>`
  display: inline-flex;
  border-radius: 10px;
  padding: 2px 8px;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #202223;
  ${(props) =>
    props.type == "manual" &&
    `
    background: #E4E5E7;
  `}
  ${(props) =>
    props.type == "auto" &&
    `
    background: #DFDCFF;
  `}
`;
export const StyledItemAction = styled.div<any>`
  display: flex;
  align-items: center;
  justify-content: center;
  .Polaris-Icon {
    fill: #8a8a8a;
    transition: all 0.2s linear;
  }
  &:hover {
    .Polaris-Icon {
      height: 20px;
      width: 20px;
      fill: #000;
    }
  }
`;
