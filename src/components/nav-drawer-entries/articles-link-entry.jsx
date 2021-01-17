import {
  faChevronDown,
  faChevronUp,
  faCircle,
  faNewspaper
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme
} from "@material-ui/core";
import React, { useState } from "react";
import { connect } from "react-redux";
import InternalLinkEntry from "./internal-link-entry";

function ExpandableListItem({ text, articles = [], ...props }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  return (
    <>
      <ListItem button onClick={() => setOpen(!open)}>
        <ListItemIcon>
          <FontAwesomeIcon icon={faNewspaper} />
        </ListItemIcon>
        <ListItemText primary={text} />
        {open ? (
          <FontAwesomeIcon icon={faChevronUp} />
        ) : (
          <FontAwesomeIcon icon={faChevronDown} />
        )}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {articles.map((article) => (
            <InternalLinkEntry
              key={`article-link-entry-${article.id}`}
              icon={faCircle}
              text={article.text}
              url={`/article/${article.resource || article.text}`}
              style={{ ...props.style, paddingRight: theme.spacing(4) }}
              {...props}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
}

function ArticlesLinkEntry({ information, loading, ...props }) {
  if (loading || !information || !Array.isArray(information.categories))
    return <></>;

  return (
    <>
      {information.categories.map(({ text, articles }, index) =>
        articles ? (
          <ExpandableListItem
            key={`expandable-list-item-${index}`}
            text={text}
            articles={articles.map(
              (articleId) => information.mapping[articleId]
            )}
            {...props}
          />
        ) : null
      )}
    </>
  );
}

function mapStateToProps(state) {
  return {
    information: state.articlesInfo.information,
    loading: state.articlesInfo.loading
  };
}

export default connect(mapStateToProps)(ArticlesLinkEntry);
