'use strict';

module.exports = {
    diff: true,
    extension: ['ts'],
    package: './package.json',
    reporter: 'spec',
    slow: 75,
    timeout: 2000,
    ui: 'bdd',
    require: 'ts-node/register',
    spec: './tests/**/*.unit.spec.ts'
};