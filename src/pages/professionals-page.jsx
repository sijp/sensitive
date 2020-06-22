import React from "react";

import { Grid, Container } from "@material-ui/core";

import ProfessionalsMap from "../components/professionals-location-filter";
import ProfessionalsFilters from "../components/professionals-filters";
import ProfessionalsResults from "../components/professinoals-results";

export default function () {
  return (
    <Container maxWidth="xl">
      <Grid container spacing={1} style={{ height: "80vh" }}>
        <Grid item xs={4}>
          <ProfessionalsMap />
        </Grid>
        <Grid item xs={8}>
          <ProfessionalsFilters style={{ height: "10vh" }} />
          <ProfessionalsResults style={{ height: "70vh" }} />
        </Grid>
      </Grid>
    </Container>
  );
}
