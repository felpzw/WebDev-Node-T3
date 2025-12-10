require("dotenv").config();

const bcrypt = require('bcrypt');
const saltRounds = 10;

var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();

const User = require("../../models/user.js");

const secretToken = process.env.DB_TOKEN_SECRET;

const authUser = require('../middleware/authUser'); 

router.post("/signup", async function (req, res, next) {
  console.log("recebeu criaConta");
  console.log(req.body);

  let _username = req.body.username;
  let _password = req.body.password;
  
  try {
    const hashPass = await bcrypt.hash(_password, saltRounds);

    const novoUser = new User({ username: _username, password: hashPass });
    await novoUser.save();
    
    res.status(201).json({ message: 'Sign up successfully', data: novoUser });
  } catch (error) {
    if (error.code === 11000) { 
        return res.status(409).json({ message: 'Username already exists.' });
    }
    res.status(400).json({ message: 'Error creating account.', error: error.message });
  }
});

router.get("/logoff", authUser, async function (req, res) {
  res.clearCookie("token");
  res.json({ message: "Logout successfully." });
});

router.post("/login", async function (req, res, next) {
  let _username = req.body.username;
  let _password = req.body.password;

  let user = await User.findOne({ username: _username });
  if (!user) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }

  const match = await bcrypt.compare(_password, user.password);
  
  if (match) {
    console.log(`Usuário ${_username} fez login`);
    var token = jwt.sign({ username: _username }, secretToken, { expiresIn: '1h' }); 
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });

    res.json({ authUser: true, token: token });
  } else {
    console.log("NAO autorizado");
    res.status(401).json({ message: "Credenciais inválidas" });
  }
});

module.exports = router;