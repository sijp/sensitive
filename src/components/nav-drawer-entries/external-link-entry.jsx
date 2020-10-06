import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ListItem,
  Link as ExternalLink,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";

import React from "react";

function ExternalLinkEntry({
  icon,
  text,
  url,
  external,
  linkClassName,
  ...props
}) {
  return (
    <ListItem {...props} component={ExternalLink} target="_blank" href={url}>
      <ListItemIcon>
        <FontAwesomeIcon icon={icon} />
      </ListItemIcon>
      <ListItemText primary={text} className={linkClassName} />
    </ListItem>
  );
}

export default ExternalLinkEntry;
