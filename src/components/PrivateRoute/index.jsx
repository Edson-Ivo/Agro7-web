import React, { Component } from 'react';
import ServerCookie from 'next-cookies';
import { AUTH_COOKIE_TOKEN, AUTH_COOKIE_NAME } from '../../services/constants';
import AuthService from '../../services/AuthService';

export function privateRoute(types) {
  return WrappedComponent =>
    class extends Component {
      static async getInitialProps(ctx) {
        const token = ServerCookie(ctx)[AUTH_COOKIE_TOKEN];

        let initialProps = { token, permission: true };

        if (!token) {
          ctx.res.writeHead(302, {
            Location: '/login'
          });

          ctx.res.end();
        }

        if (types) {
          let user = ServerCookie(ctx)[AUTH_COOKIE_NAME];

          if (user) {
            user = AuthService.decodeUserData(user);
            let perm = true;

            if (!types.includes(user.types)) {
              perm = false;
            }

            initialProps = { ...initialProps, permission: perm };
          } else {
            ctx.res.writeHead(302, {
              Location: '/login'
            });

            ctx.res.end();
          }
        }

        if (WrappedComponent.getInitialProps)
          return WrappedComponent.getInitialProps(initialProps);

        return initialProps;
      }

      render() {
        return (
          <WrappedComponent
            token={this.token}
            permission={this.permission}
            {...this.props}
          />
        );
      }
    };
}
