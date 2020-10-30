const User = require("../models/User");
const {compare} = require('bcryptjs')

async function login(req,res, next){
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user)
  return res.render("session/login", {
    user: req.body,
    error: "Usuario não encontrado!"
  });

  const passed = await compare(password, user.password)

  if(!passed) return res.render("session/login",{
    user: req.body, 
    error: "senha incorreta"
  })
  
  req.user = user
  next()
}
async function forgot(req,res,next){
  const {email} = req.body
  try{
    let user = await User.findOne({where: {email}})
      if (!user) return res.render("session/forgot-password", {
      user: req.body,
      error: "Email não cadastrado!"
    });
    req.user = user
    next()
  }catch(err){  
    console.error(err)
  }
}

async function reset(req,res,next){
  const { email, password, token, passwordRepeat } = req.body;

  const user = await User.findOne({ where: { email } });
  //check if user exists
  if (!user)
  return res.render("session/password-reset", {
    user: req.body,
    token,
    error: "Usuario não cadastrado!"
  });

 //check if password match
  if (password != passwordRepeat)
    return res.render("session/password-reset", {
      user: req.body,
      token,
      error: "As senhas não batem.",
  });

  //check if token match
  if(token != user.reset_token)
  return res.render("session/password-reset", {
    user: req.body,
    token,
    error: "Token invalido! Solicite uma nova recuperação de senha",
  });

  //check if token is expired
  let now = new Date()
  now = now.setHours(now.getHours())
  
  if(now > user.reset_token_expires) return res.render("session/password-reset", {
    user: req.body,
    token,
    error: "token expirado! Por favor, solicite uma nova recuperação de senha",
  });
  req.user = user
  next()
}

module.exports = {
  login,
  forgot,
  reset
};