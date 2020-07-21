import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { connect } from "react-redux";

import {
  Grid,
  Container,
  Snackbar,
  Slide,
  makeStyles,
  CircularProgress
} from "@material-ui/core";

import ProfessionalsMap from "../components/professionals-location-filter";
import ProfessionalsFilters from "../components/professionals-filters";
import ProfessionalsResults from "../components/professinoals-results";

import { faSearchLocation } from "@fortawesome/free-solid-svg-icons";
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
    height: "80vh"
  },
  mapSmaller: {
    height: "70vh"
  },
  filters: {
    minHeight: "5vh"
  },
  filtersInMap: {
    paddingBottom: theme.spacing(3),
    textAlign: "center"
  },
  results: {
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden"
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

function ProfessionalsPage({
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
    newParams.set("city", qsCity);
    newParams.set("filters", qsFilters);
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
          {city && (
            <Grid item xs={8} className={classes.results}>
              <div className={classes.filters}>
                <ProfessionalsFilters onChange={handleFiltersChange} />
              </div>

              <ProfessionalsResults />
            </Grid>
          )}
          <Grid
            item
            xs={city ? 4 : 12}
            className={city ? classes.map : classes.mapSmaller}
          >
            {!city && (
              <div className={classes.filtersInMap}>
                <ProfessionalsFilters onChange={handleFiltersChange} />
              </div>
            )}
            <ProfessionalsMap onChange={handleCityChange} />
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        TransitionComponent={(props) => <Slide {...props} direction="right" />}
        open={!city}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        ContentProps={{ classes: { message: classes.message } }}
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
