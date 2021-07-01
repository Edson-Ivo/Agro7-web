import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { useRouter } from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

import { useFetch } from '@/hooks/useFetch';
import breadcrumbRouter from '@/helpers/breadcrumbRouter';

import { BreadcrumbContainer } from './styles';

const Breadcrumb = ({ breadcrumbTitles = [] }) => {
  const router = useRouter();

  const [loading, isLoading] = useState(true);
  const [path, setPath] = useState({});
  const [crop, setCrop] = useState(false);

  const { userId } = router.query;
  const { data: dataUser } = useFetch(
    userId ? `/users/find/by/id/${userId}` : null
  );

  useEffect(() => {
    if (userId) {
      if (dataUser) {
        breadcrumbTitles = { ...breadcrumbTitles, '%usuario': dataUser?.name };

        isLoading(false);
      }
    } else {
      isLoading(false);
    }

    const { path: pathTemp, crop: cropTemp } = breadcrumbRouter(
      router,
      breadcrumbTitles
    );

    setPath(pathTemp);
    setCrop(cropTemp);
  }, [dataUser]);

  return (
    <>
      <BreadcrumbContainer>
        {(!loading &&
          path.map(({ route, name, active = true }, i) =>
            active ? (
              <h5 key={i.toString()}>
                <Link href={route}>{name}</Link>
                {crop && i === 3 && (
                  <>
                    <span className="breadcrumb__icons">
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="separator"
                      />
                    </span>
                    <span className="breadcrumb__icons">
                      <FontAwesomeIcon icon={faEllipsisH} className="dots" />
                    </span>
                  </>
                )}
                {path.length - 1 === i || (
                  <span className="breadcrumb__icons">
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="separator"
                    />
                  </span>
                )}
              </h5>
            ) : null
          )) || (
          <h5 className="skeleton_container">
            <Skeleton style={{ minHeight: '20px', maxWidth: '50%' }} />
          </h5>
        )}
      </BreadcrumbContainer>
    </>
  );
};

export default Breadcrumb;
