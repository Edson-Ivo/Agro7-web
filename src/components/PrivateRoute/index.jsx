import React, { Component } from 'react';

import { AUTH_COOKIE_TOKEN, AUTH_COOKIE_NAME } from '@/services/constants';

import isEmpty from '@/helpers/isEmpty';
import AuthService from '@/services/AuthService';

import { redirect } from '@/helpers/redirect';
import { getCookie } from '@/helpers/cookies';
import Error from '../Error/index';

export function privateRoute(types) {
  return WrappedComponent =>
    class extends Component {
      static async getInitialProps(ctx) {
        const token = getCookie(AUTH_COOKIE_TOKEN, ctx);
        const userData = getCookie(AUTH_COOKIE_NAME, ctx);

        let initialProps = { hasPermission: true };

        if (!token || !userData) {
          AuthService.logout();

          redirect('/login', ctx.res);
        }

        if (!isEmpty(types)) {
          const user = AuthService.decodeUserData(userData);
          const hasPermission = types.includes(user?.types);

          initialProps = {
            ...initialProps,
            hasPermission
          };
        }

        if (WrappedComponent.getInitialProps)
          return WrappedComponent.getInitialProps(initialProps);

        return initialProps;
      }

      render() {
        const { hasPermission } = this.props;

        return hasPermission ? (
          <WrappedComponent {...this.props} />
        ) : (
          <Error error={403} />
        );
      }
    };
}
