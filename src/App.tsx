import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "./components/home/styles/GlobalStyles";
import { theme } from "./components/home/styles/Theme";
import AdminLayout from "./components/admin/Layout/Layout";
import Dashboard from "./components/admin/Dashboard/Dashboard";
import AdminPage from "./pages/admin/AdminPage";
import { NotificationProvider } from "./contexts/NotificationContext";
import HomePage from "./pages/HomePage/HomePage";
import Home from "./pages/Home/Home";
function App() {
  const renderAdminPage = true;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />

      {renderAdminPage ? (
        <NotificationProvider>
          {/* <AdminPage /> */}
          <Home />
        </NotificationProvider>
      ) : (
        <>
          <div
            style={{
              height: "100vh",
              padding: "50px",
              background: theme.colors.lightGray,
              color: theme.colors.textDark,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h2
              style={{
                fontFamily: theme.typography.heading.fontFamily,
                fontSize: theme.typography.heading.sizes.h2,
              }}
            >
              Frontend Homepage
            </h2>
            <p
              style={{
                marginTop: "20px",
                fontFamily: theme.typography.body.fontFamily,
              }}
            >
              To see the Admin panel, set 'renderAdminPage' to 'true' in
              src/App.tsx.
            </p>
            <button
              onClick={() => alert("Switch to Admin (Implement Routing)")}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                border: "none",
                backgroundColor: theme.colors.accent1,
                color: theme.colors.textLight,
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Switch to Admin Panel (Demo)
            </button>
          </div>
        </>
      )}
    </ThemeProvider>
  );
}

export default App;
