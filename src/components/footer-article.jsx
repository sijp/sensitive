import { Container, useTheme } from "@material-ui/core";

import React from "react";

import Article from "./article";

export default function FooterArticle() {
  const theme = useTheme();
  return (
    <div
      style={{
        background: theme.palette.primary.dark,
        display: "inline-block",
        width: "100%",
        fontSize: "0.8em",
        color: theme.palette.grey[900],
        padding: theme.spacing(2)
      }}
    >
      <Container maxWidth="lg">
        <Article name={process.env.REACT_APP_FOOTER_PAGE_ID} />
      </Container>
    </div>
  );
}
