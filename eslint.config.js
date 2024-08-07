module.exports = {
  extends: ['@angular-eslint/builder/basic'],
  rules: {
    // Enforce consistent indentation (either spaces or tabs)
    'no-mixed-spaces-and-tabs': [2, 'error'], // Severity: error, Enforce spaces

    // Best practices
    'strict-boolean-expressions': ['error', { allowNullable: true }], // Allow nullish values
    'eqeqeq': ['error', 'always'],
    'no-shadow': ['error'],
    'no-empty-function': ['error', 'allow-pure-functions'], // Allow pure functions without side effects
    'curly': ['error', 'all'], // Enforce curly braces for all control flow statements

    // Angular-specific rules (using @angular-eslint)
    '@angular-eslint/component-selector': ['error', { prefix: 'app', style: 'kebab-case' }],
    '@angular-eslint/directive-selector': ['error', { prefix: 'app', style: 'kebab-case' }],
    '@angular-eslint/no-input-rename': 'error',
    '@angular-eslint/no-output-rename': 'error',
    '@angular-eslint/no-lifecycle-call-with-effects': 'error',

    // TypeScript-specific rules (using @typescript-eslint)
    'no-explicit-any': ['error', { ignoreRestArgs: true }], // Allow `any` for rest arguments
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-empty-interface': 'warn', // Discourage empty interfaces

    // Additional recommended rules
    'no-console': ['error', { allow: ['warn', 'error'] }], // Allow console.warn and console.error for debugging
    'no-unused-labels': 'error', // Disallow unused labels
    'no-duplicate-case': 'error', // Disallow duplicate case statements
    'no-empty': 'error', // Disallow empty code blocks
    'no-unreachable': 'error', // Disallow unreachable code

    // Consider enabling these for stricter checks
    'no-param-reassign': 'warn', // Discourage parameter reassignment within functions
    'no-restricted-syntax': [
      'warn',
      'WithStatement', // Discourage the use of `with` statements
      'DoWhileStatement' // Discourage the use of `do-while` loops (prefer `while`)
    ],
    'radix': 'warn', // Encourage specifying radix (base) for parseInt()
    '@typescript-eslint/no-unused-expressions': 'warn', // Disallow unused expressions

    // Potential for further customization
    '@angular-eslint/prefer-on-push': ['warn'], // Encourage using OnPush change detection in components
    '@angular-eslint/component-selector': [ // Customize component selector rules as needed
      'error',
      { prefix: 'app', style: 'kebab-case' },
      { type: 'input', style: 'camelCase' } // Example: custom selector style for inputs
    ],
    'no-restricted-imports': ['warn', { // Disallow importing specific modules
      paths: [{ name: 'rxjs/operators', message: 'Import operators from rxjs/operators individually' }],
      patterns: [{ group: ['@angular/common/http', '@angular/fire'], message: 'Use a dedicated service for these modules' }]
    }],
    'security-node/detect-non-literal-require': 'warn', // Discourage dynamic requires
    'security-node/detect-child-process': 'warn', // Warn about potential child_process vulnerabilities

  }
};
