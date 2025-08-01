const { override, adjustWebpack } = require('customize-cra');

module.exports = override(
  adjustWebpack(config => {
    // Modify source-map-loader rule
    config.module.rules = config.module.rules.map(rule => {
      if (rule.enforce === 'pre' && rule.use && rule.use.includes('source-map-loader')) {
        return {
          ...rule,
          exclude: /node_modules/,
        };
      }
      return rule;
    });
    // Add ignoreWarnings for react-datepicker
    config.ignoreWarnings = config.ignoreWarnings || [];
    config.ignoreWarnings.push({
      module: /react-datepicker/,
      message: /Failed to parse source map/,
    });
    return config;
  })
);