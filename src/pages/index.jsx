import React, { useEffect } from 'react';
import Head from 'next/head';
import { privateRoute } from '../components/PrivateRoute';

function Home() {
  return (
    <>
      <Head>
        <title>Agro7</title>
      </Head>
    </>
  );
}

// export default privateRoute()(Home);

export default Home;
