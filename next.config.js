const path = require('path');
const withPlugins = require('next-compose-plugins');
const withOffline = require('next-pwa');

const nextConfig = {
  swcMinify: true,

  webpack: config => {
    config.resolve.modules.push(path.resolve('./'));
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');

    return config;
  },

  images: {
    domains: ['agrofind.com.br', 'agro7dev.herokuapp.com']
  },

  rewrites: async () => {
    return [
      {
        source: '/tecnico/propriedades/:id(\\d{1,})/:path*',
        destination: '/propriedades/:id(\\d{1,})/:path*'
      },
      {
        source: '/admin/propriedades/:id(\\d{1,})/:path*',
        destination: '/propriedades/:id(\\d{1,})/:path*'
      },
      {
        source:
          '/admin/users/:userId(\\d{1,})/propriedades/:id(\\d{1,})/:path*',
        destination: '/propriedades/:id(\\d{1,})/:path*?userId=:userId'
      },
      {
        source:
          '/admin/users/:userId(\\d{1,})/tecnico/propriedades/:id(\\d{1,})/:path*',
        destination: '/propriedades/:id(\\d{1,})/:path*?userId=:userId'
      },
      {
        source:
          '/admin/users/:userId(\\d{1,})/caderno-produtor/:id(\\d{1,})/:path*',
        destination: '/caderno-produtor/:id(\\d{1,})/:path*?userId=:userId'
      },
      {
        source:
          '/admin/vendas/:pageOptions(distribuidoras|transportadoras)/:path*',
        destination: '/vendas/:pageOptions/:path*'
      },
      {
        source:
          '/admin/users/:userId(\\d{1,})/vendas/:pageOptions(distribuidoras|transportadoras)/:path*',
        destination:
          '/vendas/:pageOptions(distribuidoras|transportadoras)/:path*?userId=:userId'
      },
      {
        source: '/admin/vendas/:id(\\d{1,})/:path*',
        destination: '/vendas/:id(\\d{1,})/:path*'
      },
      {
        source: '/admin/users/:userId(\\d{1,})/vendas/:id(\\d{1,})/:path*',
        destination: '/vendas/:id(\\d{1,})/:path*?userId=:userId'
      },
      {
        source: '/admin/users/:userId(\\d{1,})/insumos/:id(\\d{1,})/:path*',
        destination: '/insumos/:id(\\d{1,})/:path*?userId=:userId'
      }
    ];
  }
};

module.exports = withPlugins(
  [
    [
      withOffline,
      {
        pwa: {
          dest: 'public',
          disable: process.env.NODE_ENV === 'development',
          cacheOnFrontEndNav: true
        }
      }
    ]
  ],
  nextConfig
);
