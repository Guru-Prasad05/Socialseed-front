import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
reset;
export const lightTheme = {
  accent: "#0095f6",
  bgColor: "#fafafa",
  fontColor: "rgb(38,38,38)",
  borderColor: "rgb(219,219,219)",
  hover: "#007acc",
};

export const darkTheme = {
  fontColor: "#D9D9D9",
  bgColor: "#2c2c2c",
  accent: "#FFD700",
  borderColor: "#DAA520",
  hover: "#DAA520",
};

export const GlobalStyles = createGlobalStyle`
    ${reset}
    input{
    all:unset;
    }
    *{
      box-sizing:border-box;
      ::-webkit-scrollbar{
        background-color:${(props) => props.theme.bgColor}
      }
      ::-webkit-scrollbar-thumb{
        background-color:${(props) => props.theme.borderColor}
      }
    }
    body{
      background-color:${(props) => props.theme.bgColor};
      font-size:14px;
      font-family:'Open Sans', sans-serif;
      color:${(props) => props.theme.fontColor};
      
    }
    a{
      text-decoration: none;
      color:inherit;
    }
     
`;
