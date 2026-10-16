const pool = require("./pool");

async function getGames({ game, developer, genre }) {
  let text = "SELECT * FROM games";
  let queries = [];

  if (game || developer || genre) text += " WHERE ";
  if (game) queries.push(`name ILIKE '%${game}%'`);
  if (developer)
    queries.push(
      `id IN (SELECT game_id FROM game_developers WHERE developer_id = (SELECT id FROM developers WHERE name ILIKE '%${developer}%'))`,
    );
  if (genre)
    queries.push(
      `id IN (SELECT game_id FROM game_genres WHERE genre_id = (SELECT id FROM genres WHERE name ILIKE '%${genre}%'))`,
    );

  const { rows } = await pool.query(text + queries.join(" AND "));
  return rows;
}

async function getAllDevelopers() {
  const { rows } = await pool.query("SELECT * FROM developers");
  return rows;
}

async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genres");
  return rows;
}

async function getGame(id) {
  return (await pool.query("SELECT * FROM games WHERE id = $1", [id])).rows[0];
}

async function getDeveloper(id) {
  return (await pool.query("SELECT * FROM developers WHERE id = $1", [id]))
    .rows[0];
}

async function getGenre(id) {
  return (await pool.query("SELECT * FROM genres WHERE id = $1", [id])).rows[0];
}

async function getGameDeveloper(gameId) {
  return (
    await pool.query(
      "SELECT * FROM developers WHERE id = (SELECT developer_id FROM game_developers WHERE game_id = $1)",
      [gameId],
    )
  ).rows[0];
}

async function getGameGenres(gameId) {
  return (
    await pool.query(
      "SELECT * FROM genres WHERE id = (SELECT genre_id FROM game_genres WHERE game_id = $1)",
      [gameId],
    )
  ).rows;
}

module.exports = {
  getGames,
  getAllDevelopers,
  getAllGenres,
  getGame,
  getDeveloper,
  getGenre,
  getGameDeveloper,
  getGameGenres,
};
