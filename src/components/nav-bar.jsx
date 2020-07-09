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

import { Link as InternalLink } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import { faBars, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
  }
}));

export default function ({ links = [] }) {
  const classes = useStyles();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  console.log("render", isDrawerOpen);
  return (
    <div className={classes.root}>
      <AppBar position="static">
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
          {links.map(({ icon, text, url, external }, index) => (
            <ListItem
              button
              component={external ? ExternalLink : InternalLink}
              key={index}
              href={external && url}
              to={!external && url}
              target={external && "_blank"}
            >
              <ListItemIcon>
                <FontAwesomeIcon icon={icon} />
              </ListItemIcon>
              <ListItemText primary={text} className={classes.drawerLink} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
}
