import PropTypes from "prop-types";
import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";

function TeamMember({ member, classes = {} }) {
  const { card, media, content } = classes;
  return (
    <Card className={card}>
      <CardMedia className={media} image={member.picture} />
      <CardContent className={content}>
        <Typography variant="h4">{member.name}</Typography>
        {member.description.split("\n").map((paragraph, idx) => (
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
