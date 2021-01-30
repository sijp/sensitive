import fs from "fs";
import path from "path";
import { promisify } from "util";
import React from "react";
import ReactDOMServer from "react-dom/server";

import { WEBSITE_TITLE } from "../src/config/config";
import { ParsedDoc } from "../src/components/article";

const indexFile = path.resolve("./build/index.html");
const articlesInfoFile = path.resolve("./tmp/data/articles-info.json");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

(async () => {
  try {
    const data = await readFile(indexFile, "utf-8");
    const articleInfo = JSON.parse(await readFile(articlesInfoFile, "utf-8"));
    const urls = [];

    const replaceTitle = (data, newTitle) =>
      data.replace(/\*TITLE\*/g, newTitle);
    const replaceContent = (data, newContent) =>
      data.replace(/\*CONTENT\*/g, newContent);
    const replaceUrlPath = (data, newUrlPath) =>
      data.replace(/\*URL_PATH\*/, newUrlPath);

    await writeFile(
      indexFile,
      replaceUrlPath(replaceContent(replaceTitle(data, WEBSITE_TITLE), ""), "")
    );

    await Promise.all(
      Object.entries(articleInfo.mapping).map(async ([key, value]) => {
        console.log(`Generating ${key}`, value.id);
        const newPath = path.resolve(`./build/article/${key}`);
        await mkdir(newPath, {
          recursive: true
        });
        const json = await readFile(
          path.resolve(`./tmp/data/articles/${value.id}.json`),
          "utf-8"
        );

        urls.push(`http://www.sensitive-dogs.co.il/article/${key}`);

        await writeFile(
          path.resolve(`${newPath}/index.html`),
          replaceUrlPath(
            replaceContent(
              replaceTitle(data, `${value.text} - ${WEBSITE_TITLE}`),
              ReactDOMServer.renderToString(
                <ParsedDoc article={JSON.parse(json)} />
              )
            ),
            `/article/${key}`
          )
        );
      })
    );
    console.log("rendered all articles");
    await writeFile(
      path.resolve("./build/sitemap.xml"),
      '<?xml version="1.0" encoding="UTF-8"?>' +
        ReactDOMServer.renderToString(
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            {urls.map((url) => (
              <url>
                <loc>{url}</loc>
              </url>
            ))}
          </urlset>
        )
    );
    console.log("generated sitemap.xml");
  } catch (err) {
    console.log(
      err,
      "you need to run `npm run build` and `npm run sync-data` first"
    );
  }
})();
