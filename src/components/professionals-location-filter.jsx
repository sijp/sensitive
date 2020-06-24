import React from "react";
import { connect } from "react-redux";

import { Map, TileLayer, Marker, Tooltip } from "react-leaflet";

import { actions } from "../ducks/professionals";

function DynamicMarker({ permanent, cityData, onclick }) {
  return (
    <Marker interactive={true} position={cityData.position} onclick={onclick}>
      {permanent && (
        <Tooltip interactive={true} permanent={true} direction="top">
          {cityData.label}
        </Tooltip>
      )}
    </Marker>
  );
}

function ProfessionalsMap({ setCity, cityList, city }) {
  return (
    <Map
      style={{ height: "100%", width: "100%", direction: "ltr" }}
      zoom={10}
      center={[32, 34.9]}
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
          permanent={cityId === city}
          onclick={() => console.log(cityId) || setCity(cityId)}
        />
      ))}
    </Map>
  );
}

function mapStateToProps(state) {
  return { cityList: state.cityList, city: state.city };
}

export default connect(mapStateToProps, { setCity: actions.setCity })(
  ProfessionalsMap
);
