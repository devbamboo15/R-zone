var baseConfig = require('./base');

baseConfig.output.filename = '[name].js';
baseConfig.mode = 'development';
baseConfig.devServer = {
  contentBase: './dist',
  hot: true,
  historyApiFallback: true,
  open: true,
  stats: 'minimal',
};

module.exports = baseConfig;
