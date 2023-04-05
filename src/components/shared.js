import styled from "styled-components";

export const BaseBox = styled.div`
  background-color: #ffffff;
  border: 1px solid ${(props) => props.theme.borderColor};
  width: 100%;
`;

export const FatLink = styled.span`
  font-weight: 600;
  color:rgb(142,142,142)
`;
