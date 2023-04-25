const { log } = require("console");
const fs = require("fs");

function render(name, mapping, response) {
  fs.readFile(`./templates/${name}.xml`, "utf8", (err, data) => {
    if (err) return "template error";
    let res = data;
    for (let key in mapping) {
      res = res.replace(`{${key}}`, `${mapping[key]}`);
    }
    response.send(res);
  });
}

module.exports = render;
