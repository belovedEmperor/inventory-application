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

async function gameUpdateGet(req, res) {
  const game = await db.getGame(req.params.id);
  const developer = await db.getGameDeveloper(game.id);
  const genres = await db.getGameGenres(game.id);

  res.render("gameUpdateForm", { game, developer, genres });
}

async function gameUpdatePost(req, res) {
  const gameId = req.params.id;
  const { game, gameShortDesc, gameLongDesc } = req.body;

  await db.updateGame(gameId, game, gameShortDesc, gameLongDesc);

  res.redirect(`/game/${gameId}`);
}

async function gameDeletePost(req, res) {
  const gameId = req.params.id;

  await db.deleteGame(gameId);

  res.redirect("/");
}

async function gameNewGet(req, res) {
  res.render("newGameForm", { title: "New" });
}

async function gameNewPost(req, res) {
  const { game, gameShortDesc, gameLongDesc, developer, genres } = req.body;

  const developerId = await db.createDeveloper(developer);
  const gameId = await db.createGame(
    game,
    gameShortDesc,
    gameLongDesc,
    developerId,
  );

  for (const genre of genres.split(",")) {
    const genreId = await db.createGenre(genre);
    await db.createGameGenreJunction(gameId, genreId);
  }

  res.redirect("/");
}

module.exports = {
  gamesListGet,
  developersListGet,
  genresListGet,
  gameDetailedGet,
  gameNewGet,
  gameNewPost,
  gameUpdateGet,
  gameUpdatePost,
  gameDeletePost,
};
