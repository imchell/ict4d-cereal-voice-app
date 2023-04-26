const { Client } = require("pg");

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
}

module.exports = dbInit;
