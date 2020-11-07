import React from "react";
import { Drawer, Divider, List, IconButton, Hidden } from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { makeStyles } from "@material-ui/core/styles";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import {
  ExternalLinkEntry,
  InternalLinkEntry,
  ArticlesLinkEntry
} from "./nav-drawer-entries";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 240,
    flexShrink: 0,
    direction: "ltr"
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
      />
    );
  };

  return (
    <ResponsiveDrawer
      anchor="left"
      open={opened}
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
      <List>{links.map(createMenuEntry)}</List>
    </ResponsiveDrawer>
  );
}

export default NavDrawer;
