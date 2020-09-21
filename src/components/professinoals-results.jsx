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
  Badge
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSadTear } from "@fortawesome/free-solid-svg-icons";

import ProfessionalsResultDetails from "./professionals-result-details";

import { PROFESSIONAL_PRIORITY } from "../config/config";

const MOBILE_CARD_WIDTH = 230;
const DEFAULT_CARD_WIDTH = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexFlow: "row wrap",
    padding: theme.spacing(1),
    overflowY: "auto",
    overflowX: "hidden"
  },

  cardBadge: {
    margin: theme.spacing(3)
  },

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
  }
}));

function ProfessionalsResults({
  style,
  results,
  loading,
  filterTypes,
  cityList,
  admins,
  moderators
}) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selected, setSelected] = useState();
  const isMobile = useMediaQuery("@media only screen and (max-width: 640px)");

  const renderResults = () =>
    results.length > 0 ? (
      results
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
          <Badge
            className={classes.cardBadge}
            badgeContent={
              <>
                <FontAwesomeIcon icon={result.icon} />{" "}
                <span style={{ paddingRight: theme.spacing(0.5) }}>
                  {result.label}
                </span>
              </>
            }
            color="primary"
            invisible={!result.icon}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            key={`professional-${result.id}`}
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
          </Badge>
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

  return (
    <Box className={classes.root} style={style}>
      {loading ? renderSkeletons() : renderResults()}

      <Dialog
        open={!!selected}
        onClose={handleCloseDialog}
        className={classes.modal}
      >
        {selected && renderModalContent()}
        <DialogActions>
          <Button autoFocus onClick={handleCloseDialog} color="secondary">
            אוקיי
          </Button>
        </DialogActions>
      </Dialog>
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
    moderators: state.team.moderators || []
  };
}

export default connect(mapStateToProps)(ProfessionalsResults);
