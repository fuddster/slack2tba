// src/slashCommand.js
const commandParser = require('./commandParser');
const validateCommandInput = require('./validateCommandInput');

const createErrorAttachment = (error) => ({
  color: 'danger',
  text: `*Error*:\n${error.message}`,
  mrkdwn_in: ['text']
});

const createSuccessAttachment = (tbaData) => ({
  color: 'good',
  text: `*${tbaData.team_number}*: ${tbaData.nickname}\n${tbaData.city}, ${tbaData.state_prov} ${tbaData.country}`,
  mrkdwn_in: ['text']
});

const createAttachment = (result) => {
  if (result.constructor === Error) {
    return createErrorAttachment(result);
  }

  return createSuccessAttachment(result);
};

const slashCommandFactory = (tbaInterfaceFactory, slackToken) => (body) => new Promise((resolve, reject) => {
  if (!body) {
    return resolve({
      text: '',
      attachments: [createErrorAttachment(new Error('Invalid body'))]
    });
  }

  console.log(`Body: ${body}`);

  if (slackToken !== body.token) {
    return resolve({
      text: '',
      attachments: [createErrorAttachment(new Error('Invalid token'))]
    });
  }

  const { teamNums } = commandParser(body.text);

  let error;
  if ((error = validateCommandInput(teamNums))) {
    return resolve({
      text: '',
      attachments: [createErrorAttachment(error)]
    });
  }

  tbaInterfaceFactory(teamNums)
    .then((result) => {
      return resolve({
        text: `${result.length} teams processed`,
        attachments: result.map(createAttachment)
      });
    });
});

module.exports = slashCommandFactory;
