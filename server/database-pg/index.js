const { Pool } = require('pg');

const client = new Pool({
  connectionString: "postgres://default:7FYZtUHB2CDK@ep-gentle-sky-a2v8xag0.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require",
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Connection error', err.stack));

module.exports = client;
