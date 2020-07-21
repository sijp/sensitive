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
  Link as ExternalLink,
  Fab
} from "@material-ui/core";

import {
  NavLink as InternalLink,
  Link,
  useRouteMatch,
  useHistory
} from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import {
  faBars,
  faArrowRight,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import classNames from "classnames";

import { ReactComponent as Logo } from "../logo.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  navbar: {
    marginBottom: theme.spacing(2)
  },
  navbarBorderless: {
    border: 0
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  altMenuButton: {
    color: theme.palette.primary.main
  },
  title: {
    flexGrow: 1,
    color: theme.palette.text.primary,
    textDecoration: "none"
  },
  bigToolbar: {
    minHeight: "60vh",
    alignItems: "flex-start",
    overflow: "hidden",
    backgroundColor: theme.palette.primary.light,
    backgroundImage: "url(/banner.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50% 70%",
    backgroundSize: "cover",
    transition: theme.transitions.create("min-height", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  smallToolbar: {
    transition: theme.transitions.create("min-height", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  logoBanner: {
    width: "100%",
    height: "15vh",
    position: "relative",
    top: "40vh",
    left: 0,
    backgroundColor: theme.palette.primary.light + "33",
    zIndex: theme.zIndex.appBar + 1,
    marginBottom: "-15vh",

    "& $svg": {
      marginRight: theme.spacing(12),
      float: "right",
      backgroundColor: theme.palette.primary.light,
      height: "15vh",
      width: "15vh"
    }
  },
  showLogo: {
    height: 500,
    transition: theme.transitions.create("height", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  hideLogo: {
    height: 0
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
  },
  fabContainer: {
    position: "absolute",
    zIndex: theme.zIndex.appBar + 2,
    top: "43vh",
    width: "100%",
    display: "flex",
    flexFlow: "column",
    "& $button": {
      fontSize: theme.typography.h5.fontSize,
      padding: theme.spacing(4),
      margin: "0 auto"
    },
    "& $svg": {
      padding: theme.spacing(1)
    }
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

export default function ({ links = [], children }) {
  const classes = useStyles();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const isHome = useRouteMatch("/").isExact;
  const history = useHistory();

  return (
    <div className={classes.root}>
      <div className={isDrawerOpen ? classes.contentSmall : classes.contentBig}>
        {isHome && !isDrawerOpen && (
          <div className={classes.fabContainer}>
            <Fab
              color="primary"
              variant="extended"
              onClick={() => history.push("/professionals")}
            >
              <FontAwesomeIcon icon={faSearch} color="primary" />
              אינדקס אנשי מקצוע
            </Fab>
          </div>
        )}
        <AppBar
          position="static"
          className={isHome ? classes.navbarBorderless : classes.navbar}
          variant={isHome ? "outlined" : "elevation"}
        >
          {isHome && (
            <div className={classes.logoBanner}>
              <Logo />{" "}
            </div>
          )}

          <Toolbar
            className={isHome ? classes.bigToolbar : classes.smallToolbar}
          >
            <IconButton
              edge="start"
              className={classNames(classes.menuButton, {
                [classes.altMenuButton]: isHome
              })}
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(!isDrawerOpen)}
            >
              <FontAwesomeIcon icon={faBars} />
            </IconButton>
            {!isHome && (
              <Link to="/" className={classes.title}>
                <Typography variant="h6" className={classes.title}>
                  קבוצת התמיכה לבעלי כלבים רגישים
                </Typography>
              </Link>
            )}
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
