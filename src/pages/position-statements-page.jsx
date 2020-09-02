import React from "react";
import { Container, Typography, useTheme, Card } from "@material-ui/core";

function PositionStatementsPage() {
  const theme = useTheme();
  return (
    <Container
      maxWidth="xl"
      style={{
        textAlign: "center",
        backgroundColor: theme.palette.primary.light,
        padding: theme.spacing(4)
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h5">
          האינפוגרפיקה הבאה מתארת את עקרונות הבסיס של גישתנו
        </Typography>
        <br />
        <Card
          style={{
            marginRight: "auto",
            marginLeft: "auto"
          }}
        >
          <a href="principles.jpg" target="_blank">
            <img
              src="/principles.jpg"
              alt="עקרונות הקבוצה"
              style={{ width: "100%", display: "block" }}
            />
          </a>
        </Card>
      </Container>
    </Container>
  );
}

export default PositionStatementsPage;
