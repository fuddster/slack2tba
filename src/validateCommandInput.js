// src/validateCommandInput.js
const validateCommandInput = (teamNums) => {
  if (!teamNums) {
    return new Error('No team numbers found in the message');
  }

  if (teamNums.length > 5) {
    return new Error('You cannot get info on more than 5 teams at a time');
  }
};

module.exports = validateCommandInput;
