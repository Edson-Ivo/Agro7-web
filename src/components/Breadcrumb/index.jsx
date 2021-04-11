import React from 'react';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { BreadcrumbContainer } from './styles';

const Breadcrumb = ({ path }) => (
  <>
    <BreadcrumbContainer>
      {path.map(({ route, name }, i) => (
        <h5 key={i.toString()}>
          <Link href={route}>{name}</Link>
          {path.length - 1 === i || (
            <span>
              <FontAwesomeIcon icon={faChevronRight} className="separator" />
            </span>
          )}
        </h5>
      ))}
    </BreadcrumbContainer>
  </>
);

export default Breadcrumb;
