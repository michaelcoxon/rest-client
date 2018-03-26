/// <binding ProjectOpened='Run - Development, Run - Production' />
const path = require('path');
const webpack = require('webpack');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const bundleOutputDir = './tests/dist';

module.exports = () =>
{
    return [{
        entry: { 'index': `./tests/index.ts` },
        resolve: { extensions: ['.ts','.js'] },
        output: {
            path: path.resolve(__dirname, bundleOutputDir),
            filename: `index.js`,
            publicPath: 'tests/dist/',
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: /tests|src/,
                    use: 'awesome-typescript-loader?configFileName=./tests/tsconfig.json'
                }
            ]
        },
        externals: {
            mocha: 'Mocha'
        },
        plugins: [
            new CheckerPlugin(),
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ]
    }];
}