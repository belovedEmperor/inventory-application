const db = require("../db/queries");

async function gamesListGet(req, res) {
  let games = await db.getGames({
    game: req.query.game,
    developer: req.query.developer,
    genre: req.query.genre,
  });

  res.render("list", { title: "Games", type: "games", data: games });
}

async function developersListGet(req, res) {
  const developers = await db.getAllDevelopers();
  res.render("list", {
    title: "Developers",
    type: "developers",
    data: developers,
  });
}

async function genresListGet(req, res) {
  const genres = await db.getAllGenres();
  res.render("list", {
    title: "Genres",
    type: "genres",
    data: genres,
  });
}

async function gameDetailedGet(req, res) {
  const game = await db.getGame(req.params.id);
  const developer = await db.getGameDeveloper(game.id);
  const genres = await db.getGameGenres(game.id);

  res.render("gameDetailed", { game, developer, genres });
}

module.exports = {
  gamesListGet,
  developersListGet,
  genresListGet,
  gameDetailedGet,
};
