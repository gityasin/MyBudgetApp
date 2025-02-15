const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: [
        '@react-native-async-storage/async-storage',
        '@react-navigation',
        'react-native-paper',
        'react-native-vector-icons',
        'react-native-safe-area-context',
        'react-native-gesture-handler',
      ],
    },
  }, argv);

  // Customize the config before returning it.
  if (config.mode === 'production') {
    config.output.publicPath = '/MyBudgetApp/';
  }

  // Add support for importing static assets
  config.resolve.alias = {
    ...config.resolve.alias,
    '@assets': path.resolve(__dirname, 'assets'),
  };

  return config;
}; 