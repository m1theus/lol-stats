const fetch = require('node-fetch');
const { baseUrl, headers, responseHandle } = require('../../client');

const fetchLiveGame = async () =>
  fetch(baseUrl('/getLive'), {
    headers,
  }).then(responseHandle);

const fetchGameId = async (id) =>
  fetch(baseUrl('/getEventDetails', { id }), {
    headers,
  }).then(responseHandle);

function getTime() {
  const date = new Date();
  date.setSeconds(50);
  date.setMilliseconds(000);
  date.setMinutes(date.getMinutes() - 2);
  return date.toISOString();
}

const fetchGameDetail = async ({ id }) =>
  fetch(
    `https://feed.lolesports.com/livestats/v1/window/${id}?startingTime=${getTime()}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then(async (response) => {
      console.log(
        `m=fetchGameDetail status=${response.status} url=${response.url}`
      );
      return response;
    })
    .then((response) => {
      if (response.status === 204) {
        return {};
      }

      return response.json();
    });

const liveGames = async (_request, response) => {
  const {
    schedule: { events },
  } = await fetchLiveGame();
  const liveGames = events.filter((game) => game.state === 'inProgress');
  response.status(200);
  response.json(liveGames);
};

const gameById = async (request, response) => {
  const detail = await fetchGameId(request.params.id);

  if (!detail) {
    response.status(500);
    response.json({
      message: 'Internal Server Error',
    });
    return;
  }

  if (detail.event.match && detail.event.match.games) {
    const [game] = detail.event.match.games;
    response.status(200);
    response.json(game);
  } else {
    response.status(200);
    response.json({
      message: 'Game not Started!',
    });
  }
};

const extractGameDetails = ({
  esportsGameId: gameId,
  esportsMatchId: matchId,
  gameMetadata = {},
  frames = [],
} = {}) => {
  const lastFrame = getLastFrame(frames);
  const blueTeamMetadata = getTeamMetadata(
    lastFrame.blueTeam,
    gameMetadata.blueTeamMetadata
  );
  const redTeamMetadata = getTeamMetadata(
    lastFrame.redTeam,
    gameMetadata.redTeamMetadata
  );
  return {
    time: lastFrame.rfc460Timestamp,
    gameId,
    matchId,
    blueTeamMetadata,
    redTeamMetadata,
  };
};

const getTeamMetadata = (team = {}, gameMetadata) => {
  const teamPlayers = team.participants.map((playerData) => {
    const playerDescription = gameMetadata.participantMetadata.find(
      (x) => x.participantId === playerData.participantId
    );
    return {
      ...playerData,
      ...playerDescription,
    };
  });
  return {
    totalGold: team.totalGold,
    inhibitors: team.inhibitors,
    towers: team.towers,
    barons: team.barons,
    totalKills: team.totalKills,
    dragons: team.dragons.join(', ') || 0,
    players: teamPlayers,
  };
};

const getLastFrame = (frames = []) => frames[frames.length - 1];

const gameDetailById = async (request, response) => {
  try {
    const gameDetail = await fetchGameDetail({
      id: request.params.id,
      firstEvent: request.query.firstEvent,
    });

    if (!gameDetail) {
      response.status(400);
      response.json({});
      return;
    }

    const gameData = extractGameDetails(gameDetail);

    response.status(200);
    response.json(gameData);

    console.log(`m=gameDetailById msg=success response=200`);
  } catch (e) {
    console.log(`m=gameDetailById error=${e.message}`);
    response.status(400);
    response.json({});
  }
};

module.exports = {
  liveGames,
  gameById,
  gameDetailById,
};
