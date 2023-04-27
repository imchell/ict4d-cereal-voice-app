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
  DROP TABLE cerealKnowledgeBase;
  CREATE TABLE IF NOT EXISTS cerealKnowledgeBase (
    Crop TEXT,
    Min_Planting_Temperature INTEGER,
    Max_Planting_Temperature INTEGER,
    Planting_Start_Month INTEGER,
    Planting_End_Month INTEGER,
    Description TEXT
  );`;
  const initInsertion = `INSERT INTO cerealKnowledgeBase(Crop, Min_Planting_Temperature, Max_Planting_Temperature, Planting_Start_Month, Planting_End_Month, Description)
    VALUES( 'Rice', '20', '35', '6', '9', 'Rice is one of the main staple crops in Mali, typically planted during the rainy season. It requires ample water supply and is primarily grown in the Niger River Valley and inland rice cultivation areas.');
      INSERT INTO cerealKnowledgeBase(Crop, Min_Planting_Temperature, Max_Planting_Temperature, Planting_Start_Month, Planting_End_Month, Description)
    VALUES( 'Cotton', '15', '34', '5', '9', 'Cotton is one of the main cash crops in Mali, contributing significantly to the countrys export revenue. Cotton cultivation is mainly concentrated in the southern regions, such as Sikasso, Kayes, and Koulikoro.');
      INSERT INTO cerealKnowledgeBase(Crop, Min_Planting_Temperature, Max_Planting_Temperature, Planting_Start_Month, Planting_End_Month, Description)
    VALUES( 'Sorghum', '21', '32', '5', '9', 'Sorghum is one of the main staple crops in Mali, characterized by its drought tolerance and wide adaptability. In Mali, sorghum is mainly used for human consumption and animal feed, and is extensively cultivated throughout the country.');
    `;

  client.connect((err) => {
    if (err) {
      console.error("connection error", err.stack);
    } else {
      client.query(initQuery + initInsertion, (err, res) => {
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
          let Crop = info.Crop;
          let Min_Planting_Temperature = info.Min_Planting_Temperature;
          let Max_Planting_Temperature = info.Max_Planting_Temperature;
          let Planting_Start_Month = info.Planting_Start_Month;
          let Planting_End_Month = info.Planting_End_Month;
          let Description = info.Description;
          let replacement = {
            Crop: Crop,
            Min_Planting_Temperature: Min_Planting_Temperature,
            Max_Planting_Temperature: Max_Planting_Temperature,
            Planting_Start_Month: Planting_Start_Month,
            Planting_End_Month: Planting_End_Month,
            Description: Description,
          };
          render("education", replacement, res);
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
