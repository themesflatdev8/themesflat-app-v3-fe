import styled from "styled-components";

export const StyledModalContent = styled.div`
  text-align: left;
  padding: 0 0 var(--p-space-400);
`;

export const StyledModalFooter = styled.div`
  padding: var(--p-space-500) var(--p-space-500) 0;
  margin-left: -20px;
  margin-right: -20px;
  text-align: right;
  border-top: 1px solid #e3e3e3;
  button + button {
    margin-left: var(--p-space-200);
  }
`;
