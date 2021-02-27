const express = require('express');
const cors = require('cors');
const { json } = require('express');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(json());
app.use(routes);

app.listen(process.env.SERVER_PORT || 1337, () =>
  console.log('[app] started!')
);
