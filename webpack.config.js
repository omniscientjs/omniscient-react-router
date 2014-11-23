module.exports = {
  context: __dirname,
  entry: {
    'index': './index.js'
  },
  output: {
    filename: '[name].entry.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'jsx-loader?harmony&insertPragma=React.DOM' }
    ]
  }
};
