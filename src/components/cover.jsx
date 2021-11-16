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
    [theme.breakpoints.down("sm")]: {
      backgroundPosition: "30% 50%"
    }
  },
  cardContainer: {
    flexBasis: 520,
    display: "flex",
    flexDirection: "row-reverse",
    [theme.breakpoints.down("sm")]: {
      flexBasis: "100%"
    }
  },

  card: {
    padding: theme.spacing(4),
    marginTop: theme.mixins.toolbar.minHeight,

    alignSelf: "flex-start",
    backgroundColor: "#FFFFFFCC",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,

    [theme.breakpoints.up("md")]: {
      marginRight: theme.spacing(8),

      minHeight: `calc(min(700px, 90vh) - ${
        theme.mixins.toolbar.minHeight * 2 + theme.spacing(8)
      }px )`,
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      "& > *": {
        flex: 1,
        flexBasis: "100%"
      }
    },
    [theme.breakpoints.down("sm")]: {
      margin: 0,
      borderRadius: 0,
      flexGrow: 1
    }
  },
  button: {
    fontSize: theme.typography.h5.fontSize,
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      fontSize: theme.typography.body1.fontSize,
      width: "auto",
      marginRight: "auto",
      marginLeft: "auto"
    }
  },
  buttonContainer: {
    textAlign: "center",
    paddingTop: theme.spacing(2)
  },
  text: {
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      fontSize: theme.typography.h6.fontSize
    }
  },
  logo: {
    "& > svg": {
      width: 256,
      height: 256,
      margin: "0 auto",
      display: "block",
      [theme.breakpoints.down("sm")]: {
        width: 128,
        height: 128
      }
    },
    [theme.breakpoints.down("sm")]: {
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
          <div className={classes.buttonContainer}>
            <Button
              className={classes.button}
              onClick={() => history.push("/professionals")}
              variant="contained"
              color="primary"
              startIcon={<FontAwesomeIcon icon={faSearchLocation} />}
            >
              למאגר אנשי המקצוע
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Cover;
