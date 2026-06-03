module.exports = function(api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // Module resolver for absolute imports
            [
                'module-resolver',
                {
                    alias: {
                        '@screens': './src/screens',
                        '@components': './src/components',
                        '@context': './src/context',
                        '@hooks': './src/hooks',
                        '@services': './src/services',
                        '@utils': './src/utils',
                        '@navigation': './src/navigation',
                        '@config': './src/config',
                        '@assets': './assets',
                    },
                },
            ],
            // React Native Reanimated plugin must be last
            'react-native-reanimated/plugin',
        ],
    };
};
