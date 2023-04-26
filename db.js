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
  const initQuery = `
  CREATE TABLE cerealKnowledgeBase (
    Crop TEXT,
    Min_Planting_Temperature INTEGER,
    Max_Planting_Temperature INTEGER,
    Planting_Start_Month INTEGER,
    Planting_End_Month INTEGER,
    Description TEXT
  );
`;
  client.query(initQuery, (err, res) => {
    if (err) {
      console.error(err);
      client.end();
      return;
    }

    console.log("Table created successfully");

    // Import data from CSV file
    const csvFilePath = "./data/cereal.csv";
    const csvData = fs.readFileSync(csvFilePath, "utf8");

    const importQuery = `
    COPY cerealKnowledgeBase (Crop, Min_Planting_Temperature, Max_Planting_Temperature, Planting_Start_Month, Planting_End_Month, Description) FROM STDIN WITH (FORMAT CSV, HEADER true)
  `;

    const stream = client.query(copyFrom(importQuery));
    stream.on("error", (err) => {
      console.error(err);
      client.end();
      return;
    });

    stream.on("end", () => {
      console.log("Data imported successfully");
      client.end();
    });

    const csvStream = new Readable();
    csvStream.push(csvData);
    csvStream.push(null);
    csvStream.pipe(stream);
  });
}

module.exports = dbInit;
