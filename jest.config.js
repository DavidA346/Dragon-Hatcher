module.exports = {
    preset: 'jest-expo',
    setupFiles: ['./jest.setup.js'],
    transform: {
      // Use jest-transform-stub to mock images with any of the given extensions (png, jpg, jpeg, gif)
      '\\.(png|jpg|jpeg|gif)$': 'jest-transform-stub',
    },
    "transformIgnorePatterns": [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)"
   ]
 };
 