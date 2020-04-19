const merge = require('webpack-merge')
const baseConfig = require('./webpack.base');

const devConfig = {
    mode: 'development',
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './dist',
        hot: true  // webpack文档表明配置了此会自动引入这个插件
    }
};

module.exports = merge(baseConfig, devConfig);