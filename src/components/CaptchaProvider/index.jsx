import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export const captchaProvider = WrappedComponent => {
  const Wrapper = () => (
    <GoogleReCaptchaProvider
      language="pt-BR"
      reCaptchaKey={process.env.NEXT_PUBLIC_GRECAPTCHA_KEY}
      scriptProps={{ async: true }}
    >
      <WrappedComponent />
    </GoogleReCaptchaProvider>
  );

  return Wrapper;
};
