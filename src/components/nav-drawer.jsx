import React, { useState } from "react";
import {
  Drawer,
  Divider,
  List,
  ListItemIcon,
  ListItemText,
  ListItem,
  Link as ExternalLink,
  IconButton,
  Hidden
} from "@material-ui/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { NavLink as InternalLink, useRouteMatch } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

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

function MixedListItem({
  icon,
  text,
  url,
  external,
  highlighted, // we don't want this
  logo, // we don't want this
  ...props
}) {
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
  console.log(links);

  const handleClose = () => {
    onChange(false);
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
    </ResponsiveDrawer>
  );
}

export default NavDrawer;
