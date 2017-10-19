module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import",
        "html"
    ],
    "env": {
      "browser": true,
      "node": true
    },
    "rules": {
      "guard-for-in": 1, // TODO
      "no-restricted-syntax": 1, // TODO
      "comma-dangle": 0,
      "space-before-function-paren": [2, "always"],
      "no-unused-vars": 1,
      "no-param-reassign": [2, {
        "props": true,
        "ignorePropertyModificationsFor": ["state"]
      }],
      "arrow-parens": [2, "always"],
      "arrow-body-style": [1, "always"],
      "no-underscore-dangle": [2, {
        "allow": [
          "__getScopedUrl", "_requestAllPages",
          "_props"
        ]
      }],
      "import/prefer-default-export": [1, "always"]
    }
};
