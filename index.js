const express = require("express");
const render = require("./templateEngine.js");
const axios = require("axios");
const weatherSlice = require("./weather.js");
const { log } = require("console");
const { dbInit, getKnowledgeOfCrop } = require("./db.js");

const app = express();
const port = process.env.PORT || 3000;

dbInit();

app.get(["/"], (req, res) => {
  greeting = "<h1>Hello From Group 6!</h1>";
  res.send(greeting);
});

app.get("/greeting.xml", (req, res) => {
  render("greeting", {}, res);
});

app.get("/education.xml", (req, res) => {
  render("education", {}, res);
});

app.get("/rice.xml", (req, res) => {
  getKnowledgeOfCrop("rice", res);
});

app.get("/cotton.xml", (req, res) => {
  getKnowledgeOfCrop("cotton", res);
});

app.get("/sorghum.xml", (req, res) => {
  getKnowledgeOfCrop("sorghum", res);
});

app.get("/weather-forecast.xml", (req, res) => {
  axios
    .get(
      "https://api.open-meteo.com/v1/forecast?latitude=12.65&longitude=-8.00&hourly=temperature_2m"
    )
    .then((response) => {
      const temperatures = response.data.hourly.temperature_2m;
      const highAndLow = weatherSlice(temperatures);
      let page = render(
        "weather-forecast",
        {
          high0: highAndLow[0][0],
          low0: highAndLow[0][1],
          high1: highAndLow[1][0],
          low1: highAndLow[1][1],
          high2: highAndLow[2][0],
          low2: highAndLow[2][1],
          high3: highAndLow[3][0],
          low3: highAndLow[3][1],
          high4: highAndLow[4][0],
          low4: highAndLow[4][1],
          high5: highAndLow[5][0],
          low5: highAndLow[5][1],
          high6: highAndLow[6][0],
          low6: highAndLow[6][1],
        },
        res
      );
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving data from API");
    });
});

app.listen(port, () => console.log(`HelloNode app listening on port ${port}!`));
