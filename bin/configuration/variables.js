require("dotenv").config();

const variables = {
  Database: {
    connection: process.env.connection,
  },
  Security: {
    secretKey: process.env.secretKey,
  },
  Pagarme: {
    pagarmeKey: process.env.pagarmeKey,
  },
};

module.exports = variables;
