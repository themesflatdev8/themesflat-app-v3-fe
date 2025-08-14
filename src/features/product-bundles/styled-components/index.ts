import styled from "styled-components";

export const StyledContainer = styled.div`
  /* max-width: 998px;
   margin-left: auto;
   margin-right: auto;
   padding-bottom: 24px; */
  //  padding: 0 24px;
`;

export const StyledContent = styled.div``;

export const StyledList = styled.div``;

export const StyledItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  .Polaris-Icon {
    margin: unset;
  }
`;

export const StyledItemContent = styled.div`
  flex-grow: 1;
  p {
    color: #616161;
    font-size: 13px;
    font-style: normal;
    font-weight: 450;
    line-height: 20px;
    margin-top: 2px;
  }
`;
