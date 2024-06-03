require("dotenv").config();
const pgPromise = require("pg-promise");

const pgp = pgPromise({}); // Empty object means no additional config required

const config = {
  host: process.env.PGHOST,
  port: 5432,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
};

const db = pgp(config);

exports.db = db;
