import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  Typography,
  Box,
  List,
  ListItemText,
  Link,
  Tooltip
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneSquare,
  faGlobe,
  faAt,
  faSadTear
} from "@fortawesome/free-solid-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexFlow: "row wrap",
    padding: theme.spacing(1)
  },

  card: {
    flex: 1,
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    color: theme.palette.primary.dark,
    height: 250,
    minWidth: 350,
    maxWidth: 350
  },

  cardContent: {
    color: theme.palette.secondary.dark
  },

  noResults: {
    color: theme.palette.secondary.light,
    width: "100%",
    textAlign: "center"
  }
}));

function Result({ result, cardContentClass, filterTypes, cityList }) {
  return (
    <>
      <Typography variant="h3">{result.name}</Typography>

      <List className={cardContentClass}>
        <ListItemText>
          <Typography variant="h5">
            <FontAwesomeIcon icon={faPhoneSquare} /> {"  "} {result.phone}
          </Typography>
        </ListItemText>
        <ListItemText>
          <Typography variant="h5">
            <Link href={result.facebookPage} color="inherit" target="_blank">
              <FontAwesomeIcon icon={faFacebookF} />
            </Link>{" "}
            {"  "}
            <Link href={result.web} color="inherit" target="_blank">
              <FontAwesomeIcon icon={faGlobe} />
            </Link>{" "}
            {"  "}
            <Link
              href={`mailto:${result.email}`}
              color="inherit"
              target="_blank"
            >
              <FontAwesomeIcon icon={faAt} />
            </Link>
          </Typography>
        </ListItemText>
        <ListItemText>
          שירותים:{"  "}
          {result.services.map((service) => (
            <Tooltip
              key={`service-${result.id}-${service}-tooltip`}
              title={filterTypes[service]?.label || "NO TITLE"}
              arrow
              placement="top"
            >
              <span>
                <FontAwesomeIcon
                  key={`service-${result.id}-${service}`}
                  icon={filterTypes[service]?.icon}
                  style={{ marginRight: 5 }}
                />
              </span>
            </Tooltip>
          ))}
        </ListItemText>
        <ListItemText>
          איזורים: {"  "}
          {result.cities.map((city) => cityList[city]?.label).join(", ")}
        </ListItemText>
      </List>
    </>
  );
}

function ProfessionalsResults({
  style,
  results,
  loading,
  filterTypes,
  cityList
}) {
  const classes = useStyles();

  const renderResults = () =>
    results.length > 0 ? (
      results
        .sort((result1, result2) => (result1.name > result2.name ? 1 : -1))
        .map((result) => (
          <Card
            variant="outlined"
            className={classes.card}
            key={`${result.type}-${result.id}`}
          >
            <Result
              result={result}
              cardContentClass={classes.cardContent}
              filterTypes={filterTypes}
              cityList={cityList}
            />
          </Card>
        ))
    ) : (
      <Typography variant="h2" className={classes.noResults}>
        לא נמצאו תוצאות <FontAwesomeIcon icon={faSadTear} />
      </Typography>
    );
  const renderSkeletons = () =>
    Array(2)
      .fill()
      .map((_, i) => (
        <Card
          variant="outlined"
          className={classes.card}
          key={`result-skeleton-${i}`}
        >
          <Skeleton variant="text" />
          <Skeleton variant="circle" width={40} height={40} />
          <Skeleton variant="rect" width="100%" height={150} />
        </Card>
      ));

  return (
    <Box className={classes.root} style={style}>
      {loading ? renderSkeletons() : renderResults()}
    </Box>
  );
}

function mapStateToProps(state) {
  return {
    results: state.results,
    loading: state.loading,
    filterTypes: state.filterTypes,
    cityList: state.cityList
  };
}

export default connect(mapStateToProps)(ProfessionalsResults);
