require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const _ = require("underscore-contrib");

const { authenticate } = require("./lib/authenticate");
const { mapDir, download } = require("./lib/drive");
const { processProfessionals, processTeam } = require("./lib/processing");
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
    await Promise.all(
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
      })
    );
  } catch (error) {
    console.log(error);
  }
}

async function getDocs() {
  await promisify(fs.mkdir)("./tmp/data/articles", { recursive: true });

  try {
    await Promise.all(
      await mapDir(auth, process.env.ARTICLES_FOLDER_ID, async (file) => {
        const doc = await getGoogleDoc(auth, file.id);

        const filePath = path.join("./tmp/data/articles", `${file.name}.json`);
        const paredDoc = parseDocument(doc);
        await Promise.all([
          promisify(fs.writeFile)(filePath, JSON.stringify(paredDoc)),
          downloadEmbeddedImages(doc, "./tmp/data/articles")
        ]);
        console.log(`Wrote ${filePath}`);
      })
    );
  } catch (error) {
    console.log(error);
  }
}

downloadImages();
getData();
getDocs();
