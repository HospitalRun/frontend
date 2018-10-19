module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: [
    'ember'
  ],
  extends: [
    'eslint:recommended',
<<<<<<< HEAD
    'plugin:ember-suave/recommended'
=======
    'plugin:ember/recommended'
>>>>>>> 9af0cff7... message
  ],
  env: {
    browser: true
  },

  globals: {
    '$': true,
    'Bloodhound': true,
    'dymo': true,
    'Filer': true,
    'goog': true,
    'logDebug': true,
    'Pikaday': true,
    'PouchDB': true,
    'Promise': true,
    'toolbox': true,
    'Uint8Array': true
  },

  rules: {
<<<<<<< HEAD
    'camelcase': 0,
    'ember-suave/no-direct-property-access': 0,
    'ember-suave/require-access-in-comments': 0,
    'no-console': 0
=======
>>>>>>> 9af0cff7... message
  },
  overrides: [
    // node files
    {
      files: [
<<<<<<< HEAD
        'testem.js',
        'ember-cli-build.js',
=======
        '.template-lintrc.js',
        'ember-cli-build.js',
        'testem.js',
        'blueprints/*/index.js',
>>>>>>> 9af0cff7... message
        'config/**/*.js',
        'lib/*/index.js'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      }
<<<<<<< HEAD
    },

    // test files
    {
      files: ['tests/**/*.js'],
      excludedFiles: ['tests/dummy/**/*.js'],
      env: {
        embertest: true
      }
=======
>>>>>>> 9af0cff7... message
    }
  ]
};
