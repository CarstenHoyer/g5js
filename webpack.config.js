const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/core/main.js',
  devtool: 'source-map',
  // resolve: {
  //   extensions: [ '.js' ] 
  // },
  optimization: {
		// We no not want to minimize our code.
		minimize: false
	},
  module: {
    defaultRules: [
      {
        type: "javascript/auto",
        resolve: {}
      },
      {
        test: /\.json$/i,
        type: "json"
      }
    ],
    rules: [
      {
        test: /\.wasm$/,
        use: 'wasm-loader'
      }
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: 'optimized.wasm',
      to: path.resolve(__dirname, 'dist/wasm'),
      context: path.resolve(__dirname, './node_modules/wasmBezierToBiarc/dist')
    }])
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  node: {
    fs: "empty"
  }
};
