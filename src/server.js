// src/server.js
const Express = require('express');
const bodyParser = require('body-parser');
const tbaInterfaceFactory = require('./tbaInterface');
const slashCommandFactory = require('./slashCommand');

const app = new Express();
app.use(bodyParser.urlencoded({
  extended: true
}));

const {SLACK_TOKEN: slackToken, TBA_APIKEY: apiKey, PORT} = process.env;

if (!slackToken || !apiKey) {
  console.error('missing environment variables SLACK_TOKEN and/or TBA_APIKEY');
  process.exit(1);
}

const port = PORT || 80;

const tbaClient = tbaInterfaceFactory(apiKey);
const slashCommand = slashCommandFactory(tbaClient, slackToken);

app.post('/', (req, res) => {
  slashCommand(req.body)
    .then((result) => {
      return res.json(result);
    })
    .catch(console.error);
});

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});
