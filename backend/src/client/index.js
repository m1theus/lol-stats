const baseUrl = (path, params = {}) =>
  `https://prod-relapi.ewp.gg/persisted/gw${path}?${new URLSearchParams({
    hl: 'en-US',
    ...params,
  })}`;

const headers = {
  'cache-control': 'no-cache',
  'x-api-key': '0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z',
};

const responseHandle = async (response = {}) => {
  const responses = await response.json();
  return responses.data;
};

module.exports = {
  headers,
  baseUrl,
  responseHandle,
};
