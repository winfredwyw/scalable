const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './index.js',
    output: {
        filename: 'dy-adapter-min.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new UglifyJSPlugin()
    ]
};