'use static'

const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const HappyPack = require('happypack');
const glob = require('glob');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const autoprefixer = require("autoprefixer");
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const speedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const hardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');


const PATHS = {
    src: path.join(__dirname, 'src')
};

const setMPA = () => {
    const entry = {};
    const HtmlWebpackPlugins = [];

    const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))

    entryFiles.map((item, index) => {
        const entryFile = item;
        const match = entryFile.match(/src\/(.*)\/index\.js/)
        const pageName = match && match[1];

        entry[pageName] = entryFile;
        HtmlWebpackPlugins.push(
            new HtmlWebpackPlugin ({
                template: path.join(__dirname, `src/${pageName}/index.html`),
                filename: `${pageName}.html`,
                chunks: [pageName],
                inject: true,
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: false
                }
            })
        );
    })

    return {
        entry,
        HtmlWebpackPlugins
    }
}

const { entry, HtmlWebpackPlugins } = setMPA();

const smp = new speedMeasureWebpackPlugin();

module.exports = smp.wrap({
    entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_[chunkhash:8].js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                // include: path.resolve('src'),
                use: [  
                    // 'babel-loader'
                    'happypack/loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')({
                                    overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                                })
                            ]
                        }
                    }
                ]
            },
            //以下为添加内容
            {
                test:/\.(png|jpg|gif|jpeg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name]_[hash:8].[ext]'
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new OptimizeCSSAssetsPlugin ({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackExternalsPlugin({
            externals: [
                {
                    module: 'react',
                    entry: 'https://unpkg.com/react@16/umd/react.development.js',
                    global: 'React'
                },{
                    module: 'react-dom',
                    entry: 'https://unpkg.com/react-dom@16/umd/react-dom.development.js',
                    global: 'ReactDOM'
                }
                
            ]
        }),
        // new BundleAnalyzerPlugin ({analyzerPort: 8889 }),
        // new FriendlyErrorsWebpackPlugin(),
        // function () {
        //     this.hooks.done.tap('done', (stats) => {
        //         if (stats.compilation.errors && process.argv.indexOf('--watch') == -1) {
        //             console.log('build error');
        //             process.exit(1);
        //         }
        //     })
        // },
        new HappyPack({
            loaders: ['babel-loader?cacheDirectory=true']
        }),
        new webpack.DllReferencePlugin({
            manifest: require('./build/library/library.json')
        }),
        new hardSourceWebpackPlugin(),
        new PurgecssPlugin ({
            paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
        })
    ].concat(HtmlWebpackPlugins),
    // stats: 'errors-only',
    // optimization: {
    //     minimizer: [
    //         new TerserPlugin({
    //             parallel: true,
    //             cache: true
    //         })
    //     ],
    // }
    // resolve: {
    //     alias: {
    //         'react': path.resolve(__dirname, './node_modules/react/umd/react.production.min.js'),
    //         'react-dom': path.resolve(__dirname, './node_modules/react-dom/umd/react-dom.production.min.js')
    //     },
    //     extension: ['.js'],
    //     mainFields: ['main']
    // }
});