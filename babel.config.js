module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: ['react-native-reanimated/plugin'], // Thêm plugin này để bottom sheet chạy mượt
    };
};