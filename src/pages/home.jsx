import React, { useState } from "react";
import { Container, useScrollTrigger } from "@material-ui/core";
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

export default function Home({ about }) {
  const classes = useStyles();
  const history = useHistory();
  const [mounted, setMounted] = useState(false);
  const trigger = useScrollTrigger({
    threshold:
      Math.max(document.documentElement.clientHeight, window.innerHeight || 0) *
      0.8,
    disableHysteresis: true
  });

  const scrollToSection = () => {
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
    if (mounted) history.push(trigger ? "/about" : "/");
  };

  // eslint-disable-next-line
  useEffect(scrollToSection, [about]);
  // eslint-disable-next-line
  useEffect(changeRoute, [trigger]);

  useEffect(() => () => window.scrollTo({ top: 0, behavior: "smooth" }), []);

  return (
    <div className={classes.root}>
      <Cover />

      <Container
        maxWidth="lg"
        id="about"
        style={{ marginTop: 64, minHeight: "100vh" }}
      >
        <Article name={process.env.REACT_APP_ABOUT_PAGE_ID1} />
        <TeamList type="admins" />
        <Article name={process.env.REACT_APP_ABOUT_PAGE_ID2} />
        <TeamList type="moderators" />
      </Container>
    </div>
  );
}
