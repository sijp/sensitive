import PropTypes from "prop-types";
import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@material-ui/styles";

function TeamMember({ member, classes = {} }) {
  const theme = useTheme();
  const { card, media, content } = classes;
  return (
    <Card className={card}>
      {member.picture ? (
        <CardMedia className={media} image={member.picture} />
      ) : (
        <CardMedia className={media}>
          <div style={{ padding: 40, textAlign: "center" }}>
            <FontAwesomeIcon
              icon={faUser}
              style={{ width: "100%", height: "100%", opacity: 0.5 }}
              color={theme.palette.primary.main}
            />
          </div>
        </CardMedia>
      )}
      <CardContent className={content}>
        <Typography variant="h4">{member.name}</Typography>
        {member.description?.split("\n").map((paragraph, idx) => (
          <Typography variant="body2" key={`para-${idx}`}>
            {paragraph}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
}

TeamMember.propTypes = {
  classes: PropTypes.shape({
    card: PropTypes.string,
    media: PropTypes.string,
    content: PropTypes.string
  }),
  member: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string,
    picture: PropTypes.string
  })
};

export default TeamMember;
