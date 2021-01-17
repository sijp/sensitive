import React, { useState } from "react";
import {
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
  Link
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
    fontSize: theme.typography.body1.fontSize,
    "&:hover": {
      textDecoration: "none"
    }
  },
  activeNavLink: {
    color: theme.palette.grey[900],
    fontWeight: "bold"
  }
}));

const linkTypes = {
  ExternalLinkEntry: React.forwardRef(
    ({ to, activeClassName: _, ...innerProps }, ref) => (
      <Link {...innerProps} ref={ref} href={to} target="_blank" />
    )
  ),
  InternalLinkEntry: React.forwardRef((innerProps, ref) => (
    <NavLink ref={ref} exact {...innerProps} />
  ))
};

function NavButtonLink({ to, type, ...props }) {
  const classes = useStyles();
  const LinkComponent = linkTypes[type];

  return (
    <Button
      component={LinkComponent}
      activeClassName={classes.activeNavLink}
      className={classes.navLink}
      size="large"
      to={to}
      {...props}
    />
  );
}

export default function NavBar({ links = [], children }) {
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
            .filter(({ highlighted }) => highlighted)
            .map(({ url, text, icon, type = "InternalLinkEntry" }, index) => (
              <NavButtonLink
                key={`navlink-${index}`}
                to={url}
                type={type}
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
