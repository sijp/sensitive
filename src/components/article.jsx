import React, { useState } from "react";
import { Typography } from "@material-ui/core";
import { useEffect } from "react";
import Axios from "axios";
import { ARTICLES_URL } from "../config/config";
import { Skeleton } from "@material-ui/lab";
import { connect } from "react-redux";

const PARAGRAPH_TYPES = {
  HEADING_1: (props) => (
    <Typography {...props} variant="h3" style={{ textAlign: "center" }} />
  ),
  HEADING_2: (props) => <Typography {...props} variant="h4" />,
  NORMAL_TEXT: (props) => (
    <Typography
      {...props}
      variant="body1"
      style={{ fontSize: "1.2em", marginTop: 2, marginBottom: 10 }}
    />
  )
};

const DEFAULT_PARAGRAPH_TYPE = PARAGRAPH_TYPES.NORMAL_TEXT;

function YoutubeEmbed({ link }) {
  return (
    <iframe
      title="Youtube"
      width="560"
      height="315"
      src={link}
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  );
}

export function defaultElementParser(
  { interactive, image, text, underline, bold, italic, link, paragraphIdx },
  elementIdx
) {
  if (interactive === "youtube") {
    return (
      <div style={{ textAlign: "center" }}>
        <YoutubeEmbed link={link} />
      </div>
    );
  }
  if (text) {
    return (
      <span
        key={`paragraph-${paragraphIdx}-${elementIdx}`}
        style={{
          fontWeight: bold ? "bold" : "normal",
          textDecoration: underline ? "underline" : "none",
          fontStyle: italic ? "italic" : "normal"
        }}
      >
        {link ? (
          <a href={link.url} rel="noopener noreferrer" target="_blank">
            {text}
          </a>
        ) : (
          text
        )}
      </span>
    );
  } else if (image) {
    const Linkify = link
      ? ({ children }) => (
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        )
      : ({ children }) => <>{children}</>;
    return (
      <div style={{ textAlign: "center" }}>
        <Linkify>
          <img
            style={{ width: "50%" }}
            src={`${ARTICLES_URL}/${image}.jpg`}
            alt="No Alt"
          />
        </Linkify>
      </div>
    );
  }
  return <></>;
}

export function ParsedDoc({ article, elementParser = defaultElementParser }) {
  return article.map((data, paragraphIdx) => {
    const Paragraph = PARAGRAPH_TYPES[data.type] || DEFAULT_PARAGRAPH_TYPE;
    const IdComponent = ({ children }) => <>{children}</>;

    const MaybeBullet = data.bullet
      ? ({ children }) => (
          <ul>
            <li>{children}</li>
          </ul>
        )
      : IdComponent;

    return (
      <Paragraph key={`paragraph-${paragraphIdx}`}>
        <MaybeBullet>
          {data.elements.map((element) =>
            elementParser({ paragraphIdx, ...element })
          )}
        </MaybeBullet>
      </Paragraph>
    );
  });
}

function ArticleSkeleton() {
  return (
    <>
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
    </>
  );
}

function Article({ name, articleNameMapping }) {
  const [article, setArticle] = useState(null);

  const id = articleNameMapping[name]?.id;

  const getArticle = () => {
    if (!id) return;
    Axios.get(`${ARTICLES_URL}/${id}.json`)
      .then((result) => setArticle(result.data))
      .catch((e) => {});
  };

  useEffect(getArticle, [id]);
  return article ? <ParsedDoc article={article} /> : <ArticleSkeleton />;
}

function mapStateToProps(state) {
  return {
    articleNameMapping: state.articlesInfo.information?.mapping || []
  };
}

export default connect(mapStateToProps)(Article);
