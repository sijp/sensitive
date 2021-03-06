import React, { useState } from "react";
import { connect } from "react-redux";

import { Map, TileLayer, Polygon, Tooltip } from "react-leaflet";

import { professionalActions as actions } from "../store";

import { v4 as uuidv4 } from "uuid";

import {
  makeStyles,
  InputLabel,
  FormControl,
  Grid,
  NativeSelect
} from "@material-ui/core";
import ProfessionalsRemoteSwitch from "./professionals-remote-switch";

const useStyles = makeStyles((theme) => ({
  verticalGrid: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    "& > *": {
      flex: 1
    }
  },
  mapGridCell: {
    flex: 10
  },
  switchLabel: {
    color: theme.palette.secondary.dark,
    paddingLeft: theme.spacing(1)
  }
}));

function getCenter(coordinates) {
  const Xs = coordinates.map(([x, _]) => x);
  const Ys = coordinates.map(([_, y]) => y);

  return [
    Xs.reduce((sum, x) => sum + x, 0) / coordinates.length,
    Ys.reduce((sum, y) => sum + y) / coordinates.length
  ];
}

function DynamicMarker({ permanent, selected = false, cityData, onclick }) {
  return (
    <Polygon
      interactive={true}
      positions={cityData.coordinates.map(([long, lat]) => [lat, long])}
      // pathOptions={{ color: cityData.lineColor, fillColor: cityData.fillColor }}
      color={cityData.lineColor || "blue"}
      fillColor={cityData.fillColor || "blue"}
      onclick={onclick}
    >
      {selected || permanent ? (
        <Tooltip
          direction="top"
          permanent={true}
          offset={[0, -15]}
          key="permenant"
        >
          {cityData.label}
        </Tooltip>
      ) : (
        <Tooltip direction="top" sticky={true} offset={[0, -15]} key="sticky">
          {cityData.label}
        </Tooltip>
      )}
    </Polygon>
  );
}

function LocationSelect({ cityList, city, className, variant, onChange }) {
  const cityListSorted = Object.entries(cityList).sort(
    ([_aCityId, aCityData], [_bCityId, bCityData]) =>
      aCityData.label > bCityData.label
  );
  return (
    <FormControl className={className} style={{ width: "100%" }}>
      <InputLabel
        color="secondary"
        htmlFor="city-list-select"
        style={{ paddingRight: 10 }}
      >
        סינון לפי איזור
      </InputLabel>
      <NativeSelect
        variant={variant}
        inputProps={{ name: "city-list-select", id: "city-list-select" }}
        value={city || ""}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      >
        <option aria-label="None" value="" />
        {cityListSorted.map(([cityId, cityData]) => (
          <option value={cityId} key={`city-option-${cityId}`}>
            {cityData.label}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  );
}

function ProfessionalsMap({
  setCity,
  cityList,
  city,
  showMap,
  showRemoteToggle,
  onChange,
  isMobile = false
}) {
  const [key] = useState(uuidv4());
  const [zoom, setZoom] = useState(10);
  const classes = useStyles();

  const changeHandler = (city) => {
    if (typeof onChange === "function") {
      onChange(city);
    }
    setCity(city);
  };

  return (
    <div style={{ height: "100%" }} className={classes.verticalGrid}>
      <div>
        <Grid container>
          {showRemoteToggle && (
            <Grid
              item
              xs={showMap ? 4 : 12}
              style={{
                textAlign: city ? undefined : "center",
                paddingBottom: city ? undefined : 16
              }}
            >
              <ProfessionalsRemoteSwitch className={classes.switchLabel} />
            </Grid>
          )}
          <Grid item xs={showRemoteToggle ? 8 : 12}>
            <LocationSelect
              onChange={changeHandler}
              city={city}
              cityList={cityList}
              variant={showMap ? "standard" : "outlined"}
            />
          </Grid>
        </Grid>
      </div>
      {showMap && (
        <div className={classes.mapGridCell}>
          <Map
            key={`professional-map-${key}`}
            style={{
              height: "100%",
              width: "100%",
              direction: "ltr"
            }}
            zoom={zoom}
            center={
              city
                ? getCenter(cityList[city]?.coordinates).reverse()
                : [32, 34.9]
            }
            onzoomend={(event) => setZoom(event.target.getZoom())}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {Object.entries(cityList).map(([cityId, cityData]) => (
              <DynamicMarker
                key={`city-marker-${cityId}`}
                selectedCity={city}
                cityId={cityId}
                cityData={cityData}
                permanent={isMobile}
                selected={city === cityId}
                onclick={() => changeHandler(cityId)}
              />
            ))}
          </Map>
        </div>
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    cityList: state.professionals.cityList,
    city: state.professionals.city
  };
}

export default connect(mapStateToProps, {
  setCity: actions.setCity,
  setShowRemote: actions.setShowRemote
})(ProfessionalsMap);
