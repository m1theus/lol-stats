const express = require('express');
const cors = require('cors');
const { json } = require('express');
const routes = require('./src/routes');

const app = express();
app.use(cors());
app.use(json());
app.use(routes);

app.listen(process.env.PORT || 1337, () =>
  console.log('[app] started!')
);
