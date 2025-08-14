import styled from "styled-components";

export const StyledGuideCollapse = styled.div<any>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
`;

export const StyledContainer = styled.div`
  &:hover {
    .setup-guide-close {
      opacity: 1;
    }
  }
`;

export const StyledCard = styled.div<any>`
  padding: 8px;
  border-radius: 8px;

  ${(props) =>
    props.active
      ? `
    background-color: #f7f7f7;
  `
      : ""}
`;

export const StyledGuideIcon = styled.span<any>`
  svg {
    width: 20px;
    height: 20px;
  }
  ${(props) =>
    !props.active
      ? `
    circle{
      display: none;
    }
    &:hover{
      circle {
        display: block;
      }
      rect{
        display: none;
      }
    }
  `
      : ""}
`;

export const StyledBadge = styled.div`
  border: var(--p-border-width-025) solid var(--p-color-border);
  border-radius: var(--p-border-radius-200);
  padding: 0 var(--p-space-200);
`;
