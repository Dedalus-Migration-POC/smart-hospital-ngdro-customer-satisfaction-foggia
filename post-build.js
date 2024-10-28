const fs = require("fs");
const pjson = require("./package.json");

const appTitle = pjson.description;
const appVersion = pjson.version;

let args = process.argv.slice(2);
let deployUrl = args[0];
deployUrl = deployUrl.endsWith("/") ? deployUrl.slice(0, -1) : deployUrl;

const environmentValue = "Dedalus Italia S.p.A.";
const indexHtmlFile = "./dist/index.html";

fs.readFile(indexHtmlFile, "utf8", function (err, indexHtmlFileData) {
  if (err) {
    console.log(err);
    return;
  }

  const result = `<!-- ${appTitle} v.`
    .concat(appVersion)
    .concat(" - ")
    .concat(new Date().toLocaleString())
    .concat(` - by ${environmentValue} -->\n`)
    .concat(indexHtmlFileData)
    .replace(/nomodule/g, 'nomodule="nomodule"')
    .replace(/TITLE_PLACEHOLDER/g, appTitle)
    .replace(/<META_DESCRIPTION_PLACEHOLDER>/g, appTitle)
    .replace(
      /<FAVICON_PLACEHOLDER>/g,
      deployUrl + "/assets/images/favicon.ico"
    );
  fs.writeFile(indexHtmlFile, result, "utf8", function (err) {
    if (err) return console.log(err);
  });
});
