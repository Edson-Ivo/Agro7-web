export const redirect = (url, server) => {
  const page = `${url}?redirected=true`;

  server.writeHead(302, {
    Location: page
  });

  server.end();
};
