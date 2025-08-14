import styled from "styled-components";

export const StyledButtonGroup = styled.div`
  display: flex;
  width: 100%;
  padding: 2px;
  align-items: center;
  border-radius: 10px;
  background: #efefef;
  box-shadow: 0 0 0 1px #ffffff;
`;

export const StyledButton = styled.div<any>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 0;
  gap: 10px;
  border-radius: 8px;
  flex: 1;
  cursor: pointer;
  font-weight: 450;
  font-size: 13px;
  ${(props) =>
    props.active
      ? `
    background: #fff;
    font-weight: 550;
  `
      : ""}
`;
