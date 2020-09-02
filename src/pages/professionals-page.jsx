import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { connect } from "react-redux";

import {
  Grid,
  Container,
  Snackbar,
  Slide,
  makeStyles,
  CircularProgress,
  Hidden,
  Chip,
  Fab
} from "@material-ui/core";

import ProfessionalsMap from "../components/professionals-location-filter";
import ProfessionalsFilters from "../components/professionals-filters";
import ProfessionalsResults from "../components/professinoals-results";

import {
  faSearchLocation,
  faLocationArrow,
  faMapMarker,
  faMap,
  faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { actions } from "../ducks/professionals";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[50],
    height: "80vh"
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
    height: "80vh",
    "@media only screen and (max-width: 640px)": {
      display: "none"
    }
  },
  mapSmaller: {
    height: "70vh"
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
    height: "80vh"
  }
}));

function useQuery() {
  const location = useLocation();
  const history = useHistory();
  return [
    location.search,
    (search) => history.replace({ ...location, search: search.toString() })
  ];
}

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
  setCity,
  setFilters,
  synchronize
}) {
  const classes = useStyles();
  const [queryString, setQueryString] = useQuery();
  const queryParams = new URLSearchParams(queryString);
  const [mounted, setMounted] = useState(false);

  const qsCity = queryParams.get("city") || city;
  const qsFilters =
    queryParams.get("filters") || Object.keys(activeFilters).join(",") || "";

  const handleCityChange = (city) => {
    const newParams = new URLSearchParams(queryString);
    newParams.set("city", city);
    setQueryString(newParams);
  };

  const handleFiltersChange = (filter, enabled) => {
    const newParams = new URLSearchParams(queryString);
    const currentFilters = Object.keys(activeFilters) || [];
    const newFilters = enabled
      ? [...currentFilters, filter]
      : currentFilters.filter((f) => f !== filter);
    newParams.set("filters", newFilters.join(","));
    setQueryString(newParams);
  };

  useEffect(
    function () {
      if (qsCity) setCity(qsCity);
      if (qsFilters) setFilters(qsFilters.split(","));
    },
    // eslint-disable-next-line
    [qsCity, qsFilters]
  );

  useEffect(function () {
    const newParams = new URLSearchParams(queryString);

    if (qsCity) newParams.set("city", qsCity);
    else newParams.delete("city");

    if (qsFilters && qsFilters.length > 0) newParams.set("filters", qsFilters);
    else newParams.delete("filters");

    setQueryString(newParams);
    // eslint-disable-next-line
  }, []);

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
      <div style={{ textAlign: "center" }}>
        <CircularProgress color="secondary" size={120} />
      </div>
    );
  }
  return (
    <>
      <Container maxWidth="xl">
        <Grid container spacing={1} className={classes.root}>
          <ResponsiveResultsGrid
            item
            xs={city ? 8 : 12}
            className={city && classes.results}
          >
            <div className={city ? classes.filters : classes.filtersInMap}>
              <ProfessionalsFilters onChange={handleFiltersChange} />
            </div>

            {city && <ProfessionalsResults />}
          </ResponsiveResultsGrid>

          <Grid
            item
            xs={city ? 4 : 12}
            className={city ? classes.map : classes.mapSmaller}
          >
            <ProfessionalsMap onChange={handleCityChange} />
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
      {!city && (
        <Snackbar
          TransitionComponent={(props) => (
            <Slide {...props} direction="right" />
          )}
          open={!city}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          ContentProps={{ classes: { message: classes.message } }}
          style={{ position: "fixed" }}
          message={
            <>
              <FontAwesomeIcon
                icon={faSearchLocation}
                className={classes.snackIcon}
              />{" "}
              כדי להתחיל, יש לסמן את סוג השירות המבוקש, ואת איזור המגורים
            </>
          }
        />
      )}
    </>
  );
}

function mapStateToProps(state) {
  return {
    cityList: state.cityList,
    city: state.city,
    activeFilters: state.activeFilters
  };
}

export default connect(mapStateToProps, {
  setFilters: actions.setFilters,
  setCity: actions.setCity,
  synchronize: actions.synchronize
})(ProfessionalsPage);
