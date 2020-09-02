import React, { useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Fab,
  Hidden
} from "@material-ui/core";

import { Link, useRouteMatch, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import {
  faBars,
  faArrowRight,
  faSearch,
  faSearchLocation
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import classNames from "classnames";

import { ReactComponent as Logo } from "../logo.svg";
import NavDrawer from "./nav-drawer";

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
    height: "10vh",
    position: "relative",
    top: "50vh",
    left: 0,
    //backgroundColor: theme.palette.primary.light + "33",
    zIndex: theme.zIndex.appBar + 1,
    marginBottom: "-10vh",

    "& $svg": {
      marginRight: theme.spacing(12),
      float: "right",
      //backgroundColor: theme.palette.primary.light,
      height: "17vh",
      width: "17vh",
      "@media only screen and (max-width: 640px)": {
        marginRight: theme.spacing(2)
      }
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
    marginLeft: 240,
    "@media only screen and (max-width: 640px)": {
      marginLeft: "inherit"
    }
  },
  fabContainer: {
    position: "absolute",
    zIndex: theme.zIndex.appBar + 2,
    top: theme.spacing(7),
    width: "100%",

    display: "flex",
    flexFlow: "column",
    "@media only screen and (max-width: 640px)": {
      top: "45vh"
    },
    "& $button": {
      fontSize: theme.typography.h5.fontSize,
      padding: theme.spacing(4),
      margin: "0 auto",
      "@media only screen and (max-width: 640px)": {
        fontSize: theme.typography.body1.fontSize,
        padding: theme.spacing(2)
      }
    },
    "& $svg": {
      padding: theme.spacing(1)
    }
  }
}));

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
              <FontAwesomeIcon icon={faSearchLocation} color="primary" />
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
      <NavDrawer links={links} opened={isDrawerOpen} onChange={setDrawerOpen} />
    </div>
  );
}
