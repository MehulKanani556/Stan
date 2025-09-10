module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    // Disable the specific rule that's causing issues with Redux Thunk actions
    'react-hooks/exhaustive-deps': 'off'
  }
};
