import React from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";

function MetaTagsUpdater({ title }) {
  return (
    <MetaTags>
      <title>{title}</title>
      <meta property="og:title" content={title} />
    </MetaTags>
  );
}

function mapStateToProps({ title: { title, defaultTitle } }) {
  return {
    title: defaultTitle + (title ? ` - ${title}` : "")
  };
}

export default connect(mapStateToProps)(MetaTagsUpdater);
