import React, { Component } from 'react';
import ServerCookie from 'next-cookies';
import { AUTH_COOKIE_TOKEN } from '../../services/constants';

export function privateRoute(teste) {
  return WrappedComponent =>
    class extends Component {
      static async getInitialProps(ctx) {
        const token = ServerCookie(ctx)[AUTH_COOKIE_TOKEN];

        const initialProps = { token };
        if (!token) {
          ctx.res.writeHead(302, {
            Location: '/login'
          });

          ctx.res.end();
        }

        if (WrappedComponent.getInitialProps)
          return WrappedComponent.getInitialProps(initialProps);

        return initialProps;
      }

      render() {
        return <WrappedComponent token={this.token} {...this.props} />;
      }
    };
}
