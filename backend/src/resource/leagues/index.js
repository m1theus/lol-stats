const fetch = require('node-fetch');
const { baseUrl, headers, responseHandle } = require('../../client');

const fetchLeagues = async () =>
  fetch(baseUrl('/getLeagues'), {
    headers,
  }).then(responseHandle);

const index = async (_request, response) => {
  const { leagues } = await fetchLeagues();
  response.status(200);
  response.json(leagues);
};

module.exports = {
  index,
};
