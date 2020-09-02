import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import TeamMember from "./team-member";
import { Grid, makeStyles } from "@material-ui/core";

const GRID_PROPS = {
  admins: {
    xs: 12,
    sm: 6
  },
  moderators: {
    xs: 12,
    sm: 4
  },
  all: {
    xs: 12,
    sm: 4
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  },
  item: {
    padding: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
      paddingRight: 0,
      flexGrow: 1
    }
  },
  card: {
    display: "flex",
    flexFlow: "column",
    height: "100%"
  },
  media: {
    height: 360
  },
  content: {}
}));

function TeamList({ type, members }) {
  const list = members[type] || [];
  const classes = useStyles();

  return (
    <Grid container justify="center" className={classes.root}>
      {list.map((member) => (
        <Grid
          item
          key={`team-member-${member.id}`}
          {...GRID_PROPS[type]}
          className={classes.item}
        >
          <TeamMember member={member} classes={classes} />
        </Grid>
      ))}
    </Grid>
  );
}

TeamList.propTypes = {
  members: PropTypes.object,
  type: PropTypes.oneOf(["admins", "moderators", "all"])
};

function mapStateToProps(state) {
  const {
    team: { admins = [], moderators = [] }
  } = state;
  return {
    members: {
      admins,
      moderators,
      all: [...admins, ...moderators]
    }
  };
}

export default connect(mapStateToProps)(TeamList);
