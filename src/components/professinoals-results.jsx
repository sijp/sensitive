import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Typography, Box } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { connect } from "react-redux";

import { actions } from "../ducks/professionals";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexFlow: "row wrap",
    padding: theme.spacing(1),
    width: "100%",
    height: "100%",
    overflowY: "auto",
    backgroundColor: theme.palette.grey[50]
  },

  card: {
    flex: 1,
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    color: theme.palette.primary.dark,
    height: 250,
    minWidth: 350,
    maxWidth: 350
  }
}));

function Result({ result }) {
  return (
    <>
      <Typography variant="h4">{result.name}</Typography>
    </>
  );
}

function ProfessionalsResults({ style, results, synchronize, loading }) {
  const classes = useStyles();

  const renderResults = () =>
    results.map((result) => (
      <Card
        variant="outlined"
        className={classes.card}
        key={`${result.type}-${result.id}`}
      >
        <Result result={result} />
      </Card>
    ));
  const renderSkeletons = () =>
    Array(5)
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

  useEffect(
    function () {
      synchronize();
    },
    [synchronize]
  );

  return (
    <Box className={classes.root} style={style}>
      {loading ? renderSkeletons() : renderResults()}
    </Box>
  );
}

function mapStateToProps(state) {
  return {
    results: state.results,
    loading: state.loading
  };
}

export default connect(mapStateToProps, { synchronize: actions.synchronize })(
  ProfessionalsResults
);
