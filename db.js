const { Client } = require("pg");
const fs = require("fs");

function dbInit() {
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
            });
          }
        }
      );
    }
  });

  cerealKnowledgeBaseInit(client);

  return client;
}

function cerealKnowledgeBaseInit(client) {
  const initQuery = `DROP TABLE IF EXISTS cerealKnowledgeBase;
  CREATE TABLE IF NOT EXISTS cerealKnowledgeBase (
    Crop TEXT,
    Min_Planting_Temperature INTEGER,
    Max_Planting_Temperature INTEGER,
    Planting_Start_Month INTEGER,
    Planting_End_Month INTEGER,
    Description TEXT
  );`;
  const initInsertion = `INSERT INTO cerealKnowledgeBase(Crop, Min_Planting_Temperature, Max_Planting_Temperature, Planting_Start_Month, Planting_End_Month, Description)
    SELECT 'Rice', '20', '35', '6', '9', 'Rice is one of the main staple crops in Mali, typically planted during the rainy season. It requires ample water supply and is primarily grown in the Niger River Valley and inland rice cultivation areas.'
    WHERE NOT EXISTS (
      SELECT Crop FROM cerealKnowledgeBase WHERE Crop = 'Rice'
    );
    INSERT INTO cerealKnowledgeBase(Crop, Min_Planting_Temperature, Max_Planting_Temperature, Planting_Start_Month, Planting_End_Month, Description)
    SELECT 'Cotton', '15', '34', '5', '9', 'Cotton is one of the main cash crops in Mali, contributing significantly to the country's export revenue. Cotton cultivation is mainly concentrated in the southern regions, such as Sikasso, Kayes, and Koulikoro.'
    WHERE NOT EXISTS (
      SELECT Crop FROM cerealKnowledgeBase WHERE Crop = 'Cotton'
    );
    INSERT INTO cerealKnowledgeBase(Crop, Min_Planting_Temperature, Max_Planting_Temperature, Planting_Start_Month, Planting_End_Month, Description)
    SELECT 'Sorghum', '21', '32', '5', '9', 'Sorghum is one of the main staple crops in Mali, characterized by its drought tolerance and wide adaptability. In Mali, sorghum is mainly used for human consumption and animal feed, and is extensively cultivated throughout the country.'
    WHERE NOT EXISTS (
      SELECT Crop FROM cerealKnowledgeBase WHERE Crop = 'Sorghum'
    );
    `;
  client.query(initQuery, (err, res) => {
    if (err) {
      console.error(err);
      client.end();
      return;
    }
    client.query(initInsertion, (err, res) => {
      if (err) {
        console.error(err);
        client.end();
        return;
      }
    });
  });
}

module.exports = dbInit;
