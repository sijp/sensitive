import React, { useState, useEffect } from "react";
import TeamList from "../components/team-list";
import Axios from "axios";
import { ARTICLES_URL } from "../config/config";
import { connect } from "react-redux";
import { ParsedDoc, defaultElementParser } from "../components/article";

function HomeArticle({ articleNameMapping }) {
  const [article, setArticle] = useState(null);

  const id = articleNameMapping[process.env.REACT_APP_ABOUT_PAGE_ID]?.id;

  const getArticle = () => {
    if (!id) return;
    Axios.get(`${ARTICLES_URL}/${id}.json`)
      .then((result) => setArticle(result.data))
      .catch((e) => {});
  };

  const homePageElementParser = (element) => {
    const text = element.text.slice(0, 5);
    switch (text) {
      case "**1**":
        return <TeamList type="admins" />;
      case "**2**":
        return <TeamList type="moderators" />;
      default:
        return defaultElementParser(element);
    }
  };

  useEffect(getArticle, [id]);

  return (
    article && (
      <ParsedDoc article={article} elementParser={homePageElementParser} />
    )
  );
}

function mapStateToProps(state) {
  return {
    articleNameMapping: state.articlesInfo.information?.mapping || []
  };
}

export default connect(mapStateToProps)(HomeArticle);
