import React from "react";
import { adminProductListTheme,type AdminProductListTheme } from "./theme";
import { ThemeProvider } from "styled-components";

const SenzPage = () =>{
  const theme:AdminProductListTheme = adminProductListTheme;
  return(
    <ThemeProvider theme={theme}>
    <>
      <h1>Hey</h1>
    </>
    </ThemeProvider>

  )
}

export default SenzPage