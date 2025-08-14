import styled from "styled-components";

export const StyledModalContent = styled.div`
  margin-top: 4px;
  margin-bottom: 24px;
`;
export const StyledModalInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  h3 {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 6px;
    color: #008060;
    /* text-transform: uppercase; */
  }
  h2 {
    font-weight: 600;
    font-size: 40px;
    line-height: 48px;
    color: var(--p-text);
    margin-bottom: 8px;
  }
  button {
    margin-top: 16px;
  }
`;
export const StyledModalFooter = styled.div`
  margin-top: 4px;
  padding-top: 20px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    margin-left: 8px;
  }
`;
export const StyledLine = styled.div`
  height: 1px;
  background-color: #e1e3e5;
  margin-left: -20px;
  margin-right: -20px;
`;
export const StyledModalImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
