import React, { useState } from "react";
import { connect } from "react-redux";

import { Map, TileLayer, Marker, Tooltip } from "react-leaflet";

import { actions } from "../ducks/professionals";

import { v4 as uuidv4 } from "uuid";

function DynamicMarker({ permanent, cityData, onclick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Marker
      interactive={true}
      position={cityData.position}
      onclick={onclick}
      onmouseover={() => setHovered(true)}
      onmouseout={() => setHovered(false)}
    >
      {(permanent || hovered) && (
        <Tooltip interactive={true} permanent={true} direction="top">
          {cityData.label}
        </Tooltip>
      )}
    </Marker>
  );
}

function ProfessionalsMap({ setCity, cityList, city, onChange }) {
  const [key] = useState(uuidv4());
  const [zoom, setZoom] = useState(8);
  return (
    <Map
      key={
        city ? `professional-map-set-${key}` : `professional-map-unset-${key}`
      }
      style={{
        height: "100%",
        width: "100%",
        direction: "ltr"
      }}
      zoom={zoom}
      center={city ? cityList[city].position : [32, 34.9]}
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
          permanent={cityId === city}
          onclick={() => {
            setCity(cityId);
            onChange(cityId);
          }}
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
