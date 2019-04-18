async function dragonTreasure(req, res) {
  const db = req.app.get("db");
  const result = await db.get_dragon_treasure(1);
  return res.status(200).json(result);
}

async function getUserTreasure(req, res) {
  const { id } = req.session.user;
  const db = req.app.get("db");
  const treasureResults = await db.get_user_treasure(id);
  return res.status(200).json(treasureResults);
}

async function addUserTreasure(req, res) {
  const { treasureURL } = req.body;
  const { id } = req.session.user;
  const db = req.app.get("db");
  const userTreasure = await db.add_user_treasure(treasureURL, id);
  return res.status(200).json(userTreasure);
}

async function getAllTreasure(req, res) {
  const db = req.app.get("db");
  const allTreasure = await db.get_all_treasure();
  return res.status(200).json(allTreasure);
}

module.exports = {
  dragonTreasure,
  getUserTreasure,
  addUserTreasure,
  getAllTreasure
};