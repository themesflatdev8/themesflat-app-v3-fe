import styled from "styled-components";

export const StyledTable = styled.div`
  .volume-discounts__table-name {
    width: 25%;
    span {
      white-space: normal;
    }
  }
  .volume-discounts__table-product-name {
    width: 45%;
    span {
      white-space: normal;
    }
  }
  .volume-discounts__table-publish {
    /* text-align: center; */
  }
  .Polaris-IndexTable {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

export const StyledName = styled.div`
  font-weight: 450;
  white-space: normal;
  &:hover {
    text-decoration: underline;
  }
`;

export const StyledOfferName = styled.div`
  font-weight: 450;
  white-space: normal;
`;
