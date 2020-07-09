import React from "react";

import { connect } from "react-redux";

import { Grid, Container } from "@material-ui/core";

import ProfessionalsMap from "../components/professionals-location-filter";
import ProfessionalsFilters from "../components/professionals-filters";
import ProfessionalsResults from "../components/professinoals-results";

function ProfessionalsPage({ city }) {
  return (
    <Container maxWidth="xl">
      <Grid container spacing={1} style={{ height: "80vh" }}>
        <Grid item xs={city ? 4 : 12}>
          <ProfessionalsMap />
        </Grid>
        {city && (
          <Grid item xs={8}>
            <ProfessionalsFilters style={{ height: "10vh" }} />
            <ProfessionalsResults style={{ height: "70vh" }} />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

function mapStateToProps(state) {
  return { cityList: state.cityList, city: state.city };
}

export default connect(mapStateToProps)(ProfessionalsPage);
