require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const _ = require("underscore-contrib");

const { authenticate } = require("./lib/authenticate");
const { mapDir, download } = require("./lib/drive");
const {
  processProfessionals,
  processTeam,
  processDocs
} = require("./lib/processing");
const { getSpreadSheet } = require("./lib/sheets");
const {
  getGoogleDoc,
  parseDocument,
  downloadEmbeddedImages
} = require("./lib/docs");

const auth = authenticate();

async function downloadImages() {
  await promisify(fs.mkdir)("./tmp/data/images", { recursive: true });
  try {
    await Promise.all(
      await mapDir(auth, process.env.IMAGES_FOLDER_ID, (file) => {
        const filePath = path.join("./tmp/data/images", file.name);
        return download(auth, file.id, filePath);
        //console.log(file);
      })
    );
  } catch (error) {
    console.log(error);
  }
}

function monthlySort(jsonData) {
  const sets = Object.values(_.groupBy(jsonData, (v) => parseInt(v.id) % 12));

  let count = new Date().getMonth();
  const next = () => {
    const value = sets[count];
    count++;
    if (count > 11) count = 0;
    return value;
  };

  const sortedSets = sets.map(next);
  return _.flatten(sortedSets);
}

async function getData() {
  await promisify(fs.mkdir)("./tmp/data", { recursive: true });
  try {
    await mapDir(auth, process.env.DATA_FOLDER_ID, async (file) => {
      const filePath = path.join("./tmp/data", `${file.name}.json`);
      const data = await getSpreadSheet(auth, file.id);
      const jsonData =
        file.name === "professionals"
          ? monthlySort(processProfessionals(data))
          : file.name === "team"
          ? processTeam(data)
          : null;
      if (jsonData) {
        await promisify(fs.writeFile)(filePath, JSON.stringify(jsonData));
        console.log(`Wrote ${filePath}`);
        return jsonData;
      }
      return null;
    });
  } catch (error) {
    console.log(error);
  }
}

async function getDocs() {
  let counter = 0;
  const writeFile = promisify(fs.writeFile);
  await promisify(fs.mkdir)("./tmp/data/articles", { recursive: true });

  const recGetDocs = async (folderId) => {
    return await mapDir(auth, folderId, async (file) => {
      switch (file.mimeType) {
        case "application/vnd.google-apps.folder":
          return { folder: file, docs: await recGetDocs(file.id) };
        case "application/vnd.google-apps.document":
          counter++;
          const internalId = file.description || counter;
          const doc = await getGoogleDoc(auth, file.id);
          const filePath = path.join(
            "./tmp/data/articles",
            `${internalId}.json`
          );
          const parsedDoc = parseDocument(doc);
          await Promise.all([
            writeFile(filePath, JSON.stringify(parsedDoc)),
            downloadEmbeddedImages(doc, "./tmp/data/articles")
          ]);
          console.log(`Wrote ${filePath}`);
          return { ...file, internalId };
        default:
          return file;
      }
    });
  };

  try {
    const docs = await recGetDocs(process.env.ARTICLES_FOLDER_ID);
    const filePath = "./tmp/data/articles-info.json";
    writeFile(filePath, JSON.stringify(processDocs(docs)));
    console.log(`wrote ${filePath}`);
  } catch (error) {
    console.log(error);
  }
}

downloadImages();
getData();
getDocs();
