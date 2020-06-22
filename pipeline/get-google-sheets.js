const fs = require("fs");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");
require("dotenv").config();

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets.readonly",
  "https://www.googleapis.com/auth/drive.metadata.readonly"
];

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function start() {
  const auth = new GoogleAuth({
    keyFile: "./pipeline/secrets.json",
    scopes: SCOPES
  });
  listFiles(auth);
}

async function listFiles(auth) {
  const drive = google.drive({ version: "v3", auth });
  console.log(process.env.DATA_FOLDER_ID);
  try {
    const res = await drive.files.list({
      q: `'${process.env.DATA_FOLDER_ID}' in parents`,
      pageSize: 10,
      fields: "nextPageToken, files(id, name, parents)"
    });
    const files = res.data.files;
    console.log(files.length);
    if (files.length) {
      console.log("Files:");
      files.map((file) => {
        console.log(file);
        if (file.name === "professionals")
          professionalsToJson(auth, file.id, file.name);
        //if (file.name === "team") aboutToJson(auth, file.id, file.name);
      });
    } else {
      console.log("No files found.");
    }
  } catch (err) {
    return console.log("The API returned an error: " + err);
  }
}

function getSpreadSheet(auth, id) {
  return new Promise((resolve, reject) => {
    const sheets = google.sheets({ version: "v4", auth });
    sheets.spreadsheets.get(
      {
        spreadsheetId: id,
        includeGridData: true
      },
      (err, res) => {
        if (err) return reject("The API returned an error: " + err);
        console.log(res.data.sheets[0].data[0].rowData[1].values[2]);
        resolve(res.data.values);
      }
    );
  });
}

async function aboutToJson(auth, id, name) {
  try {
    const rows = await getSpreadSheet(auth, id, name);
    if (rows.length) {
      const columns = rows[0];
      const dataAsJson = rows.slice(1).map((row) =>
        columns.reduce(
          (memo, column, index) => ({
            ...memo,
            [column]: row[index]
          }),
          {}
        )
      );
      fs.writeFileSync(`./data/${name}.json`, JSON.stringify(dataAsJson));
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * Prints the title of a sample doc:
 * https://docs.google.com/document/d/195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth 2.0 client.
 */
function professionalsToJson(auth, id, name) {
  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: id,
      range: "A:ZZ"
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const rows = res.data.values;
      if (rows.length) {
        // Print columns A and E, which correspond to indices 0 and 4.
        const columns = rows[0];
        const indexOfCities = columns.indexOf("cities");
        const indexOfServices = columns.indexOf("services");
        const dataAsJson = rows.slice(1).map((row) => ({
          ...columns.slice(0, indexOfCities).reduce(
            (memo, column, index) => ({
              ...memo,
              [column]: row[index] === "TRUE" ? true : row[index] || undefined
            }),
            {}
          ),
          cities: row
            .slice(indexOfCities, indexOfServices)
            .map((value, index) =>
              value === "TRUE" ? columns[indexOfCities + index] : undefined
            )
            .filter((value) => value),
          services: row
            .slice(indexOfServices)
            .map((value, index) =>
              value === "TRUE" ? columns[indexOfServices + index] : undefined
            )
            .filter((value) => value)
        }));
        fs.writeFileSync(`./data/${name}.json`, JSON.stringify(dataAsJson));
      } else {
        console.log("No data found.");
      }
    }
  );
}

start();
