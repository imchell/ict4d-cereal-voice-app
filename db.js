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
  const initQuery = `CREATE TABLE IF NOT EXISTS cerealKnowledgeBase (
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
    );`;
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
