// Update with your config settings.
const DEV_POSTGRES_PASSWORD = "p'e.(BT3j7QC,z-<";
const DEV_POSTGRES_URL = `postgres://postgres:${DEV_POSTGRES_PASSWORD}@localhost:5434/postgres`;

const connection_url =
  typeof window !== "undefined"
    ? `postgres://postgres:p'e.(BT3j7QC,z-<@localhost:5432/postgres`
    : process.env.POSTGRES_URL || DEV_POSTGRES_URL;

module.exports = {
  client: "pg",
  connection: connection_url,
  migrations: {
    directory: __dirname + "/db/migrations",
  },
};
