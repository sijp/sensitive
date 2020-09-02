/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useState, useEffect } from "react";
import {
  Typography,
  List,
  ListItemText,
  Tooltip,
  Box,
  Chip
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneSquare,
  faGlobe,
  faAt,
  faBone,
  faStar
} from "@fortawesome/free-solid-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";

function FacebookSkeleton({ width, height, style, animation = false }) {
  return (
    <div style={{ height, ...style }}>
      <Skeleton
        variant="rect"
        width={width}
        height={height}
        animation={animation}
      />
      <Skeleton
        variant="rect"
        width={50}
        height={50}
        animation={animation}
        style={{
          marginTop: -50,
          position: "relative",
          top: -height + 60,
          left: -width + 60
        }}
      />
      <Skeleton
        variant="text"
        width={width - 80}
        animation={animation}
        style={{
          marginTop: -13,
          position: "relative",
          top: -height + 20,
          left: -10
        }}
      />
      <Skeleton
        variant="text"
        width={50}
        animation={animation}
        style={{
          marginTop: -23,
          position: "relative",
          top: -height + 40,
          left: -width + 120
        }}
      />
      <FontAwesomeIcon
        icon={faBone}
        width={50}
        height={50}
        fill="default"
        style={{
          color: "grey",
          width: 44,
          height: 44,
          marginTop: -50,
          position: "relative",
          top: -height + 31,
          left: -width + 57
        }}
      />
    </div>
  );
}

function ContactLink({ label, url, icon }) {
  return (
    <Chip
      icon={<FontAwesomeIcon icon={icon} />}
      label={label}
      variant="outlined"
      size="small"
      color="secondary"
      clickable={!!url}
      href={url}
      target="_blank"
      style={{ margin: "0 2px", paddingRight: 5 }}
      component="a"
    />
  );
}

function ProfessinoalsResultDetails({
  result,
  cardContentClass,
  cardHeaderClass,
  filterTypes,
  cityList,
  width = 250,
  bannerHeight = 70,
  showDetails
}) {
  const [facebookPageStyle, setFaceBookPageStyle] = useState({
    position: "absolute",
    top: 0,
    left: 0,
    visibility: "hidden"
  });
  const [
    { facebookSkeletonStyle, facebookSkeletonAnimation },
    setFaceBookSkeletonProps
  ] = useState({
    facebookSkeletonAnimation: result.facebookPage && "wave"
  });
  useEffect(() => {
    if (!result.facebookPage) return;

    setTimeout(() => {
      setFaceBookPageStyle({});
      setFaceBookSkeletonProps({
        facebookSkeletonStyle: { display: "none" },
        facebookSkeletonAnimation: false
      });
    }, 1000);
  }, [setFaceBookPageStyle, setFaceBookSkeletonProps, result]);
  return (
    <Box style={{ width }}>
      <iframe
        src={`https://www.facebook.com/plugins/page.php?${new URLSearchParams({
          href: encodeURI(result.facebookPage),
          width: width,
          height: bannerHeight,
          small_header: false,
          adapt_container_width: true,
          hide_cover: false,
          show_facepile: false
        })}`}
        width={`${width}`}
        height={`${bannerHeight}`}
        style={{ border: "none", overflow: "s", ...facebookPageStyle }}
        scrolling="no"
        frameBorder={0}
        allowtransparency="true"
        allow="encrypted-media"
      ></iframe>
      <FacebookSkeleton
        width={width}
        height={bannerHeight}
        style={facebookSkeletonStyle}
        animation={facebookSkeletonAnimation}
      />
      <Typography variant="h6" className={cardHeaderClass}>
        <b>
          {result.firstName} {result.lastName}
        </b>
      </Typography>
      <List className={cardContentClass}>
        <ListItemText>
          <Typography variant="body1">
            {showDetails
              ? result.description
              : `${result.description.substring(0, 80)}${
                  result.description.length > 80 ? "..." : ""
                }`}
          </Typography>
        </ListItemText>
        {showDetails && (
          <ListItemText>
            <Typography variant="body2">
              יצירת קשר:{" "}
              {result.phone && (
                <ContactLink
                  icon={faPhoneSquare}
                  label={result.phone}
                  url={`tel:${result.phone}`}
                />
              )}
              {result.facebookPage && (
                <ContactLink
                  icon={faFacebookF}
                  label="פייסבוק"
                  url={result.facebookPage}
                />
              )}
              {result.web && (
                <ContactLink
                  icon={faGlobe}
                  label="אתר אינטרנט"
                  url={result.web}
                />
              )}
              {result.email && (
                <ContactLink
                  icon={faAt}
                  label={result.email}
                  url={`mailto:${result.email}`}
                />
              )}
            </Typography>
          </ListItemText>
        )}
        <ListItemText>
          <Typography variant="body2">
            שירותים:{"  "}
            {result.services.map((service) => (
              <Tooltip
                key={`service-${result.id}-${service}-tooltip`}
                title={filterTypes[service]?.label || "NO TITLE"}
                arrow
                placement="top"
              >
                <span>
                  <FontAwesomeIcon
                    key={`service-${result.id}-${service}`}
                    icon={filterTypes[service]?.icon}
                    style={{ marginRight: 5 }}
                  />
                </span>
              </Tooltip>
            ))}
          </Typography>
        </ListItemText>
        {showDetails && (
          <ListItemText>
            <Typography variant="body2">
              איזורים: {"  "}
              {result.cities.map((city) => cityList[city]?.label).join(", ")}
            </Typography>
          </ListItemText>
        )}
      </List>
    </Box>
  );
}

export default ProfessinoalsResultDetails;
