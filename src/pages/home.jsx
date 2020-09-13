import React, { useState } from "react";
import { Container, Typography, useScrollTrigger } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import TeamList from "../components/team-list";
import Article from "../components/article";
import Cover from "../components/cover";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[100],
    marginTop: -theme.mixins.toolbar.minHeight,
    [theme.breakpoints.down("sm")]: {
      paddingTop: theme.mixins.toolbar.minHeight
    }
  },
  bottomNavigationRoot: {
    backgroundColor: theme.palette.secondary.light,
    padding: theme.spacing(1)
  },
  bottomNavigation: {
    backgroundColor: theme.palette.secondary.light,
    maxWidth: 720,
    margin: `${theme.spacing(1)}px auto`,
    height: "inherit"
  },
  searchBarRoot: {
    backgroundColor: theme.palette.primary.main
  },
  searchBar: {
    backgroundColor: theme.palette.primary.main
  },
  actionIcon: {
    fontSize: 24
  },
  actionLabel: {
    fontSize: "1rem"
  }
}));

export default function ({ about }) {
  const classes = useStyles();
  const history = useHistory();
  const [mounted, setMounted] = useState(false);
  const trigger = useScrollTrigger({
    threshold:
      Math.max(document.documentElement.clientHeight, window.innerHeight || 0) *
      0.8,
    disableHysteresis: true
  });
  console.log("HOME render");
  console.log(trigger);

  const scrollToSection = () => {
    console.log("effect1");
    setTimeout(() => {
      if (about)
        window.scrollTo({
          top: Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0
          ),
          behavior: "smooth"
        });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      if (!mounted) setMounted(true);
    }, 100);
  };

  const changeRoute = () => {
    console.log("effect2");
    if (mounted) history.push(trigger ? "/about" : "/");
  };

  useEffect(scrollToSection, [about]);
  useEffect(changeRoute, [trigger]);

  useEffect(() => () => window.scrollTo({ top: 0, behavior: "smooth" }), []);

  return (
    <div className={classes.root}>
      <Cover />

      <Container maxWidth="lg" id="about">
        <Typography
          variant="h2"
          style={{ textAlign: "center", marginBottom: 32, marginTop: 64 }}
        >
          על הקבוצה
        </Typography>
        <Article name="about-group" />
        <TeamList type="admins" />
        <Article name="about-moderators" />
        <TeamList type="moderators" />
      </Container>
    </div>
  );
}
