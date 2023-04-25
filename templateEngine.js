const fs = require("fs");

function render(name, searchValue, replaceValue) {
  fs.readFile(`./templates/${name}.xml`, "utf8", (err, data) => {
    if (err) return "template error";
    return data.replace(`{${searchValue}}`, replaceValue);
  });
}

module.exports = render;
