// Update with your config settings.

// const connection_url = `postgres://postgres:@localhost:5434/postgres`;

const connection_url =
  typeof window !== "undefined"
    ? `postgres://postgres:@localhost:5434/postgres`
    : process.env.ELASTIC_URL;

module.exports = {
  client: "pg",
  connection: connection_url,
  migrations: {
    directory: __dirname + "/db/migrations"
  }
};
