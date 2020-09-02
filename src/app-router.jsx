import React from "react";
import { Route, Switch } from "react-router-dom";
import ProfessionalsPage from "./pages/professionals-page";
import Home from "./pages/home";
import PositionStatementsPage from "./pages/position-statements-page";

export default function AppRouter() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/about">
        <Home about={true} />
      </Route>
      <Route path="/professionals">
        <ProfessionalsPage />
      </Route>
      <Route path="/position-statements">
        <PositionStatementsPage />
      </Route>
    </Switch>
  );
}
