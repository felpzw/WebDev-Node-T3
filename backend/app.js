require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path"); // IMPORTANTE: Adicione isso

const app = express();

const port = process.env.SERVER_PORT || 3000; // Fallback se não tiver no .env

// Middlewares
app.use(cors()); 
app.use(express.json());
app.use(cookieParser());


app.use(express.static(path.join(__dirname, "../../frontend/public")));

app.use("/api/auth", require("./src/api/routes/authRoutes.js"));
app.use("/api/news", require("./src/api/routes/newsRoutes.js"));
app.use("/api/user", require("./src/api/routes/userRoutes.js"));

app.listen(port, function () {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Servindo arquivos estáticos de: ${path.join(__dirname, "../../frontend/public")}`);
});