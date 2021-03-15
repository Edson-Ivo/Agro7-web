const path = require('path');
const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');

const nextConfig = {
  webpack: config => {
    config.resolve.modules.push(path.resolve('./'));
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  }
};

module.exports = withPlugins(
  [
    [
      withImages,
      {
        esModule: true
      }
    ]
  ],
  nextConfig
);
