const { Router } = require('express');
const { index } = require('../resource/leagues');
const { byLeagueId } = require('../resource/tournaments');
const { liveGames, gameById, gameDetailById } = require('../resource/games');

const routes = Router();

routes.get('/', (_req, res) =>
  res
    .status(200)
    .json({ front_end: process.env.FRONT_END_URL, version: '1.0.0' })
);

routes.get('/leagues', index);
routes.get('/tournaments/:leagueId', byLeagueId);
routes.get('/games/live', liveGames);
routes.get('/games/:id', gameById);
routes.get('/games/detail/:id', gameDetailById);

module.exports = routes;
