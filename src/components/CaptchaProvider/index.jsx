import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export const captchaProvider = WrappedComponent => {
  const Wrapper = () => (
    <GoogleReCaptchaProvider
      language="pt-BR"
      reCaptchaKey="6LcqN3ccAAAAABkIKLCs_b7UrpgLdJ01_LJHxLpu"
      scriptProps={{ async: true }}
    >
      <WrappedComponent />
    </GoogleReCaptchaProvider>
  );

  return Wrapper;
};
