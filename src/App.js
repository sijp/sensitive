import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { create } from "jss";
import rtl from "jss-rtl";
import {
  StylesProvider,
  jssPreset,
  ThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";

// import { SearchPage } from "./pages";
// import { AppBar } from "./components";
import store from "./store";
import AppRouter from "./app-router";
import NavBar from "./components/nav-bar";
import { NAVIGATION_LINKS } from "./config/config";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createMuiTheme({
  direction: "rtl",
  palette: {
    secondary: { light: "#c3977c", main: "#8f6c56", dark: "#483620" },
    primary: { light: "#edf5e8", main: "#b5d1a0", dark: "#84aa67" }
  }
});
function App() {
  return (
    <Router>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <StylesProvider jss={jss}>
            <NavBar links={NAVIGATION_LINKS}>
              <Box style={{ flexGrow: 1 }}>
                <AppRouter />
              </Box>
            </NavBar>
          </StylesProvider>
        </ThemeProvider>
      </Provider>
    </Router>
  );
}

export default App;
