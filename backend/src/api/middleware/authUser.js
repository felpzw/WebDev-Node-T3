require("dotenv").config();

var jwt = require("jsonwebtoken");

const secretToken = process.env.DB_TOKEN_SECRET;

function authUser(req, res, next) {
  let token = null;

  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  }

  if (!token && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) return res.status(401).send("Acesso negado");

  jwt.verify(token, secretToken, (err, user) => {
    if (err) return res.status(403).send("Token inválido ou expirado");
    req.username = user;
    next();
  });
}

module.exports = authUser;