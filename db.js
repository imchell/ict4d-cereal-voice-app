const { Client } = require("pg");
const fs = require("fs");
const { render, renderHtml } = require("./templateEngine.js");
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

function _marketBaseInit() {
  log("_marketBaseInit start");

  const client = new Client({ connectionString: process.env.DATABASE_URL });

  const initQuery = `
  CREATE TABLE IF NOT EXISTS marketBase (
    Crop TEXT,
    Price INTEGER,
    Quantity INTEGER
  );`;

  const initInsertion = `INSERT INTO marketBase(Crop, Price, Quantity)
    VALUES( 'rice', '20', '350');
      INSERT INTO marketBase(Crop, Price, Quantity)
    VALUES( 'cotton', '15', '100');
      INSERT INTO marketBase(Crop, Price, Quantity)
    VALUES( 'sorghum', '0', '0');
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
          log("_marketBaseInit done");
        });
      });
    }
  });
}

function updateMarket(type, price, quantity, res, isFrench = false) {
  log("updateMarket start");
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  const intertionQuery = `INSERT INTO marketBase(Crop, Price, Quantity)
    VALUES('${type}', '${price}', '${quantity}');`;

  client.connect((err) => {
    if (err) {
      console.error("connection error", err.stack);
    } else {
      client.query(intertionQuery, function (err, result) {
        if (err) {
          console.error(err);
          client.end();
          return;
        }
        if (!isFrench) {
          render("market-main", {}, res);
        } else {
          render("market-main-fr", {}, res);
        }
        client.end((err) => {
          if (err) {
            console.error("disconnection error", err.stack);
          }
          log("updateMarket done");
        });
      });
    }
  });
}

function getLatestBidsWeb(res) {
  log("getLatestBidsWeb start");
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  client.connect((err) => {
    if (err) {
      console.error("connection error", err.stack);
    } else {
      client.query(`SELECT * FROM marketBase`, function (err, result) {
        if (err) {
          console.error(err);
          client.end();
          return;
        }
        let bids = "";
        for (let i = 0; i < result.rows.length; i++) {
          let info = result.rows[i];
          bids = `${bids}
          <tr>
            <td>${info.crop}<br></b><span class="french"></span></td>
            <td>${info.quantity}</td>
            <td>${info.price}</td>
          </tr>`;
        }
        log("bids:");
        log(bids);
        let replacement = {
          bids: bids,
        };
        renderHtml("marketplace-web", replacement, res);
        client.end((err) => {
          if (err) {
            console.error("disconnection error", err.stack);
          }
          log("getLatestBidsWeb done");
        });
      });
    }
  });
}

function getLatestBids(res, isFrench = false) {
  log("getLatestBids start");
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  client.connect((err) => {
    if (err) {
      console.error("connection error", err.stack);
    } else {
      client.query(`SELECT * FROM marketBase`, function (err, result) {
        if (err) {
          console.error(err);
          client.end();
          return;
        }
        let bids = "The latest bids are as follows.";
        for (let i = 0; i < result.rows.length; i++) {
          let info = result.rows[i];
          bids = `${bids} ${info.quantity} ${info.crop}s at the price of ${info.price}.`;
        }
        log("bids:");
        log(bids);
        let replacement = {
          bids: bids,
        };
        if (!isFrench) {
          render("get-cereal-price", replacement, res);
        } else {
          render("get-cereal-price-fr", replacement, res);
        }
        client.end((err) => {
          if (err) {
            console.error("disconnection error", err.stack);
          }
          log("getLatestBids done");
        });
      });
    }
  });
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

function getKnowledgeOfCrop(crop, res, isFrench = false) {
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
          if (!isFrench) {
            render("cereal-knowledge", replacement, res);
          } else {
            render("cereal-knowledge-fr", replacement, res);
          }

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

module.exports = {
  dbInit: dbInit,
  getKnowledgeOfCrop: getKnowledgeOfCrop,
  updateMarket: updateMarket,
  getLatestBids: getLatestBids,
  getLatestBidsWeb: getLatestBidsWeb,
};
