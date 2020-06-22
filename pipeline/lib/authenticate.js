const { GoogleAuth } = require("google-auth-library");

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets.readonly",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.appdata",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.metadata",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.photos.readonly",
  "https://www.googleapis.com/auth/drive.readonly"
];

function authenticate() {
  return new GoogleAuth({
    keyFile: "./pipeline/secrets.json",
    scopes: SCOPES
  });
}

module.exports = { authenticate };
