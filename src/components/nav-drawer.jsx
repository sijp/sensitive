import React from "react";
import {
  Drawer,
  Divider,
  List,
  IconButton,
  Hidden,
  useMediaQuery
} from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { makeStyles, useTheme } from "@material-ui/core/styles";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import {
  ExternalLinkEntry,
  InternalLinkEntry,
  ArticlesLinkEntry
} from "./nav-drawer-entries";

const useStyles = makeStyles((theme) => ({
  drawer: {
    flexShrink: 0,
    direction: "ltr",
    width: 360,
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  },
  drawerPaper: {
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    },
    width: 360,
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start"
  },
  drawerContent: {
    flex: 1,
    overflow: "auto"
  },
  drawerLink: {
    color: theme.palette.text.primary
  }
}));

const menuEntryTypes = {
  ExternalLinkEntry,
  InternalLinkEntry,
  ArticlesLinkEntry
};

function ResponsiveDrawer(props) {
  return (
    <>
      <Hidden smUp>
        <Drawer {...props} variant="temporary" />
      </Hidden>
      <Hidden xsDown>
        <Drawer {...props} variant="persistent" />
      </Hidden>
    </>
  );
}

function NavDrawer({ onChange = () => {}, opened = false, links = [] }) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => {
    onChange(false);
  };

  const createMenuEntry = (
    { type = "InternalLinkEntry", logo, highlighted, ...rest },
    index
  ) => {
    const MenuEntry = menuEntryTypes[type];

    return (
      <MenuEntry
        button
        {...rest}
        linkClassName={classes.drawerLink}
        key={index}
        onClick={isMobile ? handleClose : null}
      />
    );
  };

  return (
    <ResponsiveDrawer
      anchor="left"
      open={opened}
      onBackdropClick={handleClose}
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleClose}>
          <FontAwesomeIcon icon={faArrowRight} />
        </IconButton>
      </div>
      <Divider />
      <div className={classes.drawerContent}>
        <List>{links.map(createMenuEntry)}</List>
      </div>
    </ResponsiveDrawer>
  );
}

export default NavDrawer;
