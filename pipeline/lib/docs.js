const { google } = require("googleapis");
const _ = require("underscore-contrib");
const fs = require("fs");
const path = require("path");
const https = require("https");

async function getGoogleDoc(auth, id) {
  const docs = google.docs({ version: "v1", auth });
  try {
    const res = await docs.documents.get({
      documentId: id
    });
    return res.data;
  } catch (err) {
    throw new Error(`API Error ${err}`);
  }
}

function docToMarkDown(doc) {
  const paragraphs = doc.body.content.map(({ paragraph }) => {
    if (paragraph) {
      const { elements } = paragraph;
      const text = elements
        .map(({ textRun = {} }) => textRun.content)
        .filter((text) => text)
        .join(" ");
      const images = elements
        .map(
          ({ inlineObjectElement = {} }) => inlineObjectElement.inlineObjectId
        )
        .filter((img) => img);
      return { text, images };
    }
    return { text: "", images: [] };
  });
  return paragraphs
    .map(({ text, images }) => {
      return `${text}\n ${images}`;
    })
    .join("\n\n");
}

async function downloadImages(doc, folderPath) {
  const imagesUris = Object.entries(doc.inlineObjects).map(
    ([objectId, props]) => ({
      id: objectId,
      uri: _.getPath(props, ["embeddedObject", "imageProperties", "contentUri"])
    })
  );

  imagesUris.forEach(({ id, uri }) => {
    const filePath = path.join(folderPath, "docs", `${id}.jpg`);
    const dest = fs.createWriteStream(filePath);
    https.get(uri, (response) => response.pipe(dest));
  });
}

module.exports = { getGoogleDoc, downloadImages, docToMarkDown };
