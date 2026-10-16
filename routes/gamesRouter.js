const { Router } = require("express");
const gamesRouter = Router();
const gamesController = require("../controllers/gamesController");

gamesRouter.get("/", gamesController.gamesListGet);
gamesRouter.get("/search", gamesController.gamesListGet);
gamesRouter.get("/games", gamesController.gamesListGet);
gamesRouter.get("/developers", gamesController.developersListGet);
gamesRouter.get("/genres", gamesController.genresListGet);

gamesRouter.get("/game/:id", gamesController.gameDetailedGet);

module.exports = gamesRouter;
