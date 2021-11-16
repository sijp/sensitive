import React from "react";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import { Chip, Typography, Badge } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { professionalActions as actions } from "../store";
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
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,

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
  moreChips = []
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
        .filter(([filterType]) => filters.includes(filterType)).length;

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
                filters.includes(filterType)
                  ? classes.iconBgEnabled
                  : classes.iconBg
              }
            />
          }
          color={filters.includes(filterType) ? "primary" : "default"}
          key={filterType}
          label={filterData.label}
          onClick={() => {
            filters.includes(filterType)
              ? removeFilter(filterType)
              : addFilter(filterType);
          }}
        ></Chip>
      ))}
      <Badge badgeContent={numberOfHiddenEnabledFilters} color="primary">
        <Chip
          className={classes.chipShowMore}
          color="secondary"
          label={limitFilters ? "עוד" : "פחות"}
          classes={{ avatar: classes.HiddenFiltersIcon }}
          icon={<FontAwesomeIcon icon={limitFilters ? faPlus : faMinus} />}
          onClick={() => {
            setLimitFilters(limitFilters ? undefined : defaultLimit);
          }}
        ></Chip>
      </Badge>

      {moreChips.map(({ className, ...chipProps }, index) => (
        <Chip
          key={index}
          {...chipProps}
          className={`${classes.chip} ${className}`}
        />
      ))}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    filterTypes: state.professionals.filterTypes,
    filters: state.professionals.activeFilters
  };
}

export default connect(mapStateToProps, {
  addFilter: actions.addFilter,
  removeFilter: actions.removeFilter
})(ProfessionalFilters);
