require("dotenv").config();
const express = require("express");

const cookieParser = require("cookie-parser");

//cors necessario apenas para o debug e signin sem o carai do curl
const cors = require("cors");

const app = express();

//pode comentar no final dos testes
app.use(cors());

const port = process.env.SERVER_PORT;

app.use(express.json());
app.use(express.static(__dirname + "../frontend/public"));

app.use(cookieParser()); 

app.use("/api/auth", require("./src/api/routes/authRoutes.js"));
app.use("/api/news", require("./src/api/routes/newsRoutes.js"));



httpServer.listen(port, function () {
  console.log(`Servidor rodando na porta ${port}`);
});
