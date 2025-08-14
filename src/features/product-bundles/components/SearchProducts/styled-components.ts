import styled from "styled-components";

export const StyledContainer = styled.div``;

export const StyledList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
`;

export const StyledItem = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--Border-Disabled, #d2d5d8);
  background: var(--Surface-Default, #fff);
  max-width: 50%;
  width: 50%;
  svg {
    width: 20px;
    height: 20px;
    margin-left: 8px;
    fill: #5c5f62;
    cursor: pointer;
  }
`;

export const StyledItemProduct = styled.div<any>`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-grow: 1;
`;

export const StyledItemImage = styled.div<any>`
  /* padding: 8px 16px; */
  svg {
    position: absolute;
    z-index: 1;
    bottom: 0;
    right: 1px;
    width: 20px;
    height: 20px;
  }
  .Polaris-Thumbnail {
    width: 40px;
    min-width: 40px;
  }
`;
export const StyledItemName = styled.div<any>`
  flex: 1;
  color: var(--Text-Default, #202223);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  span {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: normal;
  }
`;
