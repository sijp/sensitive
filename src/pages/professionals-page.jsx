import React, { useEffect, useState } from "react";

import { connect } from "react-redux";

import {
  Grid,
  Container,
  makeStyles,
  CircularProgress,
  Fab,
  useTheme,
  useMediaQuery
} from "@material-ui/core";

import ProfessionalsMap from "../components/professionals-location-filter";
import ProfessionalsFilters from "../components/professionals-filters";
import ProfessionalsResults from "../components/professionals-results";

import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { professionalActions as actions } from "../store";
import QueryStringUpdater from "../components/query-string-updater";

const useStyles = makeStyles((theme) => ({
  root: {
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
    height: "95%"
  },
  mapSmaller: {
    height: "calc(70vh - 30px)",
    maxWidth: 600,
    marginRight: "auto",
    marginLeft: "auto"
  },
  mapOnlyCombo: {
    height: "unset"
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
    textAlign: "center"
  },
  results: {
    overflow: "hidden",
    display: "flex",
    flexFlow: "column",
    height: "95%"
  },
  alert: {
    maxWidth: 720,
    marginRight: "auto",
    marginLeft: "auto"
  }
}));

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true });

  const [mounted, setMounted] = useState(false);

  const [showMap, setShowMap] = useState(!isMobile);

  useEffect(() => {
    const timeout = setTimeout(synchronize, 100);
    return () => clearTimeout(timeout);
  }, [synchronize]);
  useEffect(function () {
    const timeout = setTimeout(() => setMounted(true), 750);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <QueryStringUpdater
        filters={activeFilters}
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

      {!mounted ? (
        <div className={classes.root} style={{ textAlign: "center" }}>
          <CircularProgress color="secondary" size={120} />
        </div>
      ) : (
        <>
          <Container maxWidth="xl">
            <Grid container spacing={1} className={classes.root}>
              {(!isMobile || !showMap) && (
                <Grid item xs={isMobile ? 12 : 8} className={classes.results}>
                  <div className={classes.filters}>
                    <ProfessionalsFilters />
                  </div>

                  <ProfessionalsResults />
                </Grid>
              )}

              {(!isMobile || showMap) && (
                <Grid item xs={isMobile ? 12 : 4} className={classes.map}>
                  <ProfessionalsMap
                    showMap={true}
                    showRemoteToggle={true}
                    isMobile={isMobile}
                    onChange={() => {
                      setTimeout(() => {
                        setShowMap(false);
                      }, 250);
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </Container>

          {(!isMobile || !showMap) && (
            <div className={classes.clearCityButtonContainer}>
              <Fab
                variant="extended"
                color="primary"
                onClick={() => setShowMap(true)}
              >
                <FontAwesomeIcon icon={faMapMarkedAlt} style={{ padding: 4 }} />
                {cityList[city]?.label || "סינון לפי איזור"}
              </Fab>
            </div>
          )}
        </>
      )}
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
