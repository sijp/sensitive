import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Card,
  Typography,
  Box,
  Dialog,
  useMediaQuery,
  DialogActions,
  Button
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { connect } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSadTear } from "@fortawesome/free-solid-svg-icons";

import ProfessionalsResultDetails from "./professionals-result-details";

const MOBILE_CARD_WIDTH = 230;
const DEFAULT_CARD_WIDTH = 280;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexFlow: "row wrap",
    padding: theme.spacing(1),
    overflowY: "auto",
    overflowX: "hidden"
  },

  card: {
    cursor: "pointer",

    margin: theme.spacing(2),
    color: theme.palette.primary.dark,
    height: 250,
    flexBasis: DEFAULT_CARD_WIDTH,
    [theme.breakpoints.down("sm")]: {
      height: 250,
      flexBasis: MOBILE_CARD_WIDTH
    }
  },

  cardHeader: {
    padding: `0 ${theme.spacing(2)}px`
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
  cityList
}) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selected, setSelected] = useState();
  const isMobile = useMediaQuery("@media only screen and (max-width: 640px)");

  const renderResults = () =>
    results.length > 0 ? (
      results
        .sort((result1, result2) => (result1.id > result2.id ? 1 : -1))
        .sort((result1, result2) =>
          result1.pinned === result2.pinned ? 0 : result1.pinned ? -1 : 1
        )
        .map((result) => (
          <Card
            variant="outlined"
            className={classes.card}
            key={`professional-${result.id}`}
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
    results: state.results,
    loading: state.loading,
    filterTypes: state.filterTypes,
    cityList: state.cityList
  };
}

export default connect(mapStateToProps)(ProfessionalsResults);
