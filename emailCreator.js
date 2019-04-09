var handlebars = require("handlebars"),
  path = require("path"),
  dirPath = path.resolve(__dirname),
  emailTemplatePath = path.resolve(__dirname), //use __dirname + '/../../guides/emailWidgets' for widget emails
  outputSubPath = dirPath + "/tests",
  dataFile = dirPath + "/tests/data.js",
  dataObj = require(dataFile),
  helpers = require("./helpers"),
  fs = require("fs");

fs.readdir(emailTemplatePath, function(err, files) {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }

  console.log("Files ", files);

  var htmlFiles = files.filter(function(file) {
    return file.indexOf(".hbs") !== -1;
  });

  htmlFiles.forEach(function(file, index) {
    var name = file.replace(".hbs", "");
    var readedFile = fs.readFileSync(
      path.resolve(emailTemplatePath + "/" + file),
      "utf8"
    );
    if (dataObj[name]) {
      console.log("data file", name);
      if (dataObj[name].handlerName === "handlebars") {
        var hTpl = handlebars.compile(readedFile, {knownHelpers: helpers});
        fs.writeFile(
          path.resolve(outputSubPath + "/" + name + "-compiled.html"),
          hTpl(dataObj[name]),
          function(err) {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    }
  });
});
