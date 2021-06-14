import React from 'react';
import Skeleton from 'react-loading-skeleton';

import Breadcrumb from '@/components/Breadcrumb';
import { StyledSectionHeaderContent } from './styles';

const skeletonStyle = {
  maxWidth: '60%',
  minHeight: '20px'
};

export const SectionHeaderContent = ({
  children,
  title = '',
  breadcrumb = [],
  description = null,
  isLoading = false
}) => (
  <StyledSectionHeaderContent isLoading={isLoading}>
    {isLoading ? (
      <h5 className="skeleton_container">
        <Skeleton style={{ ...skeletonStyle, maxWidth: '50%' }} />
      </h5>
    ) : (
      <Breadcrumb path={breadcrumb} />
    )}

    <h2>{isLoading ? <Skeleton style={skeletonStyle} /> : title}</h2>
    {description && (
      <p>
        {isLoading ? (
          <Skeleton
            style={{
              ...skeletonStyle,
              maxWidth: '40%',
              marginBottom: '8px'
            }}
            className="skeleton_description"
            count={2}
          />
        ) : (
          description
        )}
      </p>
    )}

    {children && (
      <>{isLoading ? <Skeleton style={skeletonStyle} count={2} /> : children}</>
    )}
  </StyledSectionHeaderContent>
);
