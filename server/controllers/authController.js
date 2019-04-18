const bcrypt = require("bcryptjs"); // require bcryptjs to hash passwords

async function register(req, res) {
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

async function login(req, res) {
  const { username, password } = req.body;
  const db = req.app.get("db");
  const foundUser = await db.get_user([username]);
  const user = foundUser[0];
  if (!user) {
    return res
      .status(401)
      .json("User not found. Please register as a new user before logging in.");
  } else {
    const isAuthenticated = bcrypt.compareSync(password, user.hash);
    if (!isAuthenticated) {
      return res.status(403).json("Incorrect password");
    } else {
      req.session.user = {
        isAdmin: user.is_admin,
        id: user.id,
        username: user.username
      };
      return res.json(req.session.user);
    }
  }
}

async function logout(req, res) {
  req.session.destroy();
  return res.status(200).json("Logged out");
}

module.exports = {
  register,
  login,
  logout
};