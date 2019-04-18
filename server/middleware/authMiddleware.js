function usersOnly(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json("Please log in");
  }
  next();
}

function adminsOnly(req, res, next) {
  const { isAdmin } = req.session.user;
  if (!isAdmin) {
    return res.status(403).json("You are not an admin");
  }
  next();
}

module.exports = { usersOnly, adminsOnly };
