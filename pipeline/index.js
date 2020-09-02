require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const _ = require("underscore-contrib");

const { authenticate } = require("./lib/authenticate");
const { mapDir, download } = require("./lib/drive");
const { processProfessionals, processTeam } = require("./lib/processing");
const { getSpreadSheet } = require("./lib/sheets");
const { getGoogleDoc, docToMarkDown } = require("./lib/docs");

const auth = authenticate();

async function downloadImages() {
  await promisify(fs.mkdir)("./tmp/images", { recursive: true });
  try {
    await Promise.all(
      await mapDir(auth, process.env.IMAGES_FOLDER_ID, (file) => {
        const filePath = path.join("./tmp/images", file.name);
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
  try {
    const doc = await getGoogleDoc(
      auth,
      "1AjOP0huDj7jf0yR0Mx_wSen65J8ZCcifpXcHJd2p32k"
    );
    console.log(docToMarkDown(doc));

    // console.log(
    //   doc.inlineObjects["kix.chvxfcs206hg"].inlineObjectProperties
    //     .embeddedObject.imageProperties.contentUri
    // );
  } catch (error) {
    console.log(error);
  }
}

downloadImages();
getData();
//getDocs();
