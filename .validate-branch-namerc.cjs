module.exports = {
  pattern: /^(feat|fix|hotfix|chore|refactor|revert|docs|style|test|)\/tu-0[1-3]-\d{2}\/[a-zA-Z0-9-]+$/,
  errorMsg: 'Please use correct branch name',
};

// Branch Name Examples:

// "feat/tu-01-01/add-login-form" // where 01 is the sprint number and 01 is the issue number
// "fix/tu-02-03/fix-router" // where 02 is the sprint number and 03 is the issue number
