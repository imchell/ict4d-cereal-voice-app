const express = require("express");
const render = require("./templateEngine.js");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.get(["/", "/:name"], (req, res) => {
  greeting = "<h1>Hello From Node on Fly!</h1>";
  name = req.params["name"];
  if (name) {
    res.send(greeting + "</br>and hello to " + name);
  } else {
    res.send(greeting);
  }
});

app.get("/weather", (req, res) => {
  axios
    .get(
      "https://api.open-meteo.com/v1/forecast?latitude=12.65&longitude=-8.00&hourly=temperature_2m"
    )
    .then((response) => {
      const temperature = response.data.temperature_2m[0];
      res.send(`temperature: ${temperature}`);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data from API");
    });
});

app.listen(port, () => console.log(`HelloNode app listening on port ${port}!`));
