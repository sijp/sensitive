import React from "react";
import { Provider } from "react-redux";
import { create } from "jss";
import rtl from "jss-rtl";
import {
  StylesProvider,
  jssPreset,
  ThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";

// import { SearchPage } from "./pages";
// import { AppBar } from "./components";
import store from "./store";
import ProfessionalsPage from "./pages/professionals-page";

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
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <StylesProvider jss={jss}>
          <div className="App">קבוצת רגישים</div>
          <ProfessionalsPage />
        </StylesProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
