const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');

const app = express();
app.use(
  cors({
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin', 'Accept'],
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 1337, () => console.log('[app] started!'));
