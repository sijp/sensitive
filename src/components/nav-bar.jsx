import React, { useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link as ExternalLink
} from "@material-ui/core";

import { NavLink as InternalLink, useRouteMatch } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import { faBars, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  navbar: {
    marginBottom: theme.spacing(2)
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  drawer: {
    width: 240,
    flexShrink: 0
  },
  drawerPaper: {
    width: 240
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  drawerLink: {
    color: theme.palette.text.primary
  },
  contentBig: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  contentSmall: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 240
  }
}));

function MixedListItem({ icon, text, url, external, ...props }) {
  const match = useRouteMatch(url);

  const internalProps = external
    ? {
        component: ExternalLink,
        href: url,
        target: "_blank"
      }
    : {
        component: InternalLink,
        disabled: match && match.isExact,
        to: url,
        exact: true
      };
  return <ListItem {...props} {...internalProps}></ListItem>;
}

export default function ({ links = [], children }) {
  const classes = useStyles();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className={classes.root}>
      <div className={isDrawerOpen ? classes.contentSmall : classes.contentBig}>
        <AppBar position="static" className={classes.navbar}>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(!isDrawerOpen)}
            >
              <FontAwesomeIcon icon={faBars} />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              קבוצת התמיכה לבעלי כלבים רגישים
            </Typography>
          </Toolbar>
        </AppBar>
        <div>{children}</div>
      </div>
      <Drawer
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <FontAwesomeIcon icon={faArrowRight} />
          </IconButton>
        </div>
        <Divider />
        <List>
          {links.map(({ icon, text, ...rest }, index) => (
            <MixedListItem button {...rest} key={index}>
              <ListItemIcon>
                <FontAwesomeIcon icon={icon} />
              </ListItemIcon>
              <ListItemText primary={text} className={classes.drawerLink} />
            </MixedListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
}
