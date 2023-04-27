const { Client } = require("pg");
const fs = require("fs");
const render = require("./templateEngine.js");
const { log } = require("console");

function dbInit() {
  log("dbInit start");
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  client.connect((err) => {
    if (err) {
      console.error("connection error", err.stack);
    } else {
      client.query(
        "SELECT $1::text as message",
        ["Hello world!"],
        (err, res) => {
          if (err) {
            console.error("query error", err.stack);
          } else {
            console.log(res.rows[0].message); // Hello world!
            client.end((err) => {
              if (err) {
                console.error("disconnection error", err.stack);
              }
              log("dbInit done");
            });
          }
        }
      );
    }
  });

  _cerealKnowledgeBaseInit();
}

function _cerealKnowledgeBaseInit() {
  log("_cerealKnowledgeBaseInit start");

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  const initQuery = `
  CREATE TABLE IF NOT EXISTS cerealKnowledgeBase (
    Crop TEXT,
    Min_Planting_Temperature INTEGER,
    Max_Planting_Temperature INTEGER,
    Planting_Start_Month INTEGER,
    Planting_End_Month INTEGER,
    Description TEXT
  );`;
  const initInsertion = `INSERT INTO cerealKnowledgeBase(Crop, Min_Planting_Temperature, Max_Planting_Temperature, Planting_Start_Month, Planting_End_Month, Description)
    VALUES( 'rice', '20', '35', '6', '9', 'Rice is one of the main staple crops in Mali, typically planted during the rainy season. It requires ample water supply and is primarily grown in the Niger River Valley and inland rice cultivation areas.');
      INSERT INTO cerealKnowledgeBase(Crop, Min_Planting_Temperature, Max_Planting_Temperature, Planting_Start_Month, Planting_End_Month, Description)
    VALUES( 'cotton', '15', '34', '5', '9', 'Cotton is one of the main cash crops in Mali, contributing significantly to the countrys export revenue. Cotton cultivation is mainly concentrated in the southern regions, such as Sikasso, Kayes, and Koulikoro.');
      INSERT INTO cerealKnowledgeBase(Crop, Min_Planting_Temperature, Max_Planting_Temperature, Planting_Start_Month, Planting_End_Month, Description)
    VALUES( 'sorghum', '21', '32', '5', '9', 'Sorghum is one of the main staple crops in Mali, characterized by its drought tolerance and wide adaptability. In Mali, sorghum is mainly used for human consumption and animal feed, and is extensively cultivated throughout the country.');
    `;

  client.connect((err) => {
    if (err) {
      console.error("connection error", err.stack);
    } else {
      // client.query(initQuery + initInsertion, (err, res) => {
      client.query(initQuery, (err, res) => {
        if (err) {
          console.error(err);
          client.end();
          return;
        }
        client.end((err) => {
          if (err) {
            console.error("disconnection error", err.stack);
          }
          log("_cerealKnowledgeBaseInit done");
        });
      });
    }
  });
}

function getKnowledgeOf(crop, res) {
  log("getKnowledgeOf start");
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  // "Rice" or "Cotton" or "Sorghum"

  client.connect((err) => {
    if (err) {
      console.error("connection error", err.stack);
    } else {
      client.query(
        `SELECT * FROM cerealKnowledgeBase WHERE Crop = '${crop}'`,
        function (err, result) {
          if (err) {
            console.error(err);
            client.end();
            return;
          }
          let info = result.rows[0];
          log("info:");
          log(info);
          let replacement = {
            crop: info.crop,
            min_planting_temperature: info.min_planting_temperature,
            max_planting_temperature: info.max_planting_temperature,
            planting_start_month: info.planting_start_month,
            planting_end_month: info.planting_end_month,
            description: info.description,
          };
          render("cereal-knowledge", replacement, res);
          client.end((err) => {
            if (err) {
              console.error("disconnection error", err.stack);
            }
            log("getKnowledgeOf done");
          });
        }
      );
    }
  });
}

module.exports = { dbInit: dbInit, getKnowledgeOf: getKnowledgeOf };
