import React from "react";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import { Chip, Typography, Badge, Avatar } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { actions } from "../ducks/professionals";
import { faCircle, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(3)
  },
  chip: {
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  iconBg: {
    color: theme.palette.grey[50]
  },
  iconBgEnabled: {
    color: theme.palette.secondary.light
  },
  chipShowMore: {
    flip: false,
    direction: "ltr",
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  HiddenFiltersIcon: {
    backgroundColor: `${theme.palette.primary.dark} !important`,
    fontSize: "1.1em !important"
  }
}));

function FancyIcon({ bgClassName, ...props }) {
  return (
    <span className="fa-layers">
      <FontAwesomeIcon
        icon={faCircle}
        className={bgClassName}
        transform="grow-14"
      />
      <FontAwesomeIcon {...props} />
    </span>
  );
}

function ProfessionalFilters({
  filterTypes,
  style,
  filters,
  addFilter,
  removeFilter,
  onChange
}) {
  const classes = useStyles();
  const defaultLimit = 3;
  const [limitFilters, setLimitFilters] = useState(defaultLimit);

  const filtersEntries = Object.entries(filterTypes);
  const filtersToShow = limitFilters
    ? filtersEntries.slice(0, limitFilters)
    : filtersEntries;
  const numberOfHiddenEnabledFilters = !limitFilters
    ? 0
    : filtersEntries
        .slice(limitFilters)
        .filter(([filterType]) => filters[filterType]).length;

  return (
    <div style={style} className={classes.root}>
      <Typography variant="body1" color="secondary" component="span">
        סינון לפי סוג שירות:
        <br />
      </Typography>
      {filtersToShow.map(([filterType, filterData]) => (
        <Chip
          className={classes.chip}
          icon={
            <FancyIcon
              icon={filterData.icon}
              bgClassName={
                filters[filterType] ? classes.iconBgEnabled : classes.iconBg
              }
            />
          }
          color={filters[filterType] ? "primary" : "default"}
          key={filterType}
          label={filterData.label}
          onClick={() => {
            filters[filterType]
              ? removeFilter(filterType)
              : addFilter(filterType);
            onChange(filterType, !filters[filterType]);
          }}
        ></Chip>
      ))}
      <Chip
        className={classes.chipShowMore}
        color="secondary"
        label={limitFilters ? "עוד" : "פחות"}
        classes={{ avatar: classes.HiddenFiltersIcon }}
        avatar={
          numberOfHiddenEnabledFilters ? (
            <Avatar color="primary">{numberOfHiddenEnabledFilters}</Avatar>
          ) : null
        }
        deleteIcon={<FontAwesomeIcon icon={limitFilters ? faPlus : faMinus} />}
        onClick={() => {
          setLimitFilters(limitFilters ? undefined : defaultLimit);
        }}
        onDelete={() => {
          setLimitFilters(limitFilters ? undefined : defaultLimit);
        }}
      ></Chip>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    filterTypes: state.filterTypes,
    filters: state.activeFilters
  };
}

export default connect(mapStateToProps, {
  addFilter: actions.addFilter,
  removeFilter: actions.removeFilter
})(ProfessionalFilters);
