import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import usersTypes from '@/helpers/usersTypes';

const useUserAccess = (route = {}, userId = null, types = null) => {
  if (!types) types = useSelector(state => state.user.type);
  const id = useSelector(state => state.user.id);

  const [userAccess, setUserAccess] = useState(false);
  const [userAccessLoading, setUserAccessLoading] = useState(true);

  useEffect(() => {
    setUserAccess(
      (![usersTypes[3], usersTypes[4]].includes(route?.permission) &&
        route?.hasPermission) ||
        userId === id
    );

    setUserAccessLoading(false);
  }, [route, userId]);

  return [userAccess, userAccessLoading];
};

export default useUserAccess;
