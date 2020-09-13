const { google } = require("googleapis");
const fs = require("fs");

async function mapDir(auth, id, callback) {
  const drive = google.drive({ version: "v3", auth });
  try {
    const res = await drive.files.list({
      q: `'${id}' in parents`,
      pageSize: 10,
      fields: "nextPageToken, files(id, name, parents)"
    });
    const files = res.data.files;

    if (files.length) {
      return files.map(callback);
    } else {
      console.log(`Bad or empty directory ${id}`);
      return [];
    }
  } catch (error) {
    throw new Error(`API Error ${error}`);
  }
}

async function download(auth, id, filePath) {
  const drive = google.drive({ version: "v3", auth });

  const result = await drive.files.get(
    { fileId: id, alt: "media" },
    { responseType: "stream" }
  );
  const dest = fs.createWriteStream(filePath);

  return new Promise((res, rej) => {
    result.data
      .on("end", () => {
        console.log(`Downloaded ${id} to ${filePath}`);
        res(true);
      })
      .on("error", (error) => {
        rej(error);
      })
      .pipe(dest);
  });
}

module.exports = {
  mapDir,
  download
};
