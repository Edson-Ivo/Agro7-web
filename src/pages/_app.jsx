import React from 'react';
import Head from 'next/head';
import { ThemeProvider } from 'styled-components';
import { Provider as ReduxProvider } from 'react-redux';

import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';

import GlobalStyle from '../styles/globals';
import theme from '../styles/theme';

import store from '../store';
import { ModalProvider } from '../hooks/useModal';

config.autoAddCss = false;

const Agro7App = ({ Component, pageProps }) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
      />
      <title>Agro7</title>
    </Head>
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
        <GlobalStyle />
      </ThemeProvider>
    </ReduxProvider>
  </>
);

export default Agro7App;
