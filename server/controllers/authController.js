const bcrypt = require("bcrypt"); // require bcrypt to hash passwords

async function register(req, res, next) {
    //username, password, isAdmin will be data sent through the body. extract it here to use in response
  const { username, password, isAdmin } = req.body;
  const db = req.app.get("db");
  const result = await db.get_user([username]);
  const existingUser = result[0];
  if (existingUser) {
    return res.status(409).json("Username taken");
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const registedUser = await db.register_user([isAdmin, username, hash]);
  const user = registedUser[0];
  req.session.user = {
    isAdmin: user.is_admin,
    id: user.id,
    username: user.username
  };
  return res.status(201).json(req.session.user);
  
}

module.exports = {
  register
};
