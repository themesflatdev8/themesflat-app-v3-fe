import styled from "styled-components";

export const StyledModalContent = styled.div`
  text-align: center;
  .Polaris-Icon {
    width: 60px;
    height: 60px;
    margin-top: 0 !important;
    svg {
      fill: var(--p-icon-success);
    }
  }
  > img {
    margin-bottom: 12px;
  }
  > span {
    display: block;
    margin-top: 12px;
  }
`;
