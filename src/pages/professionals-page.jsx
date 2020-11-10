import React, { useEffect, useState } from "react";

import { connect } from "react-redux";

import {
  Grid,
  Container,
  makeStyles,
  CircularProgress,
  Hidden,
  Fab
} from "@material-ui/core";

import ProfessionalsMap from "../components/professionals-location-filter";
import ProfessionalsFilters from "../components/professionals-filters";
import ProfessionalsResults from "../components/professinoals-results";

import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { actions } from "../ducks/professionals";
import { Alert } from "@material-ui/lab";
import QueryStringUpdater from "../components/query-string-updater";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[50],
    paddingTop: theme.spacing(2),
    height: `calc(100vh - ${
      theme.mixins.toolbar.minHeight + theme.spacing(1)
    }px)`
  },
  rootNoCity: {
    height: `calc(100% - ${
      theme.mixins.toolbar.minHeight + theme.spacing(1)
    }px)`
  },
  message: {
    flex: 1,
    textAlign: "center"
  },
  snackIcon: {
    paddingRight: 5,
    paddingLeft: 5
  },
  map: {
    height: "95%",
    "@media only screen and (max-width: 640px)": {
      display: "none"
    }
  },
  mapSmaller: {
    height: "calc(70vh - 30px)"
  },
  clearCityButtonContainer: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    "@media only screen and (min-width: 640px)": {
      display: "none"
    }
  },
  filters: {
    flex: "0 1 auto"
  },
  filtersInMap: {
    textAlign: "center",
    "@media only screen and (max-width: 640px)": {
      display: "none"
    }
  },
  results: {
    overflow: "hidden",
    display: "flex",
    flexFlow: "column",
    height: "95%"
  }
}));

function ResponsiveResultsGrid(props) {
  return (
    <>
      <Hidden smUp>
        <Grid {...props} xs={12} />
      </Hidden>
      <Hidden xsDown>
        <Grid {...props} />
      </Hidden>
    </>
  );
}

function ProfessionalsPage({
  cityList,
  city,
  activeFilters,
  showingRemote,
  setCity,
  setFilters,
  setShowRemote,
  synchronize
}) {
  const classes = useStyles();

  const [mounted, setMounted] = useState(false);

  useEffect(
    function () {
      synchronize();
    },
    [synchronize]
  );
  useEffect(function () {
    setTimeout(() => setMounted(true), 500);
  }, []);

  if (!mounted) {
    return (
      <div className={classes.root} style={{ textAlign: "center" }}>
        <CircularProgress color="secondary" size={120} />
      </div>
    );
  }
  return (
    <>
      <Container maxWidth="xl">
        {!city && (
          <Alert severity="info" className={classes.alert}>
            כדי להתחיל, יש לסמן את סוג השירות המבוקש, ואת איזור המגורים. אם
            איזור המגורים לא מופיע יש לבחור במפה את האיזור הקרוב ביותר
          </Alert>
        )}
        <Grid
          container
          spacing={1}
          className={`${classes.root} ${city ? "" : classes.rootNoCity}`}
        >
          <ResponsiveResultsGrid
            item
            xs={city ? 8 : 12}
            className={city && classes.results}
          >
            <div className={city ? classes.filters : classes.filtersInMap}>
              <ProfessionalsFilters />
            </div>

            {city && <ProfessionalsResults />}
          </ResponsiveResultsGrid>

          <Grid
            item
            xs={city ? 4 : 12}
            className={city ? classes.map : classes.mapSmaller}
          >
            <ProfessionalsMap />
          </Grid>
        </Grid>
      </Container>

      {city && (
        <div className={classes.clearCityButtonContainer}>
          <Fab
            variant="extended"
            color="primary"
            onClick={() => {
              setCity(undefined);
            }}
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ padding: 4 }} />
            {cityList[city]?.label}
          </Fab>
        </div>
      )}
      <QueryStringUpdater
        filters={Object.keys(activeFilters)}
        city={city}
        remote={showingRemote}
        init={(queryParams) => {
          const filters = queryParams.get("filters");
          const city = queryParams.get("city");
          const remote = queryParams.get("remote");

          if (filters) setFilters(filters.split(","));
          if (city) setCity(city);
          if (remote) setShowRemote(remote === "true");
        }}
      />
    </>
  );
}

function mapStateToProps(state) {
  return {
    cityList: state.professionals.cityList,
    city: state.professionals.city,
    activeFilters: state.professionals.activeFilters,
    showingRemote: state.professionals.showRemote
  };
}

export default connect(mapStateToProps, {
  setFilters: actions.setFilters,
  setCity: actions.setCity,
  setShowRemote: actions.setShowRemote,
  synchronize: actions.synchronize
})(ProfessionalsPage);
