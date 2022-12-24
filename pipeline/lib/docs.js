const { google } = require("googleapis");
const _ = require("underscore-contrib");
const fs = require("fs");
const path = require("path");
const https = require("https");

function maybeConvertToInteractive(element) {
  const youtube = (element.text || "").match(
    /https:\/\/www\.youtube\.com\/watch\?v=([\w-]+)/
  );
  if (youtube) {
    return {
      link: `https://www.youtube.com/embed/${youtube[1]}`,
      interactive: "youtube"
    };
  }
  return element;
}

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

function parseDocument(doc) {
  const { lists = {} } = doc;
  const paragraphs = doc.body.content.map(({ paragraph }) => {
    if (paragraph) {
      const {
        elements,
        paragraphStyle,
        bullet = {},
        positionedObjectIds
      } = paragraph;
      const listProperties =
        lists[bullet.listId]?.listProperties?.nestingLevels[0];

      return {
        type: paragraphStyle.namedStyleType,
        bullet: bullet.listId,
        bulletType: listProperties?.glyphSymbol
          ? "ul"
          : listProperties?.glyphType
          ? "ol"
          : undefined,
        elements: elements.map(
          ({
            textRun = { textStyle: {} },
            inlineObjectElement = { textStyle: {} },
            horizontalRule
          }) => {
            const {
              content,
              textStyle: { italic, underline, bold, link: textLink }
            } = textRun;
            const {
              inlineObjectId,
              textStyle: { link: imageLink }
            } = inlineObjectElement;

            return maybeConvertToInteractive({
              text: content,
              italic,
              underline,
              bold,
              link: textLink || imageLink,
              image: inlineObjectId,
              floatImages: positionedObjectIds,
              horizontalLine: !!horizontalRule
            });
          }
        )
      };
    }
    return null;
  });
  return paragraphs.filter((p) => p);
}

async function downloadEmbeddedImages(doc, folderPath) {
  const inlineImagesUris = doc.inlineObjects
    ? Object.entries(doc.inlineObjects).map(([objectId, props]) => ({
        id: objectId,
        uri: _.getPath(props, [
          "inlineObjectProperties",
          "embeddedObject",
          "imageProperties",
          "contentUri"
        ])
      }))
    : [];

  const positionedImageUris = doc.positionedObjects
    ? Object.entries(doc.positionedObjects).map(([objectId, props]) => ({
        id: objectId,
        uri: _.getPath(props, [
          "positionedObjectProperties",
          "embeddedObject",
          "imageProperties",
          "contentUri"
        ])
      }))
    : [];

  const imagesUris = [...inlineImagesUris, ...positionedImageUris];

  imagesUris.forEach(({ id, uri }) => {
    const filePath = path.join(folderPath, `${id}.jpg`);
    const dest = fs.createWriteStream(filePath);
    console.log(`Downloading Embedded Image:\n ${uri}`);
    https.get(uri, (response) => response.pipe(dest));
  });
}

module.exports = { getGoogleDoc, downloadEmbeddedImages, parseDocument };
