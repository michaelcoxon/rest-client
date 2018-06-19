/// <binding ProjectOpened='Run - Development, Run - Production' />
const PACKAGE = require('./package.json');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require('path');
const webpack = require('webpack');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const bundleOutputDir = './dist';
const libDir = 'lib';
const srcDir = 'src';
const libraryName = 'rest-client';

var banner = PACKAGE.name + ' - ' + PACKAGE.version + ' | ' +
    '(c) ' + new Date().getFullYear() + '  ' + PACKAGE.author + ' | ' +
    PACKAGE.license + ' | ' +
    PACKAGE.homepage;

function DtsBundlePlugin() { }
DtsBundlePlugin.prototype.apply = function (compiler)
{
    compiler.plugin('done', function ()
    {
        var dts = require('dts-bundle');

        dts.bundle({
            name: libraryName,
            main: `dts/index.d.ts`,
            out: `.${bundleOutputDir}/index.d.ts`,
            outputAsModuleFolder: true // to use npm in-package typings
        });
    });
};

module.exports = () =>
{
    const env = (process.env.NODE_ENV || '').trim();
    const isDevBuild = !(env && env === 'production');

    return [{
        devtool: "source-map",
        mode: isDevBuild ? 'development' : 'production',
        entry: { 'index': `./${srcDir}/index.ts` },
        resolve: { extensions: ['.ts'] },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: `[name]${isDevBuild ? ".debug" : ""}.js`,
            publicPath: 'dist/',
            library: libraryName,
            libraryTarget: 'umd'
        },
        externals: [
            /^tslib.*$/,
            /^@michaelcoxon\/utilities.*$/
        ],
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: /src/,
                    use: 'awesome-typescript-loader?configFileName=./src/config/es5/tsconfig.json'
                }
            ]
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    parallel: true,
                    sourceMap: true,
                    uglifyOptions: {
                        ecma: 5,
                        output: {
                            beautify: false,
                            comments: /^!/
                        },
                        /*mangle: {
                            properties: {
                                regex: /^_/
                            }
                        }*/
                    }
                })
            ]
        },
        plugins: [
            new webpack.BannerPlugin(banner),
            new CheckerPlugin(),

            ...(isDevBuild
                ?
                [
                    // Plugins that apply in development builds only
                    //new webpack.SourceMapDevToolPlugin({
                    //    filename: '[file].map', // Remove this line if you prefer inline source maps
                    //    moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
                    //})
                ]
                :
                [
                    // Plugins that apply in production builds only
                    new DtsBundlePlugin(),
                ])
        ]
    }];
}