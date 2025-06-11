module.exports = {
  // Basic formatting
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  
  // JavaScript specific
  arrowParens: 'avoid',
  bracketSpacing: true,
  bracketSameLine: false,
  
  // File types
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80
      }
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always'
      }
    }
  ]
};
