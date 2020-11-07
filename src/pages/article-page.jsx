import { Container, useTheme } from "@material-ui/core";
import React from "react";
import { useParams } from "react-router-dom";
import Article from "../components/article";

function ArticlePage() {
  const { name } = useParams();
  const theme = useTheme();
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

export default ArticlePage;
