import js from '@eslint/js';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest', // Використовує найновішу версію JS
      sourceType: 'module', // Підтримує import/export (ES Modules)
      globals: globals.node, // Глобальні змінні Node.js
    },
    plugins: {
      js, // Плагін для перевірки синтаксису JS
      import: importPlugin, // Плагін для перевірки правильності імпортів
    },
    rules: {
      // Правила, які раніше були в "extends"
      'no-console': 'off', // Дозволяє використовувати console.log()
      indent: ['error', 2], // Вимагає відступи у 2 пробіли
      quotes: ['error', 'single'], // Вимагає одинарні лапки
      semi: ['error', 'always'], // Вимагає крапки з комою
      'no-unused-vars': ['warn'], // Попередження про невикористані змінні
      'no-undef': 'error', // Забороняє використання невизначених змінних
      'import/no-unresolved': 'error', // Перевірка правильності імпортів
    },
  },
];
