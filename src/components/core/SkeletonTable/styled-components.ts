import styled from "styled-components";

export const SkeletonContainer = styled.div`
  // padding: 16px 16px;
  /* margin-top: var(--p-space-500); */
  min-height: 300px;
  .Polaris-Layout__Section {
    display: flex;
  }
  .Polaris-Card {
    flex: 1;
  }
  .skeletion-table__publish {
    width: 80px;
    text-align: center;
  }
  .skeletion-table__name {
    width: 40%;
    > div {
      width: 60%;
    }
  }
  .skeletion-table__status {
    width: 20%;
    > div {
      width: 80%;
    }
  }
  .skeletion-table__market {
    width: 20%;
    > div {
      width: 50%;
    }
  }
  table thead {
    opacity: 0.5;
  }
`;
