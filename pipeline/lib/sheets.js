const { google } = require("googleapis");

async function getSpreadSheet(auth, id) {
  const sheets = google.sheets({ version: "v4", auth });
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: id,
      range: "A:ZZ"
    });

    return res.data.values;
  } catch (err) {
    throw `API Error ${err}`;
  }
}

module.exports = { getSpreadSheet };
