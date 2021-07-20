import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import {
  StyledCardContentButton,
  StyledCardContentButtonImage,
  StyledCardContentButtonText,
  StyledCardContentButtonArrow
} from './styles';

const LinkWrapper = ({ children, linkTo = null }) =>
  linkTo ? (
    <div>
      <Link href={linkTo}>
        <a>{children}</a>
      </Link>
    </div>
  ) : (
    <>{children}</>
  );

export const CardContentButton = ({
  title,
  description = null,
  faIcon = null,
  imageSrc = null,
  linkTo = null,
  onClick = null
}) => (
  <LinkWrapper linkTo={linkTo}>
    <StyledCardContentButton cursor={onClick && 'pointer'} onClick={onClick}>
      <StyledCardContentButtonImage>
        {faIcon && <FontAwesomeIcon icon={faIcon} />}
        {imageSrc && (
          <Image src={imageSrc} alt={title} width={28} height={28} />
        )}
      </StyledCardContentButtonImage>
      <StyledCardContentButtonText>
        <h6>{title}</h6>
        {description && <p>{description}</p>}
      </StyledCardContentButtonText>
      {(linkTo || onClick) && (
        <StyledCardContentButtonArrow>
          <FontAwesomeIcon icon={faChevronRight} />
        </StyledCardContentButtonArrow>
      )}
    </StyledCardContentButton>
  </LinkWrapper>
);
