import React from 'react';

import { AUTH_COOKIE_TOKEN, AUTH_COOKIE_NAME } from '@/services/constants';

import isEmpty from '@/helpers/isEmpty';
import AuthService from '@/services/AuthService';

import { getCookie } from '@/helpers/cookies';
import { redirect } from '@/helpers/redirect';
import Error from '../Error/index';

export const privateRoute = type => WrappedComponent => {
  const Wrapper = ({ hasPermission }) =>
    hasPermission ? (
      <WrappedComponent {...hasPermission} />
    ) : (
      <Error error={403} />
    );

  Wrapper.getInitialProps = async ctx => {
    const token = getCookie(AUTH_COOKIE_TOKEN, ctx);
    const userData = getCookie(AUTH_COOKIE_NAME, ctx);
    let hasPermission = false;

    if (!token || !userData) {
      AuthService.logout(true, ctx.asPath);

      redirect('/login', ctx.res);

      return { hasPermission };
    }

    hasPermission = true;

    if (!isEmpty(type)) {
      const user = AuthService.decodeUserData(userData);
      hasPermission = type.includes(user?.type);
    }

    return { hasPermission };
  };

  return Wrapper;
};
