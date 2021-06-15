const path = require('path');
const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa');

const nextConfig = {
  webpack: config => {
    config.resolve.modules.push(path.resolve('./'));
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },

  images: {
    domains: ['dev.agrofind.com.br']
  },

  rewrites: async () => {
    return [
      {
        source: '/tecnico/propriedades/:path*',
        destination: '/propriedades/:path*'
      },
      {
        source: '/admin/propriedades/:path*',
        destination: '/propriedades/:path*'
      },
      {
        source: '/user/:slug/propriedades/:path*',
        destination: '/propriedades/:path*'
      }
    ];
  }
};

module.exports = withPlugins(
  [
    [
      withPWA,
      {
        future: { webpack5: true },
        pwa: {
          dest: 'public',
          disable: process.env.NODE_ENV === 'development'
        }
      }
    ]
  ],
  nextConfig
);
