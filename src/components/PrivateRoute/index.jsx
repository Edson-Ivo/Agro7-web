/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import Router from 'next/router';

import { AUTH_COOKIE_TOKEN, AUTH_COOKIE_NAME } from '@/services/constants';

import isEmpty from '@/helpers/isEmpty';
import AuthService from '@/services/AuthService';

import { getCookie } from '@/helpers/cookies';
import Error from '../Error/index';

export const privateRoute = type => WrappedComponent =>
  class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        token: getCookie(AUTH_COOKIE_TOKEN),
        userData: getCookie(AUTH_COOKIE_NAME),
        hasPermission: true
      };
    }

    componentDidMount() {
      const { token, userData } = this.state;

      if (!token || !userData) {
        AuthService.logout();
        Router.push('/login?redirected=true');
      }

      if (!isEmpty(type)) {
        const user = AuthService.decodeUserData(userData);
        this.setState({ hasPermission: type.includes(user?.type) });
      }
    }

    render() {
      const { hasPermission } = this.state;

      return hasPermission ? (
        <WrappedComponent {...hasPermission} />
      ) : (
        <Error error={403} />
      );
    }
  };
