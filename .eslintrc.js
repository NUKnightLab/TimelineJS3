module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  plugins: [
    'jest'
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  rules: {
    // Modernization rules
    'prefer-const': 'error',
    'no-var': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'object-shorthand': 'error',
    'prefer-destructuring': ['error', {
      'array': false,
      'object': true
    }],
    
    // Code quality
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'no-console': 'warn',
    'eqeqeq': 'error',
    'curly': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    
    // Style (handled by Prettier, but some logical rules)
    'no-multiple-empty-lines': ['error', { 'max': 2 }],
    'no-trailing-spaces': 'error',
    
    // Modern JavaScript
    'prefer-spread': 'error',
    'prefer-rest-params': 'error',
    'no-useless-concat': 'error',
    'prefer-numeric-literals': 'error'
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/__tests__/**/*.js'],
      env: {
        jest: true
      },
      extends: ['plugin:jest/recommended'],
      rules: {
        'jest/expect-expect': 'error',
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error'
      }
    }
  ],
  globals: {
    'TL': 'readonly',
    'window': 'readonly',
    'document': 'readonly'
  }
};
