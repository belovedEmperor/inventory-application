const pool = require("./pool");

async function getGames({ game, developer, genre }) {
  let text = "SELECT * FROM games";
  let queries = [];

  if (game || developer || genre) text += " WHERE ";
  if (game) queries.push(`name ILIKE '%${game}%'`);
  if (developer)
    queries.push(
      `developer_id IN (SELECT id FROM developers WHERE name ILIKE '%${developer}%')`,
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
      "SELECT * FROM developers WHERE id = (SELECT developer_id FROM games WHERE id = $1)",
      [gameId],
    )
  ).rows[0];
}

async function getGameGenres(gameId) {
  return (
    await pool.query(
      "SELECT * FROM genres WHERE id IN (SELECT genre_id FROM game_genres WHERE game_id = $1)",
      [gameId],
    )
  ).rows;
}

async function createGame(game, short_description, description, developer_id) {
  if (description) {
    return (
      await pool.query(
        "INSERT INTO games (name, short_description, description, developer_id) VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
        [game, short_description, description, developer_id],
      )
    ).rows[0].id;
  }
  return (
    await pool.query(
      "INSERT INTO games (name, short_description, developer_id) VALUES ($1, $2, $3) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
      [game, short_description, developer_id],
    )
  ).rows[0].id;
}

async function createDeveloper(developer) {
  return (
    await pool.query(
      "INSERT INTO developers (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
      [developer],
    )
  ).rows[0].id;
}

async function createGenre(genre) {
  return (
    await pool.query(
      "INSERT INTO genres (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
      [genre],
    )
  ).rows[0].id;
}

async function createGameGenreJunction(gameId, genreId) {
  return await pool.query(
    "INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2) ON CONFLICT (game_id, genre_id) DO NOTHING",
    [gameId, genreId],
  );
}

async function updateGame(gameId, game, gameShortDesc, gameLongDesc) {
  await pool.query(
    "UPDATE games SET name = $2, short_description = $3, description = $4 WHERE id = $1",
    [gameId, game, gameShortDesc, gameLongDesc],
  );
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
  createGame,
  createDeveloper,
  createGenre,
  createGameGenreJunction,
  updateGame,
};
