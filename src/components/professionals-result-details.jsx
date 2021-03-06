/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useState, useEffect } from "react";
import {
  Typography,
  List,
  ListItemText,
  Tooltip,
  Box,
  Button
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneSquare,
  faGlobe,
  faAt,
  faBone
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faWhatsapp
} from "@fortawesome/free-brands-svg-icons";

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

function ContactLink({ label, url, icon, style, iconStyle }) {
  return (
    <Button
      startIcon={<FontAwesomeIcon icon={icon} style={iconStyle} />}
      color="primary"
      variant="contained"
      disabled={!url}
      href={url}
      target="_blank"
      style={{ margin: 2, ...style }}
      component="a"
    >
      {label}
    </Button>
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

    const timeout = setTimeout(() => {
      setFaceBookPageStyle({});
      setFaceBookSkeletonProps({
        facebookSkeletonStyle: { display: "none" },
        facebookSkeletonAnimation: false
      });
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
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
          <Typography
            variant="body1"
            style={{
              whiteSpace: "pre-line",
              maxHeight: 300,
              overflowY: "auto"
            }}
          >
            {showDetails
              ? result.description
              : `${result.description.substring(0, 80)}${
                  result.description.length > 80 ? "..." : ""
                }`}
          </Typography>
        </ListItemText>
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
        {showDetails && (
          <ListItemText>
            {result.phone && result.phone.startsWith("05") && (
              <ContactLink
                icon={faWhatsapp}
                label="ווצאפ"
                style={{
                  backgroundColor: "#25D366",
                  color: "black"
                }}
                iconStyle={{ color: "white" }}
                url={`https://wa.me/972${result.phone
                  .substring(1)
                  .replace(/\D/gi, "")}?text=${encodeURI(
                  "היי, ראיתי את הכרטיס שלך באינדקס הרגישים ואשמח ליצור עמך קשר :)"
                )}`}
              />
            )}
            {result.facebookPage && (
              <ContactLink
                icon={faFacebookF}
                label="פייסבוק"
                style={{ backgroundColor: "#4267B2", color: "white" }}
                url={result.facebookPage}
              />
            )}
            {result.instagram && (
              <ContactLink
                icon={faInstagram}
                label="אינסטגרם"
                style={{ backgroundColor: "#405DE6", color: "white" }}
                url={result.web}
              />
            )}
            {result.phone && (
              <>
                <ContactLink
                  icon={faPhoneSquare}
                  label={result.phone}
                  url={`tel:${result.phone}`}
                />
              </>
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
          </ListItemText>
        )}
      </List>
    </Box>
  );
}

export default ProfessinoalsResultDetails;
