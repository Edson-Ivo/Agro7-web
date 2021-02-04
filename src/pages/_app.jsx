import React from 'react';

import { ThemeProvider } from 'styled-components';

import GlobalStyle from '../styles/globals';
import theme from '../styles/theme';

const MyApp = ({ Component, pageProps }) => (
  <ThemeProvider theme={theme}>
    <Component {...pageProps} />
    <GlobalStyle />
  </ThemeProvider>
);

export default MyApp;
