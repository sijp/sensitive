require("dotenv").config();
const fs = require("fs");
const path = require("path");

const { authenticate } = require("./lib/authenticate");
const { mapDir, download } = require("./lib/drive");
const { processProfessionals, processTeam } = require("./lib/processing");
const { getSpreadSheet } = require("./lib/sheets");
const { promisify } = require("util");

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

async function getData() {
  await promisify(fs.mkdir)("./tmp/data", { recursive: true });
  try {
    await Promise.all(
      await mapDir(auth, process.env.DATA_FOLDER_ID, async (file) => {
        const filePath = path.join("./tmp/data", `${file.name}.json`);
        const data = await getSpreadSheet(auth, file.id);
        const jsonData =
          file.name === "professionals"
            ? processProfessionals(data)
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

downloadImages();
getData();
