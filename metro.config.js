// Learn more https://docs.expo.io/guides/customizing-metro
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('md');

module.exports = defaultConfig;
