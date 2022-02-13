import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ImageContent, UpperLabel } from './styles';

const ImageContainer = ({
  src = '',
  url = '',
  alt = '',
  label = '',
  zoom = false
}) => {
  const image = src || '/assets/image-error.png';

  return (
    <>
      {label && <UpperLabel>{label}</UpperLabel>}
      <ImageContent zoom={zoom}>
        {zoom && src ? (
          <Link href={url || src} replace passHref>
            <a target="_blank" rel="noopener noreferrer">
              <Image src={image} alt={alt} layout="fill" objectFit="contain" />
            </a>
          </Link>
        ) : (
          <Image
            src={image}
            alt={alt}
            layout="fill"
            objectFit="contain"
            unoptimized={false}
          />
        )}
      </ImageContent>
    </>
  );
};

export default ImageContainer;
