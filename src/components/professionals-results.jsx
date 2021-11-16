import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Card,
  Typography,
  Box,
  Dialog,
  useMediaQuery,
  DialogActions,
  Button,
  Badge,
  Tooltip,
  ListItem,
  Divider,
  List
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseUser,
  faLaptopHouse,
  faSadTear
} from "@fortawesome/free-solid-svg-icons";

import ProfessionalsResultDetails from "./professionals-result-details";

import { PROFESSIONAL_PRIORITY } from "../config/config";
import ProfessionalsRemoteSwitch from "./professionals-remote-switch";

const MOBILE_CARD_WIDTH = 230;
const DEFAULT_CARD_WIDTH = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    overflowY: "auto",
    overflowX: "hidden",
    direction: "rtl",
    paddingLeft: theme.spacing(3)
  },

  flippedScrollBar: {
    direction: "ltr"
  },

  resultsFlex: {
    display: "flex",
    flexFlow: "row wrap",
    padding: theme.spacing(1)
  },

  cardBadge: {
    margin: theme.spacing(3)
  },
  cardRemoteBadge: {},

  card: {
    cursor: "pointer",

    color: theme.palette.primary.dark,
    height: 250,
    flexBasis: DEFAULT_CARD_WIDTH,
    [theme.breakpoints.down("sm")]: {
      height: 250,
      flexBasis: MOBILE_CARD_WIDTH
    }
  },

  cardHeader: {
    padding: `0 ${theme.spacing(2)}px`,
    color: theme.palette.primary.dark
  },

  cardContent: {
    color: theme.palette.secondary.dark,
    padding: `0 ${theme.spacing(2)}px`,
    direction: "ltr"
  },

  noResults: {
    color: theme.palette.secondary.light,
    width: "100%",
    textAlign: "center"
  },

  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  modalCard: {
    direction: "ltr",
    "& $cardContent": {
      margin: theme.spacing(2),
      marginTop: 0
    },
    "& h6": {
      color: theme.palette.primary.dark,
      fontSize: "2em",
      margin: theme.spacing(2),
      marginBottom: 0
    }
  },
  divider: {
    width: "80%",
    margin: "0 auto"
  },
  dividerText: {
    textAlign: "center"
  }
}));

function PriorityBadge({ className, result, theme, children }) {
  return (
    <Badge
      className={className}
      badgeContent={
        <>
          {result.icon && <FontAwesomeIcon icon={result.icon} />}
          <span style={{ paddingRight: theme.spacing(0.5) }}>
            {result.label}
          </span>
        </>
      }
      color="primary"
      invisible={!result.icon}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
    >
      {children}
    </Badge>
  );
}

function RemoteBadge({
  children,
  result,
  className,
  theme,
  invisible,
  title = "שירות מקוון"
}) {
  return (
    <Badge
      className={className}
      badgeContent={
        <Tooltip title={title} arrow placement="top">
          <div>
            <FontAwesomeIcon icon={faLaptopHouse} />
          </div>
        </Tooltip>
      }
      color="primary"
      invisible={invisible || !result.remote}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      {children}
    </Badge>
  );
}

function ProfessionalsResults({
  style,
  results,
  loading,
  filterTypes,
  cityList,
  admins,
  moderators,
  showingRemote,
  city
}) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selected, setSelected] = useState();
  const isMobile = useMediaQuery("@media only screen and (max-width: 640px)");
  const resultsLabels = [
    <>
      <FontAwesomeIcon icon={faHouseUser} /> שירות פיזי לאיזור המסומן
    </>,
    <>
      <FontAwesomeIcon icon={faLaptopHouse} /> שירות מקוון בלבד לאיזור המסומן
    </>
  ];

  const renderResults = (subResults, index) => {
    if (subResults.length === 0) return null;
    return (
      <React.Fragment key={`sub-results-${index}`}>
        {resultsLabels[index] && (
          <>
            <Divider component="li" className={classes.divider} />
            <li>
              <Typography
                className={classes.dividerText}
                color="textSecondary"
                display="block"
                variant="caption"
              >
                {resultsLabels[index]}
              </Typography>
            </li>
          </>
        )}
        <ListItem className={classes.resultsFlex}>
          {subResults
            .map((result) => {
              const resultType = result.pinned
                ? "star"
                : moderators
                    .map((mod) => mod.name)
                    .includes(`${result.firstName} ${result.lastName}`)
                ? "moderator"
                : admins
                    .map((admin) => admin.name)
                    .includes(`${result.firstName} ${result.lastName}`)
                ? "admin"
                : "regular";
              return { ...result, ...PROFESSIONAL_PRIORITY[resultType] };
            })
            .sort((result1, result2) => result2.order - result1.order)
            .map((result) => (
              <PriorityBadge
                className={classes.cardBadge}
                result={result}
                theme={theme}
                key={`professional-${result.id}`}
              >
                <RemoteBadge
                  className={classes.cardRemoteBadge}
                  result={result}
                  theme={theme}
                  invisible={!showingRemote}
                  title={index === 0 ? "גם שירות מקוון לאיזור" : undefined}
                >
                  <Card
                    className={classes.card}
                    variant="outlined"
                    onClick={() => setSelected(result)}
                  >
                    <ProfessionalsResultDetails
                      result={result}
                      cardHeaderClass={classes.cardHeader}
                      cardContentClass={classes.cardContent}
                      width={isMobile ? MOBILE_CARD_WIDTH : DEFAULT_CARD_WIDTH}
                      filterTypes={filterTypes}
                      cityList={cityList}
                    />
                  </Card>
                </RemoteBadge>
              </PriorityBadge>
            ))}
        </ListItem>
      </React.Fragment>
    );
  };
  const renderNoResults = () => (
    <>
      <Typography variant="h2" className={classes.noResults}>
        לא נמצאו תוצאות
        <br />
        <FontAwesomeIcon icon={faSadTear} />
      </Typography>
      {!showingRemote && (
        <Typography variant="h4" className={classes.noResults}>
          אבל אולי אפשר לקבל שירות מקוון? <br />
          <ProfessionalsRemoteSwitch />
        </Typography>
      )}
    </>
  );
  const renderSkeletons = () =>
    Array(2)
      .fill()
      .map((_, i) => (
        <Card
          key={`skeleton-card-${i}`}
          variant="outlined"
          className={`${classes.card} ${classes.cardBadge}`}
        >
          <Skeleton variant="text" />
          <Skeleton variant="circle" width={40} height={40} />
          <Skeleton variant="rect" width="100%" height={150} />
        </Card>
      ));

  const renderModalContent = () => {
    return (
      <div className={classes.modalCard}>
        <ProfessionalsResultDetails
          result={selected}
          cardHeaderClass={classes.cardHeader}
          cardContentClass={classes.cardContent}
          filterTypes={filterTypes}
          cityList={cityList}
          width={fullScreen ? 300 : 500}
          bannerHeight={120}
          showDetails
        />
      </div>
    );
  };

  const handleCloseDialog = () => setSelected(undefined);
  const splitResults = (results, tester) => {
    const group1 = [];
    const group2 = [];
    results.forEach((result) =>
      tester(result) ? group1.push(result) : group2.push(result)
    );
    return [group1, group2];
  };
  const resultsGroups = showingRemote
    ? splitResults(results, (result) => result.cities.includes(city))
    : [results];

  return (
    <Box className={classes.root} style={style}>
      <Box className={classes.flippedScrollBar}>
        {loading ? (
          <Box className={classes.resultsFlex}>{renderSkeletons()}</Box>
        ) : results.length > 0 ? (
          <>
            <Typography
              variant="body2"
              color="secondary"
              component="div"
              align="center"
            >
              {results.length} תוצאות
            </Typography>
            <List>{resultsGroups.map(renderResults)}</List>
          </>
        ) : (
          renderNoResults()
        )}

        <Dialog
          open={!!selected}
          onClose={handleCloseDialog}
          className={classes.modal}
        >
          {selected && renderModalContent()}
          <DialogActions>
            <Button autoFocus onClick={handleCloseDialog} color="secondary">
              חזרה לתוצאות
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

function mapStateToProps(state) {
  return {
    results: state.professionals.results,
    loading: state.professionals.loading,
    filterTypes: state.professionals.filterTypes,
    cityList: state.professionals.cityList,
    admins: state.team.admins || [],
    moderators: state.team.moderators || [],
    showingRemote: state.professionals.showRemote,
    city: state.professionals.city
  };
}

export default connect(mapStateToProps)(ProfessionalsResults);
