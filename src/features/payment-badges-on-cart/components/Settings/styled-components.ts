import styled from "styled-components";

export const StyledContainer = styled.div`
`;

export const StyledRangeSlider = styled.div`
  .Polaris-TextField {
    width: 82px;
  }
`;

export const StyledBadgeList = styled.div<any>`
  .StyledBadgeSortable{
    display: flex;
    flex-direction: row;
    gap: 10px;
    flex-wrap: wrap;
  }
`;

export const StyledBadgeItem = styled.div<any>`
  position: relative;
  cursor: pointer;
  .Polaris-Thumbnail {
    border-radius: 8px;
    border: 0.5px solid var(--p-color-border-hover);
    min-width: 65px;
    width: 65px;
    ${(props) =>
      props.active &&
      `
      border: 2.5px solid #005BD3;
    `}
  }
  img {
    object-fit: contain;
    padding: 6px;
  }
  
  &:hover {
    .Polaris-Icon {
      display: flex;
    }
  }
  &:hover:after{
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    border-radius: 8px;
    border: 0.5px solid var(--p-color-border-hover);
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%) no-repeat;
  }
`;

export const StyledBadgeDrag = styled.span`
  .Polaris-Icon{
    transform: rotate(90deg);
  }
`;
export const StyledBadgeDelete = styled.span`
  .Polaris-Icon {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 20px;
    height: 20px;
    justify-content: center;
    align-items: center;
    /* background: #fff; */
    border-radius: 2px;
    padding: 0;
    z-index: 11;
    display: none;
    box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.05);
    svg {
      fill: #FFFFFF;
    }
  }
`;