import styled from "styled-components";

export const StyledTabs = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
`;

export const StyledTabsButtons = styled.div<any>`
  display: inline-flex;
  flex-wrap: wrap;
  border-radius: 10px;
  background: var(--p-color-surface-brand, #E3E3E3);
  gap: 4px;
  padding: 2px;
  margin-bottom: 20px;
  ${(props) =>
    props.width == "wide" &&
    `
    width: 100%;
  `}
`;

export const StyledTabsButton = styled.div<any>`
  border-radius: var(--p-border-radius-button, 8px);
  background: transparent;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s linear;
  text-align: center;
  span{
    font-size: 12px;
    font-style: normal;
    font-weight: 550;
    line-height: 16px;
    color: #303030;
  }
  &:hover {
    background-color: #FFFFFF;
    box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.12);
  }
  ${(props) =>
    props.active &&
    `
    background: var(--p-color-bg-surface, #FFFFFF);
    box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.12);
  `}
  ${(props) =>
    props.width == "wide" &&
    `
    flex: 1;
  `}
`;

export const StyledTabsContent = styled.div`
  flex-grow: 1;
  /* background: var(--p-color-bg-fill-secondary, #f1f1f1); */
  /* padding: 20px; */
  overflow: hidden;
  /* height: 100%; */
  width: 100%;
`;
