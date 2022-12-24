import React, { useState } from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { useEffect } from "react";
import Axios from "axios";
import { ARTICLES_URL } from "../config/config";
import { Skeleton } from "@material-ui/lab";
import { connect } from "react-redux";

const PARAGRAPH_TYPES = {
  HEADING_1: (props) => (
    <Typography
      {...props}
      variant="h2"
      style={{ ...props.style, textAlign: "center", clear: "both" }}
    />
  ),
  HEADING_2: (props) => (
    <Typography
      {...props}
      variant="h4"
      style={{ ...props.style, clear: "both" }}
    />
  ),
  HEADING_3: (props) => (
    <Typography
      {...props}
      variant="h5"
      style={{ ...props.style, clear: "both" }}
    />
  ),
  NORMAL_TEXT: (props) => (
    <Typography
      {...props}
      variant="body1"
      component="div"
      style={{
        ...props.style,
        fontSize: "1.2em",
        marginTop: 2,
        marginBottom: 10
      }}
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

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    marginLeft: "-50vw",
    marginRight: "-50vw",
    maxWidth: "100vw",
    position: "relative",
    width: "100vw",
    right: "50%",
    left: "50%"
  },
  header: {
    marginTop: theme.mixins.toolbar.minHeight
  }
}));

export function defaultElementParser(
  {
    interactive,
    image,
    floatImages,
    horizontalLine,
    text,
    underline,
    bold,
    italic,
    link,
    paragraphIdx
  },
  elementIdx,
  styles
) {
  if (interactive === "youtube") {
    return (
      <div
        style={{ textAlign: "center" }}
        key={`paragraph-${paragraphIdx}-${elementIdx}`}
      >
        <YoutubeEmbed link={link} />
      </div>
    );
  }
  if (horizontalLine) {
    return (
      <hr
        style={{
          height: 1,
          border: 0,
          borderTop: "1px solid #ccc",
          margin: "1em 0"
        }}
      />
    );
  } else if (text) {
    return (
      <span
        key={`paragraph-${paragraphIdx}-${elementIdx}`}
        style={{
          fontWeight: bold ? "bold" : "normal",
          textDecoration: underline ? "underline" : "none",
          fontStyle: italic ? "italic" : "normal"
        }}
      >
        {floatImages
          ? floatImages.map((image) => (
              <div style={{ float: "right", margin: 16 }}>
                <img src={`${ARTICLES_URL}/${image}.jpg`} alt="No Alt" />
              </div>
            ))
          : null}
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
      <div>
        <Linkify>
          <img
            className={styles.fullWidth}
            src={`${ARTICLES_URL}/${image}.jpg`}
            alt="No Alt"
          />
        </Linkify>
      </div>
    );
  }
  return <></>;
}

function ListParagraph({ bulletType, ...restProps }) {
  const ListElement =
    bulletType === "ol"
      ? (props) => <ol {...props} />
      : (props) => <ul {...props} />;

  return <ListElement {...restProps} />;
}

export function ParsedDoc({ article, elementParser = defaultElementParser }) {
  const styles = useStyles();
  const sections = article.reduce(
    (memo, data, idx) => {
      const { bullet } = data;
      const { map, list } = memo;
      if (!bullet) {
        map[idx] = { data };
        list.push(map[idx]);
      } else if (map[bullet]) {
        map[bullet].bullets.push(data);
      } else {
        map[bullet] = { bullets: [data] };
        list.push(map[bullet]);
      }
      return memo;
    },
    { map: {}, list: [] }
  );

  return sections.list.map(({ data, bullets }, paragraphIdx) => {
    if (data) {
      const Paragraph = PARAGRAPH_TYPES[data?.type] || DEFAULT_PARAGRAPH_TYPE;
      return (
        <Paragraph key={`paragraph-${paragraphIdx}`} className={styles.header}>
          {data.elements.map((element, elementIdx) =>
            elementParser({ paragraphIdx, ...element }, elementIdx, styles)
          )}
        </Paragraph>
      );
    }
    if (bullets) {
      return (
        <ListParagraph
          key={`paragraph-${paragraphIdx}`}
          bulletType={bullets[0]?.bulletType}
        >
          {bullets.map((bullet, bulletIdx) => (
            <li
              key={`list-paragraph-${paragraphIdx}-${bullet.bullet}-${bulletIdx}`}
            >
              <DEFAULT_PARAGRAPH_TYPE>
                {bullet.elements.map((element, elementIdx) =>
                  elementParser(
                    {
                      paragraphIdx: `list-paragraph-${element.bullet}-${bulletIdx}`,
                      ...element
                    },
                    elementIdx
                  )
                )}
              </DEFAULT_PARAGRAPH_TYPE>
            </li>
          ))}
        </ListParagraph>
      );
    }
    return <></>;
    // const Paragraph = PARAGRAPH_TYPES[data?.type] || DEFAULT_PARAGRAPH_TYPE;
    // const Section = bullets
    //   ? (props) => (
    //       <ListParagraph {...props} bulletType={bullets[0]?.bulletType} />
    //     )
    //   : Paragraph;

    // return (
    //   <Section key={`paragraph-${paragraphIdx}`}>
    //     {(data.elements).map((element) =>
    //       elementParser({ paragraphIdx, ...element })
    //     )}
    //   </Section>
    // );
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
