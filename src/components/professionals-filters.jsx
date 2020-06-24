import React from "react";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import { Chip } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { actions } from "../ducks/professionals";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
  chip: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(1.2),
    marginRight: theme.spacing(1)
  },
  iconBg: {
    color: theme.palette.grey[50]
  },
  iconBgEnabled: {
    color: theme.palette.secondary.light
  }
}));

function FancyIcon({ bgClassName, ...props }) {
  console.log(props);
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
  removeFilter
}) {
  const classes = useStyles();
  return (
    <div style={style}>
      {Object.entries(filterTypes).map(([filterType, filterData]) => (
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
          onClick={() =>
            filters[filterType]
              ? removeFilter(filterType)
              : addFilter(filterType)
          }
        ></Chip>
      ))}
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
