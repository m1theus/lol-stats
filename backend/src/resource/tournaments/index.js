const fetch = require('node-fetch');
const { baseUrl, headers, responseHandle } = require('../../client');

const fetchTournaments = async (leagueId = null) =>
  fetch(baseUrl(`/getTournamentsForLeague`, { leagueId }), {
    headers,
  }).then(responseHandle);

const sortTournaments = (
  { endDate: firstEndDate },
  { endDate: secondEndDate }
) => new Date(secondEndDate) - new Date(firstEndDate);

const byLeagueId = async (request, response) => {
  const { leagues } = await fetchTournaments(request.params.leagueId);
  const [league] = leagues;
  const tournaments = league.tournaments.sort(sortTournaments) || [];
  response.status(200);
  response.json(tournaments);
};

module.exports = {
  byLeagueId,
};
