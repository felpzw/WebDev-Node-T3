const mongoose = require("mongoose");

const { dbUser, dbPass, dbName, dbHost, dbPort} = require("./index");

mongoose
  .connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`, {})
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar:", err));

module.exports = mongoose;