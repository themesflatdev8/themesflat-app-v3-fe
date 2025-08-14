import styled from "styled-components";

export const StyledContainer = styled.div`
  .Polaris-Banner {
    margin-bottom: 8px;
  }
  .Polaris-Button {
    white-space: nowrap;
  }
  @media (max-width: 489px) {
    .Polaris-HorizontalStack {
      flex-wrap: wrap;
    }
  }
`;

export const StyledContent = styled.div<any>``;

export const StyledList = styled.div<any>`
  display: flex;
  flex-direction: column;
`;

export const StyledProductItem = styled.div<any>`
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--p-color-bg-surface, #fff);
  padding: 12px;
  > span {
    font-size: 14px;
  }
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

export const StyledProductItemContent = styled.div<any>`
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 12px;
  > div {
    opacity: 0;
  }
  &:hover > div {
    opacity: 1;
  }
`;

export const StyledProductItemName = styled.span<any>`
  font-size: 13px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const StyledProductItemPrice = styled.span<any>`
  color: var(--p-color-text, #303030);
  font-size: 14px;
  font-style: normal;
  font-weight: 450;
  line-height: 20px;
  white-space: nowrap;
  flex-basis: 200px;
  min-width: 200px;
`;

export const StyledCollectionItem = styled.div<any>`
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 8px;
  border: 0.66px solid var(--p-color-border, #e3e3e3);
  background: var(--p-color-bg-surface, #fff);
  padding: 8px 16px;
  > span {
    font-size: 14px;
  }
`;

export const StyledCollectionItemContent = styled.div<any>`
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 20px;
  span {
    font-size: 14px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  > div {
    opacity: 0;
  }
  &:hover > div {
    opacity: 1;
  }
`;

export const StyledClose = styled.div`
  min-width: 20px;
  width: 20px;
  height: 20px;
  margin-left: auto;
  cursor: pointer;
  svg {
    fill: #8a8a8a;
  }
`;
