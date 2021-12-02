import React, { useState } from 'react';
import { ReadMoreLink } from './styles';

const ReadMore = ({ children }) => {
  const minChar = 350;
  const [isReadMore, setIsReadMore] = useState(true);

  const toggleReadMore = () => setIsReadMore(prevState => !prevState);

  return (
    <>
      {children.length > 300 ? (
        <>
          {isReadMore ? children.slice(0, minChar) : children}
          {isReadMore ? '...' : null}
          <ReadMoreLink
            onClick={toggleReadMore}
            onKeyPress={toggleReadMore}
            role="button"
            tabIndex={0}
          >
            {isReadMore ? 'Ler mais' : ' Ler menos'}
          </ReadMoreLink>
        </>
      ) : (
        children
      )}
    </>
  );
};

export default ReadMore;
