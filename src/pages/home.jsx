import React from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  BottomNavigation,
  BottomNavigationAction
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { NAVIGATION_LINKS } from "../config/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.light,
    padding: theme.spacing(1)
  },
  bottomNavigationRoot: {
    backgroundColor: theme.palette.secondary.light,
    width: 720,
    margin: `${theme.spacing(1)}px auto`,
    height: "inherit"
  },
  actionIcon: {
    fontSize: 24
  },
  actionLabel: {
    fontSize: "1rem"
  }
}));

export default function () {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Container maxWidth="xl" className={classes.root}>
      <BottomNavigation
        className={classes.bottomNavigationRoot}
        showLabels
        onChange={(_event, { external, url }) =>
          external ? window.open(url, "_blank") : history.push(url)
        }
      >
        {NAVIGATION_LINKS.filter((link) => link.highlighted).map(
          (link, index) => (
            <BottomNavigationAction
              key={index}
              label={link.text}
              icon={<FontAwesomeIcon icon={link.icon} />}
              value={link}
              classes={{
                label: classes.actionLabel,
                wrapper: classes.actionIcon
              }}
            />
          )
        )}
      </BottomNavigation>
    </Container>
  );
}
