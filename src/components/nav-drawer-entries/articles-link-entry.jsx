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
              icon={faCircle}
              text={article.text}
              url={`/article/${article.text}`}
              style={{ ...props.style, paddingRight: theme.spacing(4) }}
              {...props}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
}

function ArticlesLinkEntry({ articles, loading, ...props }) {
  if (loading || !articles) return <></>;

  return (
    <>
      {articles.categories.map(({ text, articles }) =>
        articles ? (
          <ExpandableListItem text={text} articles={articles} {...props} />
        ) : null
      )}
    </>
  );
}

function mapStateToProps(state) {
  return {
    articles: state.articlesInfo.information,
    loading: state.articlesInfo.loading
  };
}

export default connect(mapStateToProps)(ArticlesLinkEntry);
