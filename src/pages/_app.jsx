import React from 'react';
import Head from 'next/head';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';

import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';

import GlobalStyle from '../styles/globals';
import theme from '../styles/theme';

import store from '../store';

config.autoAddCss = false;

const MyApp = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Agro7</title>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
      />
    </Head>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
        <GlobalStyle />
      </ThemeProvider>
    </Provider>
  </>
);

export default MyApp;
