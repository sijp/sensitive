import React, { useState } from "react";
import {
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavDrawer from "./nav-drawer";
import { useRouteMatch, NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  homeBar: {
    boxShadow: "none"
  },
  defaultBar: {},
  logoBanner: {
    textAlign: "center",
    "& > svg": {
      width: "20vh",
      height: "20vh"
    }
  },
  navLink: {
    color: theme.palette.grey[800],
    marginRight: theme.spacing(1),
    fontSize: theme.typography.body1.fontSize
  },
  activeNavLink: {
    color: theme.palette.grey[900],
    fontWeight: "bold"
  }
}));

function NavButtonLink({ to, ...props }) {
  const classes = useStyles();

  return (
    <Button
      component={React.forwardRef((innerProps, ref) => (
        <NavLink ref={ref} {...innerProps} exact to={to} />
      ))}
      activeClassName={classes.activeNavLink}
      className={classes.navLink}
      size="large"
      {...props}
    />
  );
}

export default function ({ links = [], children }) {
  const classes = useStyles();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isHome = useRouteMatch("/").isExact;
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuClick = () => setDrawerOpen(!isDrawerOpen);

  return (
    <>
      <AppBar
        position="sticky"
        className={isHome ? classes.homeBar : classes.defaultBar}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuClick}
            style={mobile ? { marginLeft: theme.spacing(3) } : {}}
          >
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
          {links
            .filter(({ highlighted, external }) => highlighted && !external)

            .map(({ url, text, icon }, index) => (
              <NavButtonLink
                key={`navlink-${index}`}
                to={url}
                startIcon={<FontAwesomeIcon icon={icon} />}
              >
                {!mobile && text}
              </NavButtonLink>
            ))}
        </Toolbar>
      </AppBar>

      <NavDrawer links={links} opened={isDrawerOpen} onChange={setDrawerOpen} />

      {children}
    </>
  );
}
