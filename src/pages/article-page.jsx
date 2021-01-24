import { Container, useTheme } from "@material-ui/core";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Article from "../components/article";

import { connect } from "react-redux";
import { actions } from "../ducks/title";

function ArticlePage({ articlesMapping, setTitle }) {
  const { name } = useParams();
  const theme = useTheme();
  const currentArticle = articlesMapping[name];
  const updateCurrentArticle = () => {
    setTitle(currentArticle?.text);
    return () => {
      setTitle(undefined);
    };
  };

  // eslint-disable-next-line
  useEffect(updateCurrentArticle, [currentArticle]);

  return (
    <Container
      style={{
        marginTop: theme.mixins.toolbar.minHeight,
        marginBottom: theme.spacing(24)
      }}
    >
      <Article name={name} />
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    articlesMapping: state.articlesInfo.information?.mapping || {}
  };
}

export default connect(mapStateToProps, {
  setTitle: actions.setTitle
})(ArticlePage);
