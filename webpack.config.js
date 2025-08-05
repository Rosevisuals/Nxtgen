module.exports = {
  // Other Webpack config options
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules/, // Exclude all node_modules to avoid source map warnings
      },
    ],
  },
  // Ignore specific warnings from source-map-loader
  ignoreWarnings: [
    {
      module: /react-datepicker/,
      message: /Failed to parse source map/,
    },
  ],
};