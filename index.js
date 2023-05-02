const express = require("express");
const render = require("./templateEngine.js");
const axios = require("axios");
const weatherSlice = require("./weather.js");
const { log } = require("console");
const {
  dbInit,
  getKnowledgeOfCrop,
  updateMarket,
  getLatestBids,
} = require("./db.js");

const app = express();
const port = process.env.PORT || 3000;

dbInit();

app.get(["/"], (req, res) => {
  greeting = "<h1>Hello From Group 6! Version 0.2</h1>";
  res.send(greeting);
});

app.get("/greeting.xml", (req, res) => {
  render("greeting", {}, res);
});

app.get("/language.xml", (req, res) => {
  render("language", {}, res);
});

app.get("/actions.xml", (req, res) => {
  render("actions", {}, res);
});

app.get("/actions-fr.xml", (req, res) => {
  render("actions-fr", {}, res);
});

app.get("/weather.xml", (req, res) => {
  render("weather", {}, res);
});

app.get("/weather-fr.xml", (req, res) => {
  render("weather-fr", {}, res);
});

// TODO: add suggestion with analytics
app.get("/weather-suggestion.xml", (req, res) => {
  render("weather-suggestion", {}, res);
});

app.get("/weather-suggestion-fr.xml", (req, res) => {
  render("weather-suggestion-fr", {}, res);
});

app.get("/cereal-sale.xml", (req, res) => {
  render("cereal-sale", {}, res);
});

app.get("/cereal-sale-fr.xml", (req, res) => {
  render("cereal-sale-fr", {}, res);
});

app.get("/get-cereal-price.xml", (req, res) => {
  getLatestBids(res, false);
});

app.get("/get-cereal-price-fr.xml", (req, res) => {
  // TODO: French
  getLatestBids(res, true);
});

app.get("/market-main.xml", (req, res) => {
  render("market-main", {}, res);
});

app.get("/market-main-fr.xml", (req, res) => {
  render("market-main-fr", {}, res);
});

app.get("/goodbye.xml", (req, res) => {
  render("goodbye", {}, res);
});

app.get("/goodbye-fr.xml", (req, res) => {
  render("goodbye-fr", {}, res);
});

app.get("/market/:type/:price/:quantity", (req, res) => {
  const type = req.params.type;
  const price = req.params.price;
  const quantity = req.params.quantity;
  updateMarket(type, price, quantity, res, false);
  log(
    "Market Info Added: " +
      type +
      " at the price of " +
      price +
      " with the quantity of " +
      quantity
  );
});

app.get("/market-fr/:type/:price/:quantity", (req, res) => {
  const type = req.params.type;
  const price = req.params.price;
  const quantity = req.params.quantity;
  updateMarket(type, price, quantity, res, true);
  log(
    "Market Info Added: " +
      type +
      " at the price of " +
      price +
      " with the quantity of " +
      quantity
  );
});

app.get("/education.xml", (req, res) => {
  render("education", {}, res);
});

app.get("/education-fr.xml", (req, res) => {
  render("education-fr", {}, res);
});

app.get("/rice.xml", (req, res) => {
  getKnowledgeOfCrop("rice", res, false);
});

app.get("/rice-fr.xml", (req, res) => {
  getKnowledgeOfCrop("rice", res, true);
});

app.get("/cotton.xml", (req, res) => {
  getKnowledgeOfCrop("cotton", res, false);
});

app.get("/cotton-fr.xml", (req, res) => {
  getKnowledgeOfCrop("cotton", res, true);
});

app.get("/sorghum.xml", (req, res) => {
  getKnowledgeOfCrop("sorghum", res, false);
});

app.get("/sorghum-fr.xml", (req, res) => {
  getKnowledgeOfCrop("sorghum", res, true);
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

app.get("/weather-forecast-fr.xml", (req, res) => {
  axios
    .get(
      "https://api.open-meteo.com/v1/forecast?latitude=12.65&longitude=-8.00&hourly=temperature_2m"
    )
    .then((response) => {
      const temperatures = response.data.hourly.temperature_2m;
      const highAndLow = weatherSlice(temperatures);
      let page = render(
        "weather-forecast-fr",
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
