import React from "react";

import { connect } from "react-redux";

import {
  Grid,
  Container,
  Snackbar,
  Slide,
  makeStyles
} from "@material-ui/core";

import ProfessionalsMap from "../components/professionals-location-filter";
import ProfessionalsFilters from "../components/professionals-filters";
import ProfessionalsResults from "../components/professinoals-results";

import { faSearchLocation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles(() => ({
  message: {
    flex: 1,
    textAlign: "center"
  },
  snackIcon: {
    paddingRight: 5,
    paddingLeft: 5
  },
  map: {
    height: "80vh"
  },
  filters: {
    height: "10vh"
  },
  results: {
    height: "70vh"
  }
}));

function ProfessionalsPage({ city }) {
  const classes = useStyles();
  return (
    <>
      <Container maxWidth="xl">
        <Grid container spacing={1} className={classes.map}>
          <Grid item xs={city ? 4 : 12}>
            <ProfessionalsMap />
          </Grid>
          {city && (
            <Grid item xs={8}>
              <ProfessionalsFilters className={classes.filters} />
              <ProfessionalsResults className={classes.results} />
            </Grid>
          )}
        </Grid>
      </Container>
      <Snackbar
        TransitionComponent={(props) => <Slide {...props} direction="down" />}
        open={!city}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        ContentProps={{ classes: { message: classes.message } }}
        message={
          <>
            <FontAwesomeIcon
              icon={faSearchLocation}
              className={classes.snackIcon}
            />{" "}
            איפה אתם מחפשים?
          </>
        }
      />
    </>
  );
}

function mapStateToProps(state) {
  return { cityList: state.cityList, city: state.city };
}

export default connect(mapStateToProps)(ProfessionalsPage);
