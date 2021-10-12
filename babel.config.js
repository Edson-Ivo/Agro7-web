module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-env': {
          targets: '>0.2%, not dead, not op_mini all'
        }
      }
    ]
  ],
  plugins: [
    'inline-react-svg',
    ['styled-components', { ssr: true, displayName: false }],
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src'
        }
      }
    ]
  ]
};
