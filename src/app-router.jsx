import React from "react";
import { Route, Switch } from "react-router-dom";
import ProfessionalsPage from "./pages/professionals-page";
import Home from "./pages/home";

export default function () {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/professionals">
        <ProfessionalsPage />
      </Route>
    </Switch>
  );
}
