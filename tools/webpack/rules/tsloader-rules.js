module.exports = function override(config, env) {
  const tsRule = config.module.rules.find(
    rule => rule.loader && rule.loader.indexOf('ts-loader') > 0
  );

  const tsLoader = tsRule.loader;
  delete tsRule.loader;

  tsRule.use = [
    {
      loader: require.resolve('babel-loader'),
      options: {
        plugins: [
          // Not using inline mode creates a css file per js/ts file
          [require.resolve('emotion/babel'), { inline: true }]
        ]
      }
    },
    tsLoader
  ];

  return config;