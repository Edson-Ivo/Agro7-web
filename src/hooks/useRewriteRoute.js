import urlRoute from '@/helpers/urlRoute';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const useRewriteRoute = (router = null, types = null, blockTypes = []) => {
  if (!router) router = useRouter();
  if (!types) types = useSelector(state => state.user.type);

  const [route, setRoute] = useState({});

  useEffect(() => {
    setRoute(urlRoute(router, types, blockTypes));
  }, []);

  return route;
};

export default useRewriteRoute;
