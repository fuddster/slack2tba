// src/tbaInterface.js
const request = require('request-promise-native');

const createErrorDescription = (code, err) => {
  switch (code) {
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized: Be sure you configured the integration to use a valid API key';
    case 403:
      return `Invalid request: ${code} ${err.body}`;
    case 404:
      return `Not found: ${code} ${err.body}`;
    case 405:
      return `Method not allowed: ${err.body}`;
    case 503:
      return `Service currently under maintenance. Retry later`;
    default:
      return `Unexpected error connecting to Rebrandly APIs`;
  }
};

const createError = (teamNum, err) => {
  console.log(`err.statusCode: ${err.statusCode}`);
  console.log(`err.body: ${err.body}`);
  const errorDescription = createErrorDescription(err.statusCode, err);
  return new Error(`Cannot get info for "${teamNum}": ${errorDescription}`);
};

const getTBAData = (apikey) => (teamNum) => new Promise((resolve, reject) => {
  console.log(`Processing team #${teamNum}`);

  const req = request({
    url: `https://www.thebluealliance.com/api/v3/team/frc${teamNum}/simple`,
    method: 'GET',
    headers: {
      'X-TBA-Auth-Key': apikey,
      'Content-Type': 'application/json'
    },
    //body: JSON.stringify(teamNum, null, 2),
    resolveWithFullResponse: true
  });

  req
    .then((response) => {
      const result = JSON.parse(response.body);
      console.log(`result: ${result}`);
      var k = Object.keys(result);
      console.log(`Result properties: ${k}`);
      resolve(result);
    })
    .catch((err) => {
      console.log(`Error response: ${err.response}`);
      var k = Object.keys(err.response);
      console.log(`Response properties: ${k}`);
      console.log(`Status Message: ${err.statusMessage}`);
      console.log(`Request: ${err.request}`);
      console.log(`Body: ${err.body}`);
      resolve(createError(teamNum, err.response));
    });
});

const tbaInterfaceFactory = (apikey) => (teamNums) => {
  const requestsPromise = teamNums.map(getTBAData(apikey));
  return Promise.all(requestsPromise);
};

module.exports = tbaInterfaceFactory;
