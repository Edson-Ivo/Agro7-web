import React, { Component } from 'react';
import ServerCookie from 'next-cookies';
import { AUTH_COOKIE_TOKEN, AUTH_COOKIE_NAME } from '@/services/constants';
import AuthService from '@/services/AuthService';
import { redirect } from '@/helpers/redirect';

export function privateRoute(types) {
  return WrappedComponent =>
    class extends Component {
      static async getInitialProps(ctx) {
        const token = ServerCookie(ctx)[AUTH_COOKIE_TOKEN];
        const userData = ServerCookie(ctx)[AUTH_COOKIE_NAME];

        let initialProps = { permission: true, type: 'independent' };

        if (!token || !userData) {
          redirect('/login', ctx.res);
        }

        if (types) {
          let user = ServerCookie(ctx)[AUTH_COOKIE_NAME];

          if (user) {
            user = AuthService.decodeUserData(user);
            let perm = true;

            if (!types.includes(user.types)) {
              perm = false;
            }

            initialProps = {
              ...initialProps,
              permission: perm,
              type: user.types
            };
          } else {
            redirect('/login', ctx.res);
          }
        }

        if (WrappedComponent.getInitialProps)
          return WrappedComponent.getInitialProps(initialProps);

        return initialProps;
      }

      render() {
        return (
          <WrappedComponent permission={this.permission} {...this.props} />
        );
      }
    };
}
