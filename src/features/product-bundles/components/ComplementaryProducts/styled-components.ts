import styled from "styled-components";

export const StyledContainer = styled.div`
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

export const StyledTable = styled.div`
  /* background: #FFFFFF; */
  /* box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.15); */
  /* border-radius: 8px; */
  /* overflow: hidden; */
`;

export const StyledBanner = styled.div`
  border-radius: 4px;
  border: 1px solid #d2d5d8;
  background: #f2f7fe;
  padding: 12px 24px;
  p {
    color: #202223;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    margin: 0;
  }
`;

export const StyledMaximum = styled.div`
  .Polaris-Connected__Item--primary {
    max-width: 100px;
  }
  .Polaris-TextField {
    width: 100px;
  }
`;
