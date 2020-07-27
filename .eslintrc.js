module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": [
        "google",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "ecmaFeatures": {
            "modules": true
        }
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "object-curly-spacing": 0,
        "indent": ["warn", 4],
        "operator-linebreak": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/indent": ["warn", 4, {
            "VariableDeclarator": 2,
            "MemberExpression": 1,
            "flatTernaryExpressions": true,

        }],
        "max-depth": ["warn", 4]
    }
};
