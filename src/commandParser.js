// src/commandParser.js
const tokenizer = require('string-tokenizer');
const createUrlRegex = require('url-regex');

const arrayOrUndefined = (data) => {
  if (typeof data === 'undefined' || Array.isArray(data)) {
    return data;
  }

  return [data];
};

const commandParser = (commandText) => {
  const tokens = tokenizer()
    .input(commandText)
    .token('teamNum', /(^[0-9][A-Za-z0-9 -]*$)/, match => match[1])
    .resolve();

  return {
    teamNums: arrayOrUndefined(tokens.teamNum)
  };
};

module.exports = commandParser;
