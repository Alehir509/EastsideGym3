module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Add the plugins array here
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};