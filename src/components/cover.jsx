import React from "react";
import { Button, makeStyles, Card, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { ReactComponent as Logo } from "../logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchLocation } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    overflow: "hidden",
    backgroundColor: theme.palette.primary.light,
    backgroundImage: "url(/banner.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50% 70%",
    backgroundSize: "cover",

    display: "flex",
    flexDirection: "row-reverse",
    [theme.breakpoints.down("xs")]: {
      backgroundPosition: "30% 50%"
    }
  },
  cardContainer: {
    flexBasis: "50%",
    display: "flex",
    flexDirection: "row-reverse",
    [theme.breakpoints.down("xs")]: {
      flexBasis: "100%"
    }
  },

  card: {
    padding: theme.spacing(4),
    margin: theme.spacing(12),
    alignSelf: "center",
    backgroundColor: "#FFFFFFCC",

    [theme.breakpoints.down("xs")]: {
      margin: 0,
      alignSelf: "flex-start",
      borderRadius: 0,
      flexGrow: 1
    }
  },
  button: {
    fontSize: theme.typography.h5.fontSize,
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      fontSize: theme.typography.body1.fontSize
    }
  },
  text: {
    [theme.breakpoints.down("xs")]: {
      fontSize: theme.typography.h6.fontSize
    }
  },
  logo: {
    "& > svg": {
      width: 192,
      height: 192,
      margin: "0 auto",
      display: "block",
      [theme.breakpoints.down("xs")]: {
        width: 96,
        height: 96
      }
    },
    [theme.breakpoints.down("xs")]: {
      float: "left"
    }
  }
}));

function Cover() {
  const history = useHistory();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.cardContainer}>
        <Card className={classes.card}>
          <div className={classes.logo}>
            <Logo />
          </div>
          <Typography variant="h5" className={classes.text}>
            איגדנו עבור הקהילה מאגר שירותים העובדים לפי עקרונותינו
          </Typography>
          <br />
          <Button
            className={classes.button}
            onClick={() => history.push("/professionals")}
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faSearchLocation} />}
          >
            למאגר אנשי המקצוע
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default Cover;
