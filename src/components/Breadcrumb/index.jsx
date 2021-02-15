import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const BreadcrumbContainer = styled.div`
  color: ${props => props.theme.colors.black_50};
  border-bottom: 4px solid ${props => props.theme.colors.border};
  padding-bottom: 16px;

  h5 {
    display: inline-block;
  }

  a {
    color: ${props => props.theme.colors.black_50};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  span {
    margin: 5px;
  }
`;

const Breadcrumb = ({ path }) => (
  <>
    <BreadcrumbContainer>
      {path.map(({ route, name }, i) => (
        <h5 key={name}>
          <Link href={route}>{name}</Link>
          {path.length - 1 === i || <span>/</span>}
        </h5>
      ))}
    </BreadcrumbContainer>
  </>
);

export default Breadcrumb;
