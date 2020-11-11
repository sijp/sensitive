import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { NavLink as InternalLink, useRouteMatch } from "react-router-dom";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function InternalLinkEntry({ icon, text, url, linkClassName, ...props }) {
  const match = useRouteMatch(url);

  return (
    <ListItem
      {...props}
      component={InternalLink}
      disabled={match && match.isExact}
      to={url}
      exact={true}
    >
      <ListItemIcon>
        <FontAwesomeIcon icon={icon} />
      </ListItemIcon>
      <ListItemText primary={text} className={linkClassName} />
    </ListItem>
  );
}

export default InternalLinkEntry;
